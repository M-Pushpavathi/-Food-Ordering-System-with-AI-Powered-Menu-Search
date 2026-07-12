from app.extensions import db
from app.models.category import Category


class CategoryService:

    @staticmethod
    def get_all():
        return Category.query.all()

    @staticmethod
    def get_one(category_id):
        return Category.query.get(category_id)

    @staticmethod
    def create(data):

        if Category.query.filter_by(name=data["name"]).first():
            return None

        category = Category(
            name=data["name"]
        )

        db.session.add(category)
        db.session.commit()

        return category

    @staticmethod
    def update(category_id, data):

        category = Category.query.get(category_id)

        if not category:
            return None

        category.name = data["name"]

        db.session.commit()

        return category

    @staticmethod
    def delete(category_id):

        category = Category.query.get(category_id)

        if not category:
            return False

        if len(category.menu_items) > 0:
            return False

        db.session.delete(category)
        db.session.commit()

        return True