import enum
from sqlalchemy import Column, String, Boolean, Enum, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.types import DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base

class StoryStatus(str, enum.Enum):
    draft = "draft"
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Story(Base):
    __tablename__ = "user_stories"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    employee_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(JSONB, nullable=False)
    status = Column(Enum(StoryStatus), nullable=False, default=StoryStatus.draft)
    submitted_at = Column(DateTime(timezone=True), nullable=True)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    review_comment = Column(String, nullable=True) # TEXT in pg
    view_count = Column(Integer, nullable=False, default=0)
    published_at = Column(DateTime(timezone=True), nullable=True)
    is_deleted = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    author = relationship("User", foreign_keys=[employee_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by])
