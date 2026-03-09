import datetime
from typing import Optional
from pydantic import BaseModel, Field


class HiveBase(BaseModel):
    name: str = Field(ge=1, le=25)
    location: Optional[str] = None


class HiveCreate(HiveBase):
    pass


class HiveUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None


class HiveOut(HiveBase):
    id: int
    owner_id: int
    created_at: datetime


class Config:
    from_attributes = True
