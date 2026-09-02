from fastapi import HTTPException

class AuthenticationError(HTTPException):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(status_code=401, detail=detail)

class AuthorizationError(HTTPException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=403, detail=detail)

class TokenError(HTTPException):
    def __init__(self, detail: str = "Token processing failed"):
        super().__init__(status_code=400, detail=detail)
