from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional


class HiveCreate(BaseModel):
    name: str
    location: str


class HiveUpdate(BaseModel):
    name: str | None = None
    location: str | None = None


class HiveResponse(BaseModel):
    id: int
    name: str
    location: str
    api_key: str
    created_at: datetime
    user_id: UUID
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    weight: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
