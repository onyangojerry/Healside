from pydantic import BaseModel
from app.core.rbac import Role

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
    role: Role | None = None

class User(BaseModel):
    username: str
    role: Role

class UserInDB(User):
    password_hash: str

class LoginRequest(BaseModel):
    username: str
    password: str