from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.crud.crud_hive import get_hive_by_api_key
from app.models.telemetry import HiveTelemetry
from app.schemas.telemetry import TelemetryCreate


async def create_telemetry(
    db: AsyncSession, *, obj_in: TelemetryCreate
) -> HiveTelemetry:
    hive = await get_hive_by_api_key(db, api_key=obj_in.api_key)
    if not hive:
        raise ValueError("Hive with this API key not found")

    db_obj = HiveTelemetry(
        hive_id=hive.id,
        weight=obj_in.weight,
        temperature=obj_in.temperature,
        voltage=obj_in.voltage,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj
