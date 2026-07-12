from app.extensions import db

from app.models.cart_item import CartItem
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem


class OrderService:

    @staticmethod
    def place_order(user_id):

        cart_items = CartItem.query.filter_by(
            user_id=user_id
        ).all()

        if not cart_items:
            return None

        total = 0

        for item in cart_items:
            total += item.menu_item.price * item.quantity

        order = Order(
            user_id=user_id,
            total_amount=total,
            status=OrderStatus.PLACED
        )

        db.session.add(order)
        db.session.flush()

        for item in cart_items:

            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=item.menu_item_id,
                quantity=item.quantity,
                price=item.menu_item.price
            )

            db.session.add(order_item)

        for item in cart_items:
            db.session.delete(item)

        db.session.commit()

        return order

    @staticmethod
    def get_orders(user_id):

        return Order.query.filter_by(
            user_id=user_id
        ).order_by(
            Order.created_at.desc()
        ).all()

    @staticmethod
    def get_order(order_id, user_id):

        return Order.query.filter_by(
            id=order_id,
            user_id=user_id
        ).first()

    @staticmethod
    def get_order_by_id(order_id):

        return Order.query.filter_by(
            id=order_id
        ).first()

    @staticmethod
    def update_status(order_id, status):

        order = Order.query.get(order_id)

        if not order:
            return None

        try:
            order.status = OrderStatus[status]
        except KeyError:
            return None

        db.session.commit()

        return order

    @staticmethod
    def get_all_orders():

        return Order.query.order_by(
            Order.created_at.desc()
        ).all()

    @staticmethod
    def get_orders_by_status(status):

        try:
            status = OrderStatus[status]
        except KeyError:
            return []

        return Order.query.filter_by(
            status=status
        ).all()

    @staticmethod
    def get_total_revenue():

        orders = Order.query.all()

        total = 0

        for order in orders:
            total += order.total_amount

        return total