"""AI-powered natural-language menu search.

Two engines, selected automatically:

1. "llm"       -> if ANTHROPIC_API_KEY or OPENAI_API_KEY is set, the query and
                  the available menu are sent to an LLM which returns ranked,
                  reasoned matches. This is true semantic understanding.
2. "heuristic" -> otherwise, a deterministic natural-language parser extracts
                  price caps, veg/non-veg intent, spicy/mild intent, and
                  keyword relevance, then scores every available item.

The heuristic engine means the feature works with ZERO configuration. Setting a
key upgrades quality without any code change. `search_menu` reports which engine
ran (`engine` field) so the behaviour is transparent, never hidden.
"""
from __future__ import annotations

import json
import os
import re
from typing import List, Tuple

from app.models.menu_item import MenuItem
# from .models import MenuItem

# Words that hint at each intent. Deliberately small and readable.
_VEG_HINTS = {"veg", "vegetarian", "veggie", "plant", "meatless", "no meat"}
_NONVEG_HINTS = {
    "non-veg", "nonveg", "non veg", "chicken", "mutton", "lamb", "fish",
    "prawn", "egg", "meat", "beef", "seafood",
}
_SPICY_HINTS = {"spicy", "hot", "fiery", "chilli", "chili", "masala"}
_MILD_HINTS = {"mild", "not spicy", "non spicy", "less spicy", "no spice"}
_LIGHT_HINTS = {"light", "healthy", "not heavy", "low calorie", "not fried",
                "non fried", "grilled", "steamed", "salad", "fresh"}

# Very common English words we don't want to treat as menu keywords.
_STOPWORDS = {
    "a", "an", "the", "and", "or", "for", "with", "without", "under", "below",
    "less", "than", "over", "above", "something", "some", "that", "is", "not",
    "me", "want", "would", "like", "please", "give", "show", "find", "of",
    "to", "in", "on", "rupees", "rupee", "rs", "inr", "price", "cheap",
    "budget", "food", "dish", "dishes", "item", "items", "order", "any",
}


def _extract_price_cap(text: str) -> float | None:
    """Return a max price if the query implies one (e.g. 'under 200')."""
    # patterns: "under 200", "below 150", "less than 300", "<= 250", "200 rupees"
    m = re.search(
        r"(?:under|below|less than|upto|up to|max|maximum|within|<=?)\s*(?:rs\.?|inr|₹)?\s*(\d+)",
        text,
    )
    if m:
        return float(m.group(1))
    m = re.search(r"(?:rs\.?|inr|₹)\s*(\d+)", text)
    if m:
        return float(m.group(1))
    m = re.search(r"(\d+)\s*(?:rupees?|rs\.?|inr)", text)
    if m:
        return float(m.group(1))
    return None


def _contains_any(text: str, phrases: set) -> bool:
    return any(p in text for p in phrases)


def _tokenize(text: str) -> List[str]:
    words = re.findall(r"[a-zA-Z]+", text.lower())
    return [w for w in words if w not in _STOPWORDS and len(w) > 2]


def _heuristic_score(query: str, item: MenuItem) -> Tuple[float, str]:
    """Score one item 0-100 against the query and explain why."""
    q = query.lower()
    score = 0.0
    reasons: List[str] = []

    # --- Hard-ish constraints (large weight) ---
    price_cap = _extract_price_cap(q)
    if price_cap is not None:
        if item.price <= price_cap:
            score += 25
            reasons.append(f"within budget (₹{item.price:.0f} ≤ ₹{price_cap:.0f})")
        else:
            score -= 40  # over budget -> strongly demote
            reasons.append(f"over budget (₹{item.price:.0f} > ₹{price_cap:.0f})")

    wants_veg = _contains_any(q, _VEG_HINTS) and not _contains_any(q, _NONVEG_HINTS)
    wants_nonveg = _contains_any(q, _NONVEG_HINTS)
    if wants_veg:
        if item.is_vegetarian:
            score += 25
            reasons.append("vegetarian")
        else:
            score -= 40
            reasons.append("not vegetarian")
    elif wants_nonveg:
        if not item.is_vegetarian:
            score += 20
            reasons.append("non-vegetarian")

    # --- Soft preferences ---
    wants_mild = _contains_any(q, _MILD_HINTS)
    wants_spicy = _contains_any(q, _SPICY_HINTS) and not wants_mild
    if wants_spicy:
        if item.is_spicy:
            score += 20
            reasons.append("spicy")
        else:
            score -= 8
    elif wants_mild:
        if not item.is_spicy:
            score += 20
            reasons.append("mild")
        else:
            score -= 15
            reasons.append("this one is spicy")

    if _contains_any(q, _LIGHT_HINTS):
        haystack = f"{item.name} {item.description}".lower()
        if any(w in haystack for w in
               ("grill", "steam", "salad", "soup", "light", "fresh", "roast")):
            score += 15
            reasons.append("light / not fried")
        if "fried" in haystack or "deep" in haystack:
            score -= 10

    # --- Keyword relevance against name / description / category ---
    tokens = set(_tokenize(q))
    # haystack_tokens = set(_tokenize(f"{item.name} {item.description} {item.category}"))
    category = item.category.name if item.category else ""

    haystack_tokens = set(
      _tokenize(
            f"{item.name} {item.description} {category}"
        )
    )
    overlap = tokens & haystack_tokens
    if overlap:
        score += min(30, 10 * len(overlap))
        reasons.append("matches: " + ", ".join(sorted(overlap)))

    if not reasons:
        reasons.append("general match")

    return max(0.0, min(100.0, score)), "; ".join(reasons)


def _heuristic_search(query: str, items: List[MenuItem], limit: int):
    scored = []
    for it in items:
        s, why = _heuristic_score(query, it)
        if s > 0:
            scored.append((it, s, why))
    scored.sort(key=lambda t: t[1], reverse=True)
    return scored[:limit]


# --------------------------------------------------------------------------
# Optional LLM engine
# --------------------------------------------------------------------------
def _llm_search(query: str, items: List[MenuItem], limit: int):
    """Rank items with an LLM. Returns None on any failure -> caller falls back."""
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    if not (anthropic_key or openai_key):
        return None

    menu = [
        {
            "id": it.id, "name": it.name, "description": it.description,
            "category": it.category.name if it.category else "", "price": it.price,
            "veg": it.is_vegetarian, "spicy": it.is_spicy,
        }
        for it in items
    ]
    prompt = (
        "You are a restaurant menu search engine. Given a customer's natural "
        "language request and a JSON list of AVAILABLE menu items, return the "
        "best matches.\n\n"
        f"Customer request: {query!r}\n\n"
        f"Menu (JSON): {json.dumps(menu)}\n\n"
        "Respond ONLY with a JSON array (no prose, no markdown fences) of objects "
        '{"id": <int>, "score": <0-100 int>, "reason": "<short reason>"} for the '
        f"most relevant items, best first, at most {limit}. Respect hard "
        "constraints like price caps and vegetarian requirements."
    )

    try:
        raw = _call_anthropic(prompt, anthropic_key) if anthropic_key \
            else _call_openai(prompt, openai_key)
        raw = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        ranked = json.loads(raw)
        by_id = {it.id: it for it in items}
        out = []
        for r in ranked:
            it = by_id.get(r.get("id"))
            if it is not None:
                out.append((it, float(r.get("score", 0)), str(r.get("reason", ""))))
        return out[:limit] if out else None
    except Exception:
        # Never let an LLM/network error break search -> fall back to heuristic.
        return None


def _call_anthropic(prompt: str, key: str) -> str:
    import urllib.request
    body = json.dumps({
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={
            "content-type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return "".join(b.get("text", "") for b in data.get("content", []))


def _call_openai(prompt: str, key: str) -> str:
    import urllib.request
    body = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions", data=body,
        headers={"content-type": "application/json",
                 "authorization": f"Bearer {key}"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return data["choices"][0]["message"]["content"]


# --------------------------------------------------------------------------
# Public entry point
# --------------------------------------------------------------------------
# def search_menu(query: str, available_items: List[MenuItem], limit: int = 10):
#     """Return (engine_name, [(item, score, reason), ...]).

#     Only AVAILABLE items should be passed in.
#     """
#     llm = _llm_search(query, available_items, limit)
#     if llm is not None:
#         return "llm", llm
#     return "heuristic", _heuristic_search(query, available_items, limit)
def search_menu(query: str, available_items: List[MenuItem], limit: int = 10):
    return "heuristic", _heuristic_search(query, available_items, limit)
