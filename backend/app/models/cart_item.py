from app.extensions import db
from app.models.base import BaseModel


class CartItem(BaseModel):

    __tablename__ = "cart_items"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    menu_item_id = db.Column(
        db.Integer,
        db.ForeignKey("menu_items.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    user = db.relationship(
        "User",
        back_populates="cart_items"
    )

    menu_item = db.relationship(
        "MenuItem",
        back_populates="cart_items"
    )

    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "menu_item_id",
            name="unique_cart_item"
        ),
    )

    def __repr__(self):
        return f"<CartItem User:{self.user_id} Item:{self.menu_item_id}>"