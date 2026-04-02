from datetime import datetime, timedelta
import os
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
import jwt
from dotenv import load_dotenv
from database import SessionLocal, engine, Base
from schemas import User, UserCreate, UserUpdate, LoginRequest, TokenResponse
from crud import (
    create_user,
    delete_user,
    get_all_users,
    get_user,
    get_user_by_email,
    verify_user_credentials,
    update_user,
)
from typing import List

Base.metadata.create_all(bind=engine)

app = FastAPI(title="User Service", version="1.0")

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "hype.-secret-key")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))


def ensure_role_column_exists() -> None:
    """Backfill the role column for existing SQLite databases."""
    with engine.connect() as connection:
        columns_result = connection.execute(text("PRAGMA table_info(users)"))
        existing_columns = {row[1] for row in columns_result.fetchall()}

        if "role" not in existing_columns:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'customer'")
            )
            connection.execute(
                text("UPDATE users SET role = 'customer' WHERE role IS NULL")
            )
            connection.commit()


ensure_role_column_exists()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "User Service is running"}


def create_access_token(payload: dict) -> str:
    data = payload.copy()
    data["exp"] = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


@app.post("/api/auth/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = verify_user_credentials(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return TokenResponse(access_token=token, role=user.role)

@app.get("/api/users", response_model=List[User])
def get_users(db: Session = Depends(get_db)):
    return get_all_users(db)

@app.get("/api/users/by-email", response_model=User)
def get_user_by_email_endpoint(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/api/users/{user_id}", response_model=User)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/api/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user)


@app.post("/api/users/admin", response_model=User, status_code=status.HTTP_201_CREATED)
def create_admin_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    admin_user = UserCreate(name=user.name, email=user.email, password=user.password, role="admin")
    return create_user(db, admin_user)


@app.post("/api/users/customer", response_model=User, status_code=status.HTTP_201_CREATED)
def create_customer_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    customer_user = UserCreate(
        name=user.name,
        email=user.email,
        password=user.password,
        role="customer",
    )
    return create_user(db, customer_user)

@app.put("/api/users/{user_id}", response_model=User)
def update_user_endpoint(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@app.delete("/api/users/{user_id}")
def delete_user_endpoint(user_id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}