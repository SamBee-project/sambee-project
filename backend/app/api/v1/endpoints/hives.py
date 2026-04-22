import secrets

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_async_session
from app.models.hive import Hive
from app.models.sensor_reading import SensorReading
from app.schemas.hive import HiveCreate, HiveResponse
from app.core.users import current_active_user

router = APIRouter()


@router.get("/", response_model=list[HiveResponse])
async def get_my_hives(
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_active_user),
):
    result = await db.execute(select(Hive).where(Hive.user_id == user.id))
    hives = result.scalars().all()

    out = []
    for hive in hives:
        r = await db.execute(
            select(SensorReading)
            .where(SensorReading.hive_id == hive.id)
            .order_by(SensorReading.recorded_at.desc())
            .limit(1)
        )
        last = r.scalar_one_or_none()
        out.append(
            HiveResponse(
                **{c.key: getattr(hive, c.key) for c in hive.__table__.columns},
                temperature=last.temperature if last else None,
                humidity=last.humidity if last else None,
                weight=last.weight if last else None,
            )
        )
    return out


@router.post("/", response_model=HiveResponse, status_code=201)
async def create_hive(
    body: HiveCreate,
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_active_user),
):
    hive = Hive(
        name=body.name,
        location=body.location,
        api_key=secrets.token_hex(16),
        user_id=user.id,
    )
    db.add(hive)
    await db.commit()
    await db.refresh(hive)
    return HiveResponse(
        **{c.key: getattr(hive, c.key) for c in hive.__table__.columns},
        temperature=None,
        humidity=None,
        weight=None,
    )
