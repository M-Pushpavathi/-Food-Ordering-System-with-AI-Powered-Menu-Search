from flask import jsonify, request

from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity
)

from app.order.service import OrderService


class OrderController:

    @staticmethod
    def place_order():

        user_id = int(get_jwt_identity())

        order = OrderService.place_order(user_id)

        if order is None:
            return jsonify({
                "success": False,
                "message": "Cart is Empty"
            }), 400

        return jsonify({
            "success": True,
            "message": "Order Placed Successfully",
            "id": order.id,
            "total": order.total_amount,
            "status": order.status.value
        }), 201

    @staticmethod
    def get_orders():

        user_id = int(get_jwt_identity())

        orders = OrderService.get_orders(user_id)

        return jsonify([
            {
                "id": order.id,
                "total_amount": order.total_amount,
                "status": order.status.value,
                "created_at": order.created_at
            }
            for order in orders
        ])

    @staticmethod
    def get_order(order_id):

        claims = get_jwt()

        if claims["role"] == "ADMIN":
            order = OrderService.get_order_by_id(order_id)
        else:
            user_id = int(get_jwt_identity())
            order = OrderService.get_order(order_id, user_id)

        if order is None:
            return jsonify({
                "success": False,
                "message": "Order Not Found"
            }), 404

        return jsonify({
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status.value,
            "created_at": order.created_at,
            "items": [
                {
                    "id": item.id,
                    "name": item.menu_item.name,
                    "price": item.price,
                    "quantity": item.quantity
                }
                for item in order.order_items
            ]
        })

    @staticmethod
    def update_status(order_id):

        claims = get_jwt()

        if claims["role"] != "ADMIN":
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 403

        data = request.get_json()

        order = OrderService.update_status(
            order_id,
            data["status"]
        )

        if order is None:
            return jsonify({
                "success": False,
                "message": "Order Not Found"
            }), 404

        return jsonify({
            "success": True,
            "message": "Status Updated",
            "status": order.status.value
        })