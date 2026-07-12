from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.dashboard.controller import DashboardController


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


dashboard_bp.route(
    "/summary",
    methods=["GET"]
)(
    jwt_required()(DashboardController.summary)
)


dashboard_bp.route(
    "/orders",
    methods=["GET"]
)(
    jwt_required()(DashboardController.all_orders)
)