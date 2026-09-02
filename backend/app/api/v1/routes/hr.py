from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.schemas.story import StoryResponse, StoryReview
from app.services.hr_service import hr_service

router = APIRouter()

def verify_hr_role(request: Request):
    if getattr(request.state, "user_role", None) not in ["hr", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized. HR access required.")

@router.get("/stories/pending", response_model=List[StoryResponse], dependencies=[Depends(verify_hr_role)])
async def get_pending_stories(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db_session)
):
    return await hr_service.get_pending_stories(db, skip=skip, limit=limit)

@router.post("/stories/{story_id}/review", response_model=StoryResponse, dependencies=[Depends(verify_hr_role)])
async def review_story(
    story_id: UUID, review_in: StoryReview, request: Request, db: AsyncSession = Depends(get_db_session)
):
    return await hr_service.review_story(db, story_id, review_in, hr_id=request.state.user_id)
