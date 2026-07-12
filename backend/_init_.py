from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, bcrypt, jwt, migrate, ma

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

    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Initialize Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(ai_bp)

    return app