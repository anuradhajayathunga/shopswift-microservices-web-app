from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from database import Base


SRI_LANKA_TZ = ZoneInfo("Asia/Colombo")


def sri_lanka_now() -> datetime:
    return datetime.now(SRI_LANKA_TZ)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    product_id = Column(Integer, nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    total_price = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime, default=sri_lanka_now)
