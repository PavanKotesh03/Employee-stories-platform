from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.exceptions import GenericException
from app.core.events import startup_event_handler
from app.api.v1.router import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    startup_event_handler()()
    yield

def create_app() -> FastAPI:
    app = FastAPI(title="Employee Story Platform", lifespan=lifespan)

    origins = ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_headers=["*"],
        allow_methods=["*"],
        allow_credentials=True
    )

    # Include routers
    app.include_router(api_router, prefix="/api/v1")
    
    @app.get("/health", tags=["health"])
    async def health_check():
        return {"status": "ok"}

    return app

app = create_app()

@app.exception_handler(GenericException)
async def generic_exception_handler(request: Request, exc: GenericException):
    return JSONResponse(
        status_code=exc.status_code,
        content={'error': exc.message},
    )
