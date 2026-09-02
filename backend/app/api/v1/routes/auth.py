import time
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import jwt

from app.core.config import settings

router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.get("/login")
async def login():
    # Mock behavior for local development
    if settings.ENVIRONMENT == "local":
        payload = {
            "sub": "mock-dev-user-id",
            "role": "admin",
            "exp": int(time.time()) + 3600
        }
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        return {"message": "Mock login successful", "token": token}
    
    # Production behavior: redirect to the real IdP.
    idp_authorize_url = f"{settings.IDP_JWKS_URL.replace('/.well-known/jwks.json', '')}/authorize?client_id={settings.IDP_CLIENT_ID}&response_type=code"
    return RedirectResponse(idp_authorize_url)

@router.get("/callback", response_model=TokenResponse)
async def callback(code: str = "mock_code"):
    # Mock behavior for local development
    if settings.ENVIRONMENT == "local":
        payload = {
            "sub": "mock-dev-user-id",
            "role": "admin",
            "exp": int(time.time()) + 3600
        }
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        return TokenResponse(access_token=token)

    # Production behavior: exchange the code for a token from the IdP.
    raise NotImplementedError("Real IdP token exchange is not yet implemented.")
