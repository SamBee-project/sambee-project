from fastapi import APIRouter
from app.api.v1.endpoints import hives, users, sensor_reading

api_router = APIRouter()

api_router.include_router(hives.router, prefix="/hives", tags=["hives"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sensor_reading.router, prefix="/sensors", tags=["sensors"])