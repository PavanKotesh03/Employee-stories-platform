from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.deps import require_hr_access, UserInfo
from app.schemas.story import StoryResponse, StoryReview
from app.services.hr_service import hr_service

router = APIRouter()

@router.get("/stories/pending", response_model=List[StoryResponse])
async def get_pending_stories(
    skip: int = 0, limit: int = 20, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_hr_access)
):
    return await hr_service.get_pending_stories(db, skip=skip, limit=limit)

@router.post("/stories/{story_id}/review", response_model=StoryResponse)
async def review_story(
    story_id: UUID, 
    review_in: StoryReview, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_hr_access)
):
    return await hr_service.review_story(db, story_id, review_in, hr_id=UUID(user.user_id))
