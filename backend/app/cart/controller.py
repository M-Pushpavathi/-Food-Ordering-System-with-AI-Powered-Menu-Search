from flask import request, jsonify

from flask_jwt_extended import get_jwt_identity

from app.cart.service import CartService


class CartController:

    @staticmethod
    def get_cart():

        user = int(get_jwt_identity())

        return jsonify(
            CartService.get_cart(user)
        )

    @staticmethod
    def add_item():

        user = int(get_jwt_identity())

        data = request.get_json()

        item = CartService.add_item(user, data)

        if item is None:
            return jsonify({
                "success": False,
                "message": "Menu Item Not Found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Added To Cart"
        }), 201

    @staticmethod
    def update(cart_id):

        data = request.get_json()

        item = CartService.update_quantity(
            cart_id,
            data["quantity"]
        )

        if item is None:
            return jsonify({
                "success": False
            }),404

        return jsonify({
            "success":True,
            "message":"Cart Updated"
        })

    @staticmethod
    def delete(cart_id):

        deleted = CartService.delete(cart_id)

        if not deleted:
            return jsonify({
                "success":False
            }),404

        return jsonify({
            "success":True,
            "message":"Removed From Cart"
        })