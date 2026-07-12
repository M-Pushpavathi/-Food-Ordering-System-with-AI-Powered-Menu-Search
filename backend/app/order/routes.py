from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.order.controller import OrderController

order_bp = Blueprint(
    "order",
    __name__,
    url_prefix="/api/orders"
)

order_bp.route(
    "",
    methods=["POST"]
)(
    jwt_required()(OrderController.place_order)
)

order_bp.route(
    "",
    methods=["GET"]
)(
    jwt_required()(OrderController.get_orders)
)

order_bp.route(
    "/<int:order_id>",
    methods=["GET"]
)(
    jwt_required()(OrderController.get_order)
)

order_bp.route(
    "/<int:order_id>/status",
    methods=["PATCH"]
)(
    jwt_required()(OrderController.update_status)
)