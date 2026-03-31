import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.hives import router as hives_router
from app.db.base import Base
from app.db.session import engine
from app import models  # noqa: F401 — реєструє всі моделі
from app.services.mqtt_subscriber import mqtt_subscriber


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- startup ---
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    mqtt_task = asyncio.create_task(mqtt_subscriber())

    yield

    # --- shutdown ---
    mqtt_task.cancel()
    try:
        await mqtt_task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="Smart Bee API", version="1.0.0", lifespan=lifespan)
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])
app.include_router(hives_router, prefix="/api/v1", tags=["hives"])