from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int
    message: str
    type: str = "email"

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    message: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None

class Notification(NotificationBase):
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True