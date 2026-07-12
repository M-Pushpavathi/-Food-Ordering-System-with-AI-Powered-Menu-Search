from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.cart.controller import CartController

cart_bp = Blueprint(
    "cart",
    __name__,
    url_prefix="/api/cart"
)

cart_bp.route(
    "",
    methods=["GET"]
)(
    jwt_required()(CartController.get_cart)
)

cart_bp.route(
    "",
    methods=["POST"]
)(
    jwt_required()(CartController.add_item)
)

cart_bp.route(
    "/<int:cart_id>",
   methods=["PUT", "PATCH"]
)(
    jwt_required()(CartController.update)
)

cart_bp.route(
    "/<int:cart_id>",
    methods=["DELETE"]
)(
    jwt_required()(CartController.delete)
)