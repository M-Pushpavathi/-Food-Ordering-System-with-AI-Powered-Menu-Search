from flask import request, jsonify
from app.menu.service import MenuService


class MenuController:

    @staticmethod
    def get_all():

        items = MenuService.get_all()

        return jsonify(items), 200

    @staticmethod
    def get_one(item_id):

        item = MenuService.get_one(item_id)

        if not item:
            return jsonify({
                "success": False,
                "message": "Menu Item Not Found"
            }), 404

        return jsonify({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "image_url": item.image_url,
            "is_vegetarian": item.is_vegetarian,
            "is_spicy": item.is_spicy,
            "available": item.available,
            "category_id": item.category_id
        }), 200

    @staticmethod
    def create():

        data = request.get_json()

        item = MenuService.create(data)

        if not item:
            return jsonify({
                "success": False,
                "message": "Could not create menu item"
            }), 400

        return jsonify({
            "success": True,
            "message": "Menu Item Added Successfully",
            "id": item.id
        }), 201

    @staticmethod
    def update(item_id):

        data = request.get_json()

        item = MenuService.update(item_id, data)

        if not item:
            return jsonify({
                "success": False,
                "message": "Menu Item Not Found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Menu Updated Successfully"
        }), 200

    @staticmethod
    def delete(item_id):

        deleted = MenuService.delete(item_id)

        if not deleted:
            return jsonify({
                "success": False,
                "message": "Menu Item Not Found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Menu Deleted Successfully"
        }), 200