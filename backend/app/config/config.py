import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    # Flask Secret Key
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "kpit_food_ordering_system_flask_secret_key_2026"
    )

    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///food_ordering.db"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Secret Key (Must be at least 32 characters)
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "kpit_food_ordering_system_super_secret_key_2026_very_secure"
    )

    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 Hour