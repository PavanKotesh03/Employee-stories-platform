from typing import List
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from starlette.responses import JSONResponse, Response
from jose import jwt, exceptions
import urllib.request
import json
from jose import jwk

from app.core.config import settings
from app.core.logging import logger

class AuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, exclude: List[str] = None):
        super().__init__(app)
        self.exclude = exclude or []

    @staticmethod
    def safety_response():
        return Response(
            status_code=204,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Headers": "*",
            }
        )

    def get_jwks(self):
        try:
            with urllib.request.urlopen(settings.IDP_JWKS_URL) as response:
                return json.loads(response.read().decode())
        except Exception as e:
            logger.error("jwks_fetch_error", error=str(e))
            return None

    def get_public_key(self, token):
        jwks = self.get_jwks()
        if not jwks:
            return None
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks.get("keys", []):
            if key.get("kid") == unverified_header.get("kid"):
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        if rsa_key:
            return jwk.construct(rsa_key)
        return None

    async def dispatch(self, request: Request, call_next):
        # 1. Single Source of Truth Bypass
        if settings.ENVIRONMENT == "local":
            request.state.user_id = "123e4567-e89b-12d3-a456-426614174000"
            request.state.user_role = "admin"
            return await call_next(request)

        # 2. Exclude bypass (for login/callback routes)
        if request.url.path in self.exclude:
            return await call_next(request)
            
        if request.method == "OPTIONS":
            return self.safety_response()

        # 3. Production JWT validation
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse({"detail": "Authorization header missing or invalid"}, status_code=401)
            
        token = auth_header.split(" ")[1]
        
        try:
            public_key = self.get_public_key(token)
            if not public_key:
                return JSONResponse({"detail": "Unable to find appropriate key"}, status_code=401)
                
            decoded_payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience=settings.IDP_CLIENT_ID
            )
            
            if decoded_payload.get("sub"):
                request.state.user_id = decoded_payload.get("sub")
                request.state.user_role = decoded_payload.get("role", "employee")
            else:
                return JSONResponse({"detail": "Invalid token payload"}, status_code=401)
                
        except exceptions.ExpiredSignatureError:
            return JSONResponse({"detail": "Expired token"}, status_code=401)
        except exceptions.JWTClaimsError:
            return JSONResponse({"detail": "Invalid claims"}, status_code=401)
        except Exception as e:
            logger.error("token_validation_error", error=str(e))
            return JSONResponse({"detail": "Invalid token"}, status_code=401)

        return await call_next(request)
