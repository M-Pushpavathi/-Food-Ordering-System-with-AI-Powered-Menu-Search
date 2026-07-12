from app.extensions import db
from app.models.base import BaseModel


class Category(BaseModel):

    __tablename__ = "categories"

    name = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    menu_items = db.relationship(
        "MenuItem",
        back_populates="category",
        lazy=True
    )

    def __repr__(self):
        return self.name