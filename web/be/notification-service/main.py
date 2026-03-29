from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from schemas import Notification, NotificationCreate, NotificationUpdate
from crud import create_notification, get_notifications_by_user
from typing import List, Optional
from crud import get_all_notifications, get_notification, update_notification, delete_notification

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Notification Service", version="1.0")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Notification Service is running"}

@app.get("/api/notifications", response_model=List[Notification])
def get_notifications(user_id: Optional[int] = None, db: Session = Depends(get_db)):
    return get_all_notifications(db, user_id=user_id)

@app.get("/api/notifications/{notification_id}", response_model=Notification)
def get_notification_by_id(notification_id: int, db: Session = Depends(get_db)):
    notification = get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification

@app.post("/api/notifications", response_model=Notification, status_code=status.HTTP_201_CREATED)
def send_notification(notification: NotificationCreate, db: Session = Depends(get_db)):
    created = create_notification(db, notification)
    return created

@app.get("/api/notifications/user/{user_id}", response_model=List[Notification])
def get_user_notifications(user_id: int, db: Session = Depends(get_db)):
    notifications = get_notifications_by_user(db, user_id)
    if not notifications:
        raise HTTPException(status_code=404, detail="No notifications found for this user")
    return notifications

@app.put("/api/notifications/{notification_id}", response_model=Notification)
def update_notification_endpoint(notification_id: int, notification: NotificationUpdate, db: Session = Depends(get_db)):
    updated = update_notification(db, notification_id, notification)
    if not updated:
        raise HTTPException(status_code=404, detail="Notification not found")
    return updated

@app.delete("/api/notifications/{notification_id}")
def delete_notification_endpoint(notification_id: int, db: Session = Depends(get_db)):
    success = delete_notification(db, notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted"}