from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.repositories.base import BaseRepository

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def get_by_employee_id(self, db: AsyncSession, *, employee_id: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.employee_id == employee_id))
        return result.scalars().first()
        
    async def get_by_idp_subject(self, db: AsyncSession, *, idpsubjectid: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.idpsubjectid == idpsubjectid))
        return result.scalars().first()

user_repo = UserRepository(User)
