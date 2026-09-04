from typing import List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.story import Story, StoryStatus
from app.schemas.story import StoryCreate, StoryUpdate
from app.repositories.base import BaseRepository

class StoryRepository(BaseRepository[Story, StoryCreate, StoryUpdate]):
    async def get_with_author(self, db: AsyncSession, id: UUID) -> Story | None:
        result = await db.execute(
            select(Story).options(selectinload(Story.author)).filter(Story.id == id, Story.is_deleted == False)
        )
        return result.scalars().first()

    async def get_published(self, db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Story]:
        result = await db.execute(
            select(Story)
            .options(selectinload(Story.author))
            .filter(Story.status == StoryStatus.approved, Story.is_deleted == False)
            .order_by(Story.published_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_employee(self, db: AsyncSession, employee_id: UUID, skip: int = 0, limit: int = 20) -> List[Story]:
        result = await db.execute(
            select(Story)
            .options(selectinload(Story.author))
            .filter(Story.employee_id == employee_id, Story.is_deleted == False)
            .order_by(Story.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())
        
    async def get_pending_review(self, db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Story]:
        result = await db.execute(
            select(Story)
            .options(selectinload(Story.author))
            .filter(Story.status == StoryStatus.pending, Story.is_deleted == False)
            .order_by(Story.submitted_at.asc())
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

story_repo = StoryRepository(Story)
