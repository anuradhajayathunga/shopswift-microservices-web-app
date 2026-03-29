from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OrderBase(BaseModel):
    user_id: int
    product_id: int
    quantity: int = 1
    total_price: float


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    quantity: Optional[int] = None
    total_price: Optional[float] = None
    status: Optional[str] = None


class Order(OrderBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
