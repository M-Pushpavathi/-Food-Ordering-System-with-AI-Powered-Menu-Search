from app.extensions import db
from app.models.base import BaseModel


class MenuItem(BaseModel):

    __tablename__ = "menu_items"

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    image_url = db.Column(
        db.String(500),
        nullable=True
    )

    is_vegetarian = db.Column(
        db.Boolean,
        default=False
    )

    is_spicy = db.Column(
        db.Boolean,
        default=False
    )

    available = db.Column(
        db.Boolean,
        default=True
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False
    )

    category = db.relationship(
        "Category",
        back_populates="menu_items"
    )

    cart_items = db.relationship(
        "CartItem",
        back_populates="menu_item",
        cascade="all, delete-orphan"
    )

    order_items = db.relationship(
        "OrderItem",
        back_populates="menu_item",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<MenuItem {self.name}>"