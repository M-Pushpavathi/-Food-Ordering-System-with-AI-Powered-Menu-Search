from flask import request, jsonify

from app.category.service import CategoryService


class CategoryController:

    @staticmethod
    def get_all():

        categories = CategoryService.get_all()

        return jsonify([
            {
                "id": c.id,
                "name": c.name
            }
            for c in categories
        ])

    @staticmethod
    def create():

        data = request.get_json()

        category = CategoryService.create(data)

        if category is None:
            return jsonify({
                "success": False,
                "message": "Category already exists"
            }), 400

        return jsonify({
            "success": True,
            "message": "Category Created",
            "id": category.id
        }), 201

    @staticmethod
    def update(category_id):

        data = request.get_json()

        category = CategoryService.update(category_id, data)

        if category is None:
            return jsonify({
                "success": False,
                "message": "Category Not Found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Category Updated"
        })

    @staticmethod
    def delete(category_id):

        deleted = CategoryService.delete(category_id)

        if not deleted:
            return jsonify({
                "success": False,
                "message": "Category contains menu items or does not exist"
            }), 400

        return jsonify({
            "success": True,
            "message": "Category Deleted"
        })