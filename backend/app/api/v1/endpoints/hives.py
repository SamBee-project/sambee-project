from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_async_session
from app.models.hive import Hive
from app.schemas.hive import HiveResponse
from app.core.users import current_active_user

router = APIRouter()


@router.get("/", response_model=list[HiveResponse])
async def get_my_hives(
    db: AsyncSession = Depends(get_async_session),
    user=Depends(current_active_user)
):
    query = select(Hive).where(Hive.user_id == user.id)
    result = await db.execute(query)

    hives = result.scalars().all()

    return hives
