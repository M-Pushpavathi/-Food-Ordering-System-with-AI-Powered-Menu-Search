import enum

from app.extensions import db
from app.models.base import BaseModel


class OrderStatus(enum.Enum):
    PLACED = "Placed"
    CONFIRMED = "Confirmed"
    PREPARING = "Preparing"
    READY = "Ready"
    PICKED_UP = "Picked Up"


class Order(BaseModel):

    __tablename__ = "orders"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.Enum(OrderStatus),
        nullable=False,
        default=OrderStatus.PLACED
    )

    user = db.relationship(
        "User",
        back_populates="orders"
    )

    order_items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Order {self.id}>"