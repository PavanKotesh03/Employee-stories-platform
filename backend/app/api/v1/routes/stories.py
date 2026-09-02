from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.deps import require_employee_access, UserInfo
from app.schemas.story import StoryResponse, StoryCreate, StoryUpdate
from app.services.story_service import story_service

router = APIRouter()

@router.get("/published", response_model=List[StoryResponse])
async def get_published_stories(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db_session)
):
    # Publicly accessible (or could require auth, depending on reqs)
    return await story_service.get_published_stories(db, skip=skip, limit=limit)

@router.get("/my-stories", response_model=List[StoryResponse])
async def get_my_stories(
    skip: int = 0, limit: int = 20, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    return await story_service.get_my_stories(db, employee_id=UUID(user.user_id), skip=skip, limit=limit)

@router.post("/", response_model=StoryResponse)
async def create_story(
    story_in: StoryCreate, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    # Pass employee_id down
    class FullStoryCreate(StoryCreate):
        employee_id: str
        
    full_story = FullStoryCreate(**story_in.model_dump(), employee_id=user.user_id)
    return await story_service.create_story(db, story_in=full_story, employee_id=UUID(user.user_id))

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(
    story_id: UUID, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    return await story_service.get_story_by_id(db, story_id=story_id, current_user_id=UUID(user.user_id))

@router.put("/{story_id}", response_model=StoryResponse)
async def update_story(
    story_id: UUID, 
    story_in: StoryUpdate, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    return await story_service.update_story(db, story_id, story_in, employee_id=UUID(user.user_id))

@router.post("/{story_id}/submit", response_model=StoryResponse)
async def submit_story(
    story_id: UUID, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    return await story_service.submit_story(db, story_id, employee_id=UUID(user.user_id))

@router.delete("/{story_id}", status_code=204)
async def delete_story(
    story_id: UUID, 
    db: AsyncSession = Depends(get_db_session),
    user: UserInfo = Depends(require_employee_access)
):
    await story_service.delete_story(db, story_id, employee_id=UUID(user.user_id))
