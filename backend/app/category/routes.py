from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.middleware.auth_middleware import admin_required

from app.category.controller import CategoryController


category_bp = Blueprint(
    "category",
    __name__,
    url_prefix="/api/categories"
)


category_bp.route(
    "",
    methods=["GET"]
)(
    CategoryController.get_all
)


category_bp.route(
    "",
    methods=["POST"]
)(
    jwt_required()(admin_required(CategoryController.create))
)


category_bp.route(
    "/<int:category_id>",
    methods=["PUT"]
)(
    jwt_required()(admin_required(CategoryController.update))
)


category_bp.route(
    "/<int:category_id>",
    methods=["DELETE"]
)(
    jwt_required()(admin_required(CategoryController.delete))
)