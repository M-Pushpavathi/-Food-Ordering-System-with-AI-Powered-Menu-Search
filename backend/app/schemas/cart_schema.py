from marshmallow import Schema, fields


class CartSchema(Schema):

    id = fields.Integer(dump_only=True)

    menu_item_id = fields.Integer(required=True)

    quantity = fields.Integer(required=True)