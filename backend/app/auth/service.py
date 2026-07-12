from app.extensions import db, bcrypt
from app.models.user import User, UserRole
from flask_jwt_extended import create_access_token


class AuthService:

    @staticmethod
    def register(data):

        # Check if email already exists
        if User.query.filter_by(email=data["email"]).first():
            return {
                "success": False,
                "message": "Email already exists"
            }, 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(
            data["password"]
        ).decode("utf-8")

        # Every registered user is CUSTOMER
        user = User(
            full_name=data["full_name"],
            email=data["email"],
            password_hash=hashed_password,
            role=UserRole.CUSTOMER
        )

        db.session.add(user)
        db.session.commit()

        return {
            "success": True,
            "message": "User Registered Successfully"
        }, 201

    @staticmethod
    def login(data):

        user = User.query.filter_by(
            email=data["email"]
        ).first()

        if not user:
            return {
                "success": False,
                "message": "Invalid Email"
            }, 401

        if not bcrypt.check_password_hash(
                user.password_hash,
                data["password"]):
            return {
                "success": False,
                "message": "Invalid Password"
            }, 401

        token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role.value
            }
        )

        return {
            "success": True,
            "access_token": token,
            "role": user.role.value,
            "name": user.full_name
        }, 200