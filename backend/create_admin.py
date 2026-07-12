from app import create_app
from app.extensions import db, bcrypt
from app.models.user import User, UserRole

app = create_app()

with app.app_context():

    email = "admin@saffron.ai"

    existing = User.query.filter_by(email=email).first()

    if existing:
        print("Admin already exists!")
    else:
        admin = User(
            full_name="Administrator",
            email=email,
            password_hash=bcrypt.generate_password_hash("admin123").decode("utf-8"),
            role=UserRole.ADMIN
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin created successfully!")
        print("Email: admin04@gmail.com")
        print("Password: admin123")