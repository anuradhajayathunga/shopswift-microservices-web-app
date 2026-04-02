from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    name: str
    description: str
    sku: str
    price: float
    stock: int
    is_active: bool = True
    image_url: Optional[str] = None
    tag: Optional[str] = None
    offer_percentage: Optional[float] = Field(default=None, ge=0, le=100)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None
    tag: Optional[str] = None
    offer_percentage: Optional[float] = Field(default=None, ge=0, le=100)

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True