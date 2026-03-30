from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.hive import Hive
from app.schemas.hive import HiveCreate


async def get_hives(db: AsyncSession):
    result = await db.execute(select(Hive))
    return result.scalars().all()


async def get_hive_by_id(db: AsyncSession, hive_id: int):
    result = await db.execute(select(Hive).where(Hive.id == hive_id))
    return result.scalar_one_or_none()


async def create_hive(db: AsyncSession, obj_in: HiveCreate):
    new_hive = Hive(**obj_in.dict())
    db.add(new_hive)
    await db.commit()
    await db.refresh(new_hive)
    return new_hive


async def update_hive(db: AsyncSession, hive_id: int, obj_in: HiveCreate):
    hive = await get_hive(db, hive_id)
    if not hive:
        raise HTTPException(status_code=404, detail="Hive not found")
    hive.name = obj_in.name
    hive.location = obj_in.location
    hive.api_key = obj_in.api_key
    db.add(hive)
    await db.commit()
    await db.refresh(hive)
    return hive

async def delete_hive(db: AsyncSession, hive_id: id, obj_in: HiveDelete):
    remove_hive = 