import asyncio
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.db.session import async_session
from app.db.models import User
from app.core.auth import get_password_hash
from app.core.rbac import Role
from sqlalchemy import select

async def seed():
    async with async_session() as db:
        users = [
            {"username": "admin", "password": "admin", "role": Role.ADMIN},
            {"username": "clinician", "password": "clinician", "role": Role.CLINICIAN},
            {"username": "rn", "password": "rn", "role": Role.RN},
        ]

        usernames = [user["username"] for user in users]
        existing_result = await db.execute(select(User.username).where(User.username.in_(usernames)))
        existing_usernames = set(existing_result.scalars().all())

        created_count = 0
        skipped_count = 0
        for u in users:
            if u["username"] in existing_usernames:
                skipped_count += 1
                continue
            user = User(
                username=u["username"],
                password_hash=get_password_hash(u["password"]),
                role=u["role"].value
            )
            db.add(user)
            created_count += 1

        if created_count > 0:
            await db.commit()

        print(f"Users seeded: created={created_count}, skipped={skipped_count}")

if __name__ == "__main__":
    asyncio.run(seed())