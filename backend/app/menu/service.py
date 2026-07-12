from app.extensions import db
from app.models.menu_item import MenuItem
from app.models.category import Category


class MenuService:

    @staticmethod
    def get_all():

        items = MenuItem.query.all()

        return [
            {
                "id": item.id,
                "name": item.name,
                "description": item.description,
                "price": item.price,
                "image_url": item.image_url,
                "is_vegetarian": item.is_vegetarian,
                "is_spicy": item.is_spicy,
                "available": item.available,
                "category_id": item.category_id
            }
            for item in items
        ]

    @staticmethod
    def get_one(item_id):
        return MenuItem.query.get(item_id)

    @staticmethod
    def create(data):

        category_id = data.get("category_id")

        # If frontend sends category name instead of id
        if not category_id and data.get("category"):
            category = Category.query.filter_by(
                name=data["category"]
            ).first()

            if category:
                category_id = category.id

        item = MenuItem(
            name=data["name"],
            description=data.get("description", ""),
            price=float(data.get("price", 0)),
            image_url=data.get("image_url") or data.get("image"),
            is_vegetarian=data.get("is_vegetarian", False),
            is_spicy=data.get("is_spicy", False),
            available=data.get("available", True),
            category_id=category_id
        )

        db.session.add(item)
        db.session.commit()

        return item

    @staticmethod
    def update(item_id, data):

        item = MenuItem.query.get(item_id)

        if not item:
            return None

        if "category" in data:
            category = Category.query.filter_by(
                name=data["category"]
            ).first()

            if category:
                item.category_id = category.id

        if "category_id" in data:
            item.category_id = data["category_id"]

        item.name = data.get("name", item.name)
        item.description = data.get("description", item.description)
        item.price = data.get("price", item.price)
        item.image_url = data.get("image_url") or data.get("image", item.image_url)
        item.is_vegetarian = data.get("is_vegetarian", item.is_vegetarian)
        item.is_spicy = data.get("is_spicy", item.is_spicy)
        item.available = data.get("available", item.available)

        db.session.commit()

        return item

    @staticmethod
    def delete(item_id):

        item = MenuItem.query.get(item_id)

        if not item:
            return False

        db.session.delete(item)
        db.session.commit()

        return True