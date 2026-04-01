from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate, UserUpdate

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def verify_user_credentials(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if user.password != password:
        return None
    return user

def get_all_users(db: Session):
    return db.query(User).all()

def create_user(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: UserUpdate):
    db_user = get_user(db, user_id)
    if db_user:
        if user.name: db_user.name = user.name
        if user.email: db_user.email = user.email
        if user.role: db_user.role = user.role
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False