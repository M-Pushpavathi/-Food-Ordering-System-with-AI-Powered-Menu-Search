import enum

from app.extensions import db
from app.models.base import BaseModel


class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    CUSTOMER = "CUSTOMER"


class User(BaseModel):

    __tablename__ = "users"

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.Enum(UserRole),
        nullable=False,
        default=UserRole.CUSTOMER
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    cart_items = db.relationship(
        "CartItem",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    orders = db.relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.email}>"