from fastapi import APIRouter

router = APIRouter()

from app.api.v1.routes.stories import router as stories_router
from app.api.v1.routes.hr import router as hr_router

router.include_router(stories_router, prefix="/stories", tags=["stories"])
router.include_router(hr_router, prefix="/hr", tags=["hr"])
