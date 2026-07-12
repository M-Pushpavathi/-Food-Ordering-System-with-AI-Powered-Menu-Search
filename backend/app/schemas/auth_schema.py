from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):

    full_name = fields.String(
        required=True,
        validate=validate.Length(min=3)
    )

    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        validate=validate.Length(min=6)
    )

    role = fields.String(
        required=False
    )


class LoginSchema(Schema):

    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True
    )