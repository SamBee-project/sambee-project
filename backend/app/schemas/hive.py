from sqlalchemy import DateTime
from pydantic import BaseModel, ConfigDict, EmailStr
from pydantic import BaseModel, ConfigDict
from datetime import datetime


class HiveBase(BaseModel):
    name: str
    location: str


class HiveCreate(HiveBase):
    api_key: str


class HiveUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    api_key: str | None = None


class HiveOut(HiveBase):
    id: int
    user_id: int
    created_at: datetime
