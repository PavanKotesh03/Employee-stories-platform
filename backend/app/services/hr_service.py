from uuid import UUID
from datetime import datetime, timezone
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.story import StoryStatus
from app.schemas.story import StoryReview
from app.repositories.story import story_repo
from app.core.logging import logger

class HRService:
    async def get_pending_stories(self, db: AsyncSession, skip: int = 0, limit: int = 20):
        return await story_repo.get_pending_review(db, skip=skip, limit=limit)

    async def review_story(self, db: AsyncSession, story_id: UUID, review_in: StoryReview, hr_id: UUID):
        story = await story_repo.get(db, id=story_id)
        if not story:
            raise HTTPException(status_code=404, detail="Story not found")
            
        if story.status != StoryStatus.pending:
            raise HTTPException(status_code=400, detail="Story is not pending review")
            
        if review_in.status not in [StoryStatus.approved, StoryStatus.rejected]:
            raise HTTPException(status_code=400, detail="Invalid review status")

        update_data = {
            "status": review_in.status,
            "reviewed_by": hr_id,
            "reviewed_at": datetime.now(timezone.utc),
            "review_comment": review_in.review_comment
        }
        
        if review_in.status == StoryStatus.approved:
            update_data["published_at"] = datetime.now(timezone.utc)

        try:
            updated_story = await story_repo.update(db, db_obj=story, obj_in=update_data)
            return await story_repo.get_with_author(db, id=updated_story.id)
        except Exception as e:
            logger.error("story_review_error", error=str(e), story_id=str(story_id), hr_id=str(hr_id))
            raise HTTPException(status_code=500, detail="Failed to submit review")

hr_service = HRService()
