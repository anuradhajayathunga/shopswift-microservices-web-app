from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from zoneinfo import ZoneInfo
from database import Base


SRI_LANKA_TZ = ZoneInfo("Asia/Colombo")


def sri_lanka_now() -> datetime:
    return datetime.now(SRI_LANKA_TZ)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    message = Column(String, nullable=False)
    type = Column(String, default="email")          # email, sms, push
    status = Column(String, default="pending")      # pending, sent, failed
    created_at = Column(DateTime, default=sri_lanka_now)