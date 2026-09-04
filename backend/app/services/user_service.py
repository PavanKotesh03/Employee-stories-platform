from typing import List, Optional
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User, UserRole
from app.schemas.user import UserUpdate

class UserService:
    async def get_all_users(self, db: AsyncSession, skip: int = 0, limit: int = 50) -> List[User]:
        result = await db.execute(
            select(User)
            .filter(User.is_active == True)
            .order_by(User.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_user_by_id(self, db: AsyncSession, user_id: UUID) -> Optional[User]:
        result = await db.execute(select(User).filter(User.id == user_id))
        return result.scalars().first()

    async def update_user_role(self, db: AsyncSession, user_id: UUID, new_role: UserRole) -> User:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.role = new_role
        await db.commit()
        await db.refresh(user)
        return user

    async def delete_user(self, db: AsyncSession, user_id: UUID) -> User:
        user = await self.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user.is_active = False
        await db.commit()
        await db.refresh(user)
        return user

user_service = UserService()
