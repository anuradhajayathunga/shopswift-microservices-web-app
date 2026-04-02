from sqlalchemy import Boolean, Column, Integer, String, Float
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