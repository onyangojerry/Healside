from pydantic import BaseModel
from typing import Optional
from app.core.rbac import Role

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[Role] = None

class User(BaseModel):
    username: str
    role: Role

class UserInDB(User):
    password_hash: str

class LoginRequest(BaseModel):
    username: str
    password: str
