from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from app.models.story import StoryStatus
from app.schemas.user import UserResponse

class StoryBase(BaseModel):
    title: str = Field(..., max_length=200)
    content: Dict[str, Any] # Assuming JSON content for rich text

class StoryCreate(StoryBase):
    pass

class StoryUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[Dict[str, Any]] = None
    status: Optional[StoryStatus] = None

class StoryReview(BaseModel):
    status: StoryStatus
    review_comment: Optional[str] = None

class StoryResponse(StoryBase):
    id: UUID
    employee_id: UUID
    status: StoryStatus
    submitted_at: Optional[datetime]
    reviewed_by: Optional[UUID]
    reviewed_at: Optional[datetime]
    review_comment: Optional[str]
    view_count: int
    published_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    # Optional nested author for responses
    author: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)
