from app import create_app
from app.extensions import db
from app.models.user import User

app = create_app()

with app.app_context():

    admin = User.query.filter_by(email="admin04@gmial.com").first()

    if admin:
        admin.email = "admin04@gmail.com"
        db.session.commit()
        print("✅ Admin email updated successfully!")
    else:
        print("❌ Admin not found.")