from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    employee_id: str = Field(..., max_length=50)
    full_name: str = Field(..., max_length=150)
    email: EmailStr
    designation: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    profile_photo_url: Optional[str] = None

class UserCreate(UserBase):
    idpsubjectid: str = Field(..., max_length=255)
    role: UserRole = UserRole.employee

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=150)
    designation: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    profile_photo_url: Optional[str] = None

class UserResponse(UserBase):
    id: UUID
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
