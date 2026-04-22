from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_async_session
from app.models.sensor_reading import SensorReading
from app.core.users import current_active_user

router = APIRouter()


@router.get("/{hive_id}")
async def get_sensor_readings(
    hive_id: int,
    db: AsyncSession = Depends(get_async_session),
    _=Depends(current_active_user),
):
    result = await db.execute(
        select(SensorReading)
        .where(SensorReading.hive_id == hive_id)
        .order_by(SensorReading.recorded_at.desc())
        .limit(50)
    )
    return result.scalars().all()