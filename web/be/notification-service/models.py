from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    message = Column(String, nullable=False)
    type = Column(String, default="email")          # email, sms, push
    status = Column(String, default="pending")      # pending, sent, failed
    created_at = Column(DateTime, default=datetime.utcnow)