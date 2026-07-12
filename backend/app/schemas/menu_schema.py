from marshmallow import Schema, fields, validate


class MenuSchema(Schema):

    id = fields.Integer(dump_only=True)

    name = fields.String(required=True, validate=validate.Length(min=2))

    description = fields.String(required=True)

    price = fields.Float(required=True)

    image_url = fields.String(required=False)

    is_vegetarian = fields.Boolean(required=True)

    is_spicy = fields.Boolean(required=True)

    available = fields.Boolean(required=False)

    category_id = fields.Integer(required=True)