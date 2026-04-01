from pydantic import BaseModel
from datetime import datetime


class TelemetryBase(BaseModel):
    weight: float
    temperature: float | None = None
    voltage: float | None = None


class TelemetryCreate(TelemetryBase):
    api_key: str


class TelemetryOut(TelemetryBase):
    id: int
    hive_id: int
    created_at: datetime

    class Config:
        orm_mode = True
