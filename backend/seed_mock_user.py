import asyncio
import uuid
from app.core.database import async_session_maker
from app.models.user import User

async def seed_user():
    async with async_session_maker() as session:
        user = User(
            id=uuid.UUID("123e4567-e89b-12d3-a456-426614174000"),
            employee_id="EMP-DEV-001",
            full_name="Mock Admin Developer",
            email="mock.dev@tricon.com",
            idpsubjectid="123e4567-e89b-12d3-a456-426614174000",
            role="admin"
        )
        session.add(user)
        try:
            await session.commit()
            print("Successfully inserted mock user!")
        except Exception as e:
            print("User already exists or error occurred:", e)

if __name__ == "__main__":
    asyncio.run(seed_user())
