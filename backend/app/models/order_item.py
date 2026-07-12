from app.extensions import db
from app.models.base import BaseModel


class OrderItem(BaseModel):

    __tablename__ = "order_items"

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id"),
        nullable=False
    )

    menu_item_id = db.Column(
        db.Integer,
        db.ForeignKey("menu_items.id"),
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    order = db.relationship(
        "Order",
        back_populates="order_items"
    )

    menu_item = db.relationship(
        "MenuItem",
        back_populates="order_items"
    )

    def __repr__(self):
        return f"<OrderItem {self.id}>"