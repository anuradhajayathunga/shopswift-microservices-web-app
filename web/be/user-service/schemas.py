from pydantic import BaseModel
from typing import Literal, Optional

UserRole = Literal["admin", "customer"]

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str
    role: UserRole = "customer"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole