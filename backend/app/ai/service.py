# import re

# from app.models.menu_item import MenuItem
# from app.ai.gemini import extract_preferences


# class AIService:

#     @staticmethod
#     def search(query):

#         prefs = extract_preferences(query)

#         items = MenuItem.query.filter_by(available=True).all()

#         results = []

#         for item in items:

#             score = 0

#             text = f"{item.name} {item.description}".lower()

#             # ------------------------
#             # Veg / Non-Veg
#             # ------------------------

#             if prefs["veg"]:
#                 if item.is_vegetarian:
#                     score += 25
#                 else:
#                     continue

#             if prefs["non_veg"]:
#                 if not item.is_vegetarian:
#                     score += 25
#                 else:
#                     continue

#             # ------------------------
#             # Spicy
#             # ------------------------

#             if prefs["spicy"]:

#                 if item.is_spicy:
#                     score += 20
#                 else:
#                     continue

#             # ------------------------
#             # Budget
#             # ------------------------

#             if prefs["max_price"] is not None:

#                 if item.price <= prefs["max_price"]:
#                     score += 20
#                 else:
#                     continue

#             # ------------------------
#             # Sweet
#             # ------------------------

#             if prefs["sweet"]:

#                 sweet_words = [
#                     "cake",
#                     "ice cream",
#                     "dessert",
#                     "brownie",
#                     "pastry",
#                     "gulab",
#                     "sweet",
#                     "cream"
#                 ]

#                 if any(word in text for word in sweet_words):
#                     score += 20
#                 else:
#                     continue

#             # ------------------------
#             # Healthy
#             # ------------------------

#             if prefs["healthy"]:

#                 healthy_words = [
#                     "salad",
#                     "grilled",
#                     "soup",
#                     "boiled",
#                     "healthy"
#                 ]

#                 if any(word in text for word in healthy_words):
#                     score += 20

#             # ------------------------
#             # Hungry
#             # ------------------------

#             if prefs["hungry"]:

#                 if item.price >= 150:
#                     score += 10

#             # ------------------------
#             # Category
#             # ------------------------

#             if prefs["category"]:

#                 if prefs["category"].lower() in text:
#                     score += 30

#             # ------------------------
#             # Keywords
#             # ------------------------

#             for word in prefs["keywords"]:

#                 if word.lower() in text:
#                     score += 8

#             if score > 0:

#                 results.append({
#                     "id": item.id,
#                     "name": item.name,
#                     "description": item.description,
#                     "price": item.price,
#                     "image": item.image_url,
#                     "is_veg": item.is_vegetarian,
#                     "category": item.category.name if item.category else "",
#                     "score": score
#                 })

#         results.sort(
#             key=lambda x: x["score"],
#             reverse=True
#         )

#         return results



from app.models.menu_item import MenuItem
from app.ai.ai_search import search_menu


class AIService:

    @staticmethod
    def search(query):

        items = MenuItem.query.filter_by(
            available=True
        ).all()

        engine, ranked = search_menu(
            query,
            items,
            limit=10
        )

        results = []

        for item, score, reason in ranked:

            results.append({
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": item.price,
                "image": item.image_url,
                "is_veg": item.is_vegetarian,
                "category": item.category.name if item.category else "",
                "score": round(score, 1),
                "reason": reason
            })

        return results
