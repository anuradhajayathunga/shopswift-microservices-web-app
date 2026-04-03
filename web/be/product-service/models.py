import json
from sqlalchemy import Boolean, Column, Integer, String, Float, Text
from database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, unique=True, index=True)
    description = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    is_active = Column(Boolean, nullable=False, default=True)
    image_url = Column(String, nullable=True)
    tag = Column(String, nullable=True)
    offer_percentage = Column(Float, nullable=True)
    sizes_json = Column(Text, nullable=True)
    variants_json = Column(Text, nullable=True)

    @property
    def sizes(self):
        if not self.sizes_json:
            return []

        try:
            parsed = json.loads(self.sizes_json)
            return parsed if isinstance(parsed, list) else []
        except (TypeError, ValueError):
            return []

    @sizes.setter
    def sizes(self, value):
        self.sizes_json = json.dumps(value or [])

    @property
    def variants(self):
        if not self.variants_json:
            return []

        try:
            parsed = json.loads(self.variants_json)
            return parsed if isinstance(parsed, list) else []
        except (TypeError, ValueError):
            return []

    @variants.setter
    def variants(self, value):
        self.variants_json = json.dumps(value or [])