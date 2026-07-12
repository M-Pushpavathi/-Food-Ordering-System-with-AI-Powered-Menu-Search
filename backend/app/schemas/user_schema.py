from marshmallow import Schema, fields


class UserSchema(Schema):

    id = fields.Integer()

    full_name = fields.String()

    email = fields.Email()

    role = fields.String()

    created_at = fields.DateTime()