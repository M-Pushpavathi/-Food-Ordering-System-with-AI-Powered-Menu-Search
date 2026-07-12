from flask import Blueprint
from app.auth.controller import AuthController

auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)

auth_bp.route(
    "/register",
    methods=["POST"]
)(AuthController.register)

auth_bp.route(
    "/login",
    methods=["POST"]
)(AuthController.login)