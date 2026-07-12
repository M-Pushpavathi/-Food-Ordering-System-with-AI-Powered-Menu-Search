from app.extensions import db
from app.models.cart_item import CartItem
from app.models.menu_item import MenuItem


class CartService:

    @staticmethod
    def get_cart(user_id):

        cart = CartItem.query.filter_by(user_id=user_id).all()

        result = []

        total = 0

        for item in cart:

            subtotal = item.quantity * item.menu_item.price

            total += subtotal

            result.append({
                "id": item.id,
                "menu_item_id": item.menu_item.id,
                "name": item.menu_item.name,
                "price": item.menu_item.price,
                "quantity": item.quantity,
                "subtotal": subtotal
            })

        return {
            "items": result,
            "total": total
        }

    @staticmethod
    def add_item(user_id, data):

        item = CartItem.query.filter_by(
            user_id=user_id,
            menu_item_id=data["menu_item_id"]
        ).first()

        if item:

            item.quantity += data["quantity"]

        else:

            menu = MenuItem.query.get(data["menu_item_id"])

            if not menu:
                return None

            item = CartItem(
                user_id=user_id,
                menu_item_id=data["menu_item_id"],
                quantity=data["quantity"]
            )

            db.session.add(item)

        db.session.commit()

        return item

    @staticmethod
    def update_quantity(cart_id, quantity):

        item = CartItem.query.get(cart_id)

        if not item:
            return None

        item.quantity = quantity

        db.session.commit()

        return item

    @staticmethod
    def delete(cart_id):

        item = CartItem.query.get(cart_id)

        if not item:
            return False

        db.session.delete(item)

        db.session.commit()

        return True