import time
from typing import Optional
from fastapi import Request, HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

from app.core.config import settings
from app.core.logging import logger
from pydantic import BaseModel

class UserInfo(BaseModel):
    email: str
    user_id: str
    username: str
    role: str = "employee"

# JWKS setup
jwks_url = f"https://login.microsoftonline.com/{settings.ENTRA_TENANT_ID}/discovery/v2.0/keys"
jwk_client = PyJWKClient(jwks_url, cache_keys=True)

# Issuers
ISSUER_V1 = f"https://sts.windows.net/{settings.ENTRA_TENANT_ID}/"
ISSUER_V2 = f"https://login.microsoftonline.com/{settings.ENTRA_TENANT_ID}/v2.0"

# Optional bearer for dev mode
security = HTTPBearer(auto_error=not settings.DEV_MODE)

def verify_token(token: str) -> UserInfo:
    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        
        # Manually verify issuer
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        issuer = unverified_payload.get("iss")
        
        if issuer not in [ISSUER_V1, ISSUER_V2]:
            raise HTTPException(status_code=401, detail="Invalid issuer")

        # Decode and verify
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=settings.ENTRA_CLIENT_ID if settings.ENTRA_CLIENT_ID else None,
            options={"verify_aud": bool(settings.ENTRA_CLIENT_ID), "verify_iss": False},
            leeway=30
        )
        
        email = payload.get("email") or payload.get("preferred_username") or payload.get("unique_name") or payload.get("upn")
        user_id = payload.get("oid") or payload.get("sub")
        username = payload.get("name") or email
        
        if not email or not user_id:
             raise HTTPException(status_code=401, detail="Token missing required email or subject claims")
             
        return UserInfo(email=email, user_id=user_id, username=username)

    except jwt.PyJWKClientError as e:
        logger.error("jwks_fetch_error", error=str(e))
        raise HTTPException(status_code=401, detail="Unable to fetch signing keys")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Expired token", headers={"WWW-Authenticate": "Bearer"})
    except jwt.InvalidTokenError as e:
        logger.error("invalid_token_error", error=str(e))
        raise HTTPException(status_code=401, detail="Invalid token", headers={"WWW-Authenticate": "Bearer"})
    except HTTPException:
        raise
    except Exception as e:
        logger.error("token_verification_unexpected", error=str(e))
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_current_user(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> UserInfo:
    if settings.DEV_MODE:
        dev_email = request.headers.get("X-Dev-Email")
        if dev_email:
            # Bypass JWT, synthesize UserInfo dynamically based on email
            mock_user_id = f"mock-{dev_email}"
            mock_username = dev_email.split('@')[0].replace('.', ' ').title()
            return UserInfo(email=dev_email, user_id=mock_user_id, username=mock_username)
            
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated", headers={"WWW-Authenticate": "Bearer"})
        
    return verify_token(credentials.credentials)
