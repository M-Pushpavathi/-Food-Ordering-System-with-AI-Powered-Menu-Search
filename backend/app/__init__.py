from flask import Flask

from app.config.config import Config

from app.extensions import (
    db,
    jwt,
    cors,
    bcrypt,
    ma
)

# Import all models
import app.models

# Blueprints
from app.auth.routes import auth_bp
from app.category.routes import category_bp
from app.menu.routes import menu_bp
from app.cart.routes import cart_bp
from app.order.routes import order_bp
from app.dashboard.routes import dashboard_bp
from app.ai.routes import ai_bp

def create_app():

    app = Flask(__name__)

    # Load Config
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    ma.init_app(app)
    cors.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(ai_bp)   
    # Create Database Tables
    with app.app_context():
        db.create_all()

    @app.route("/")
    def home():
        return {
            "success": True,
            "message": " AI Food Ordering Backend Running Successfully"
        }

    return app