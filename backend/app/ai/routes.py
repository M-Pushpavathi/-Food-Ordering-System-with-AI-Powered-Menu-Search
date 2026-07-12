from flask import Blueprint

from app.ai.controller import AIController

ai_bp = Blueprint(
    "ai",
    __name__,
    url_prefix="/api/ai"
)

ai_bp.route(
    "/search",
    methods=["GET", "POST"]
)(
    AIController.search
)