import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_preferences(query: str):

    prompt = f"""
You are a food preference extractor.

User:
{query}

Return ONLY valid JSON.

Example:

{{
"veg": true,
"non_veg": false,
"spicy": true,
"sweet": false,
"healthy": false,
"hungry": true,
"category":"",
"max_price":200,
"keywords":["biryani"]
}}

Do not explain anything.
Return JSON only.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    print(text)      # <-- Keep this while testing

    return json.loads(text)