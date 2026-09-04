from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, Body
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.deps import get_current_user_with_level, require_admin_access, UserInfo
from app.core.database import get_db_session
from app.schemas.user import UserResponse
from app.models.user import UserRole
from app.services.user_service import user_service

router = APIRouter()

class RoleUpdateRequest(BaseModel):
    role: UserRole

@router.get("/me", response_model=UserInfo)
async def get_my_profile(user: UserInfo = Depends(get_current_user_with_level)):
    """Returns the current user's profile and their database-backed role."""
    return user

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0, limit: int = 50,
    db: AsyncSession = Depends(get_db_session),
    admin: UserInfo = Depends(require_admin_access)
):
    return await user_service.get_all_users(db, skip=skip, limit=limit)

@router.put("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: UUID,
    role_update: RoleUpdateRequest,
    db: AsyncSession = Depends(get_db_session),
    admin: UserInfo = Depends(require_admin_access)
):
    return await user_service.update_user_role(db, user_id, role_update.role)

@router.delete("/{user_id}", response_model=UserResponse)
async def delete_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    admin: UserInfo = Depends(require_admin_access)
):
    return await user_service.delete_user(db, user_id)
