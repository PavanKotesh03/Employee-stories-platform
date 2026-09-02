from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.schemas.story import StoryResponse, StoryCreate, StoryUpdate
from app.services.story_service import story_service

router = APIRouter()

@router.get("/published", response_model=List[StoryResponse])
async def get_published_stories(
    skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db_session)
):
    return await story_service.get_published_stories(db, skip=skip, limit=limit)

@router.get("/my-stories", response_model=List[StoryResponse])
async def get_my_stories(
    request: Request, skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db_session)
):
    # In a real app, you'd map request.state.user_id to the internal UUID. 
    # For now, we assume request.state.user_id is the internal UUID or we mock it.
    employee_id = request.state.user_id 
    return await story_service.get_my_stories(db, employee_id=employee_id, skip=skip, limit=limit)

@router.post("/", response_model=StoryResponse)
async def create_story(
    story_in: StoryCreate, request: Request, db: AsyncSession = Depends(get_db_session)
):
    # story_in requires employee_id but we should inject it from context in a real flow.
    # For this implementation, we assume story_in has it or we inject it here.
    # We will modify StoryCreate to not require employee_id, but the repo needs it.
    
    # Wait, story_in is StoryCreate which inherits StoryBase which doesn't have employee_id.
    # But repo needs it. So we pass it as a dict.
    story_data = story_in.model_dump()
    story_data["employee_id"] = request.state.user_id
    
    # Need a small fix in service or here. For now let's pass a schema that includes it.
    from app.schemas.story import StoryCreate as _StoryCreate
    class FullStoryCreate(_StoryCreate):
        employee_id: str
    
    full_story = FullStoryCreate(**story_in.model_dump(), employee_id=request.state.user_id)
    return await story_service.create_story(db, story_in=full_story, employee_id=request.state.user_id)

@router.get("/{story_id}", response_model=StoryResponse)
async def get_story(
    story_id: UUID, request: Request, db: AsyncSession = Depends(get_db_session)
):
    return await story_service.get_story_by_id(db, story_id=story_id, current_user_id=request.state.user_id)

@router.put("/{story_id}", response_model=StoryResponse)
async def update_story(
    story_id: UUID, story_in: StoryUpdate, request: Request, db: AsyncSession = Depends(get_db_session)
):
    return await story_service.update_story(db, story_id, story_in, employee_id=request.state.user_id)

@router.post("/{story_id}/submit", response_model=StoryResponse)
async def submit_story(
    story_id: UUID, request: Request, db: AsyncSession = Depends(get_db_session)
):
    return await story_service.submit_story(db, story_id, employee_id=request.state.user_id)

@router.delete("/{story_id}", status_code=204)
async def delete_story(
    story_id: UUID, request: Request, db: AsyncSession = Depends(get_db_session)
):
    await story_service.delete_story(db, story_id, employee_id=request.state.user_id)
