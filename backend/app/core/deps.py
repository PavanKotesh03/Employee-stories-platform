from typing import Optional
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import uuid4

from app.core.security import get_current_user, UserInfo
from app.core.database import get_db_session
from app.models.user import User, UserRole
from app.utils.constants import ADMIN_EMAILS, HR_EMAILS

async def get_current_user_with_level(
    user_info: UserInfo = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
) -> UserInfo:
    
    # 1. Look up user by idpsubjectid (or email)
    result = await db.execute(select(User).filter(User.idpsubjectid == user_info.user_id))
    db_user = result.scalars().first()
    
    if not db_user:
        # Fallback to email if IdP subject ID changed (e.g. recreating app)
        result = await db.execute(select(User).filter(User.email == user_info.email))
        db_user = result.scalars().first()
        
    # 2. Auto-create if entirely missing
    if not db_user:
        assigned_role = UserRole.employee
        if user_info.email in ADMIN_EMAILS:
            assigned_role = UserRole.admin
        elif user_info.email in HR_EMAILS:
            assigned_role = UserRole.hr
            
        db_user = User(
            id=uuid4(),
            employee_id=f"EMP-{str(uuid4())[:8].upper()}",
            full_name=user_info.username,
            email=user_info.email,
            idpsubjectid=user_info.user_id,
            role=assigned_role
        )
        db.add(db_user)
        try:
            await db.commit()
            await db.refresh(db_user)
        except Exception:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Failed to provision new user")
            
    # 3. Update UserInfo with internal DB UUID and Role
    user_info.user_id = str(db_user.id) # Internal system UUID
    user_info.role = db_user.role.value
    
    return user_info

def _make_role_guard(allowed_roles: list[str]):
    async def guard(user_info: UserInfo = Depends(get_current_user_with_level)):
        if user_info.role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Not authorized. Requires one of: {', '.join(allowed_roles)}"
            )
        return user_info
    return guard

require_employee_access = _make_role_guard(["employee", "hr", "admin"])
require_hr_access = _make_role_guard(["hr", "admin"])
require_admin_access = _make_role_guard(["admin"])
