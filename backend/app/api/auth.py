from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.auth import LoginRequest, Token
from app.core.auth import verify_password, create_access_token, get_current_user
from app.db.models import User
from sqlalchemy import select

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await db.execute(select(User).where(User.username == request.username))
    user = user.scalar_one_or_none()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username, "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
