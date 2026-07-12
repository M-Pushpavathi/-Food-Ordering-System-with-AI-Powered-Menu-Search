import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { FiCpu, FiZap } from "react-icons/fi";
import { AppShell } from "@/components/layout/AppShell";
import { SearchBar } from "@/components/common/SearchBar";
import { MenuCard, type MenuItem } from "@/components/food/MenuCard";
import { EmptyState, ErrorState } from "@/components/common/EmptyState";
import { LoadingCards, Spinner } from "@/components/common/Loading";
import { aiApi, cartApi } from "@/services/api";

export const Route = createFileRoute("/ai-search")({ component: AISearchPage });

const EXAMPLES = [
  "I want something spicy",
  "Vegetarian food under ₹200",
  "Healthy dinner",
  "Not fried",
  "Comfort food for a rainy day",
  "Light lunch under 400 calories",
];

function AISearchPage() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [results, setResults] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (query: string) => {
    const term = query.trim();
    if (!term) return;
    setSubmitted(term);
    setLoading(true);
    setError(null);
    try {
      const data = await aiApi.search(term);
      const items: MenuItem[] = Array.isArray(data) ? data : (data.results ?? data.items ?? []);
      setResults(items);
    } catch {
      setError("AI search is unavailable right now.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: MenuItem) => {
    try {
      await cartApi.add({ menu_id: item.id, quantity: 1 });
      toast.success(`${item.name} added to cart`);
    } catch {
      toast.error("Could not add to cart");
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <FiCpu /> AI Powered
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-6xl">
            Tell us what you're <span className="text-primary">craving</span>.
          </h1>
          <p className="mt-4 text-muted-foreground">Our AI understands moods, dietary needs, and taste. Just type it naturally.</p>
        </div>

        <div className="mt-10">
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={() => run(q)}
            placeholder="e.g. Something warm and comforting under ₹350..."
            right={<button onClick={() => run(q)} className="inline-flex shrink-0 items-center gap-1 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant"><FiZap /> Search</button>}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => { setQ(ex); run(ex); }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12">
          {loading ? <LoadingCards count={6} /> :
           error ? <ErrorState message={error} onRetry={() => run(submitted)} /> :
           results === null ? (
            <div className="rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-2xl text-primary"><FiCpu /></div>
              <h3 className="mt-4 font-display text-xl font-semibold">Ask the AI</h3>
              <p className="mt-2 text-sm text-muted-foreground">Try one of the suggestions above, or type your own craving.</p>
            </div>
          ) : results.length ? (
            <>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="hidden" />
                <span>Showing <strong className="text-foreground">{results.length}</strong> results for “{submitted}”</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((r) => <MenuCard key={r.id} item={r} onAdd={addToCart} />)}
              </div>
            </>
          ) : (
            <EmptyState title="No matches" description={`We couldn't find dishes for "${submitted}". Try a different phrasing.`} />
          )}
        </div>
      </div>
    </AppShell>
  );
}