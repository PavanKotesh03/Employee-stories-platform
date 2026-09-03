from fastapi import APIRouter, Depends
from app.core.deps import get_current_user_with_level, UserInfo

router = APIRouter()

@router.get("/me", response_model=UserInfo)
async def get_my_profile(user: UserInfo = Depends(get_current_user_with_level)):
    """Returns the current user's profile and their database-backed role."""
    return user
