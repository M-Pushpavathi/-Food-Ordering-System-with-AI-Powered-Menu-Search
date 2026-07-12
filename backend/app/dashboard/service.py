from app.models.order import Order, OrderStatus


class DashboardService:

    @staticmethod
    def get_summary():

        orders = Order.query.all()

        total_orders = len(orders)

        total_revenue = sum(
            order.total_amount for order in orders
        )

        placed = sum(
            1 for order in orders
            if order.status == OrderStatus.PLACED
        )

        confirmed = sum(
            1 for order in orders
            if order.status == OrderStatus.CONFIRMED
        )

        preparing = sum(
            1 for order in orders
            if order.status == OrderStatus.PREPARING
        )

        ready = sum(
            1 for order in orders
            if order.status == OrderStatus.READY
        )

        picked_up = sum(
            1 for order in orders
            if order.status == OrderStatus.PICKED_UP
        )

        return {
            "revenue": total_revenue,
            "today_orders": total_orders,
            "total_orders": total_orders,
            "pending": placed,
            "orders_by_status": {
                "PLACED": placed,
                "CONFIRMED": confirmed,
                "PREPARING": preparing,
                "READY": ready,
                "PICKED_UP": picked_up,
            },
            "popular_items": []
        }

    @staticmethod
    def get_all_orders():

        return Order.query.order_by(
            Order.created_at.desc()
        ).all()