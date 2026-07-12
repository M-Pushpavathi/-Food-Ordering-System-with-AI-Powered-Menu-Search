from marshmallow import Schema, fields, validate


class CategorySchema(Schema):

    id = fields.Integer(dump_only=True)

    name = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )