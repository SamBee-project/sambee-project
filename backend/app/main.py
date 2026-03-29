from fastapi import FastAPI

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.hives import router as hives_router
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401

app = FastAPI(title="Smart Bee API", version="1.0.0")
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(hives_router, prefix="/api/v1", tags=["hives"])


@app.on_event("startup")
async def startup_event() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)