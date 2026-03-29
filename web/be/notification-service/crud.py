from sqlalchemy.orm import Session
from models import Notification
from schemas import NotificationCreate, NotificationUpdate
from typing import Optional

def get_notification(db: Session, notification_id: int):
    return db.query(Notification).filter(Notification.id == notification_id).first()

def get_all_notifications(db: Session, user_id: Optional[int] = None):
    query = db.query(Notification)
    if user_id is not None:
        query = query.filter(Notification.user_id == user_id)
    return query.order_by(Notification.created_at.desc()).all()

def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(
        user_id=notification.user_id,
        message=notification.message,
        type=notification.type,
        status="sent"          # mock successful send
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notifications_by_user(db: Session, user_id: int):
    return get_all_notifications(db, user_id=user_id)

def update_notification(db: Session, notification_id: int, notification: NotificationUpdate):
    db_notification = get_notification(db, notification_id)
    if db_notification:
        update_data = notification.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_notification, key, value)
        db.commit()
        db.refresh(db_notification)
    return db_notification

def delete_notification(db: Session, notification_id: int):
    db_notification = get_notification(db, notification_id)
    if db_notification:
        db.delete(db_notification)
        db.commit()
        return True
    return False