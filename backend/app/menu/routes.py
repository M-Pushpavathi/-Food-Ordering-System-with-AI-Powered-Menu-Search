from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.middleware.auth_middleware import admin_required

from app.menu.controller import MenuController

menu_bp = Blueprint(
    "menu",
    __name__,
    url_prefix="/api/menu"
)

# Customer
menu_bp.route(
    "",
    methods=["GET"]
)(MenuController.get_all)

menu_bp.route(
    "/<int:item_id>",
    methods=["GET"]
)(MenuController.get_one)

# Admin
menu_bp.route(
    "",
    methods=["POST"]
)(
    jwt_required()(admin_required(MenuController.create))
)

menu_bp.route(
    "/<int:item_id>",
    methods=["PUT"]
)(
    jwt_required()(admin_required(MenuController.update))
)

menu_bp.route(
    "/<int:item_id>",
    methods=["DELETE"]
)(
    jwt_required()(admin_required(MenuController.delete))
)