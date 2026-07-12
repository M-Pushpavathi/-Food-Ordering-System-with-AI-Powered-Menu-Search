from marshmallow import Schema, fields


class OrderSchema(Schema):

    id = fields.Integer(dump_only=True)

    total_amount = fields.Float(dump_only=True)

    status = fields.String(dump_only=True)