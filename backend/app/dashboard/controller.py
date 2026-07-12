from flask import jsonify

from flask_jwt_extended import (
    get_jwt
)

from app.dashboard.service import DashboardService


class DashboardController:

    @staticmethod
    def summary():

        claims = get_jwt()

        if claims["role"] != "ADMIN":
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }),403

        return jsonify(
            DashboardService.get_summary()
        )

    @staticmethod
    def all_orders():

        claims = get_jwt()

        if claims["role"] != "ADMIN":
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }),403

        orders = DashboardService.get_all_orders()

        return jsonify([
            {
                "id": order.id,
                "customer": order.user.full_name,
                "total": order.total_amount,
                "status": order.status.value,
                "created_at": order.created_at
            }
            for order in orders
        ])