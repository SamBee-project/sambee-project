from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_async_session
from app.models.inspection import Inspection
from app.schemas.inspection import InspectionCreate, InspectionResponse
from app.core.users import current_active_user
from app.models.user import User

router = APIRouter()


@router.post("/", response_model=InspectionResponse)
async def create_inspection(
    inspection_in: InspectionCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):

    new_inspection = Inspection(**inspection_in.model_dump())
    db.add(new_inspection)
    await db.commit()
    await db.refresh(new_inspection)
    return new_inspection


@router.get("/", response_model=List[InspectionResponse])
async def get_inspections(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):

    result = await db.execute(select(Inspection))
    inspections = result.scalars().all()
    return inspections


@router.get("/{inspection_id}", response_model=InspectionResponse)
async def get_inspection(
    inspection_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):

    result = await db.execute(select(Inspection).where(Inspection.id == inspection_id))
    inspection = result.scalar_one_or_none()

    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")

    return inspection
