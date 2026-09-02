from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story import StoryStatus
from app.schemas.story import StoryCreate, StoryUpdate
from app.repositories.story import story_repo
from app.core.logging import logger

class StoryService:
    async def get_published_stories(self, db: AsyncSession, skip: int = 0, limit: int = 20):
        return await story_repo.get_published(db, skip=skip, limit=limit)

    async def get_my_stories(self, db: AsyncSession, employee_id: UUID, skip: int = 0, limit: int = 20):
        return await story_repo.get_by_employee(db, employee_id=employee_id, skip=skip, limit=limit)

    async def get_story_by_id(self, db: AsyncSession, story_id: UUID, current_user_id: UUID = None):
        story = await story_repo.get_with_author(db, id=story_id)
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
            
        # Optional: Increment view count if someone else is viewing a published story
        if story.status == StoryStatus.approved and current_user_id != story.employee_id:
            story = await story_repo.update(db, db_obj=story, obj_in={"view_count": story.view_count + 1})
            
        return story

    async def create_story(self, db: AsyncSession, story_in: StoryCreate, employee_id: UUID):
        try:
            story = await story_repo.create(db, obj_in=story_in)
            return await story_repo.get_with_author(db, id=story.id)
        except Exception as e:
            logger.error("story_create_error", error=str(e), employee_id=str(employee_id))
            raise HTTPException(status_code=500, detail="Failed to create story")

    async def update_story(self, db: AsyncSession, story_id: UUID, story_in: StoryUpdate, employee_id: UUID):
        story = await story_repo.get(db, id=story_id)
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
        
        if str(story.employee_id) != str(employee_id):
            raise HTTPException(status_code=403, detail="Not authorized to update this story")
            
        if story.status not in [StoryStatus.draft, StoryStatus.rejected]:
            raise HTTPException(status_code=400, detail="Can only edit draft or rejected stories")

        updated_story = await story_repo.update(db, db_obj=story, obj_in=story_in)
        return await story_repo.get_with_author(db, id=updated_story.id)

    async def submit_story(self, db: AsyncSession, story_id: UUID, employee_id: UUID):
        return await self.update_story(db, story_id, StoryUpdate(status=StoryStatus.pending), employee_id)

    async def delete_story(self, db: AsyncSession, story_id: UUID, employee_id: UUID):
        story = await story_repo.get(db, id=story_id)
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
            
        if str(story.employee_id) != str(employee_id):
            raise HTTPException(status_code=403, detail="Not authorized to delete this story")
            
        return await story_repo.update(db, db_obj=story, obj_in={"is_deleted": True})

story_service = StoryService()
