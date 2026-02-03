import asyncio
import json
from pathlib import Path
from app.db.session import async_session
from app.db.models import User
from app.core.auth import get_password_hash
from app.core.rbac import Role

async def seed():
    async with async_session() as db:
        users = [
            {"username": "admin", "password": "admin", "role": Role.ADMIN},
            {"username": "clinician", "password": "clinician", "role": Role.CLINICIAN},
            {"username": "rn", "password": "rn", "role": Role.RN},
        ]
        for u in users:
            user = User(
                username=u["username"],
                password_hash=get_password_hash(u["password"]),
                role=u["role"].value
            )
            db.add(user)
        await db.commit()
        print("Users seeded")

if __name__ == "__main__":
    asyncio.run(seed())