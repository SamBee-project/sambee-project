from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class BroodPattern(str, Enum):
    excellent = "excellent"
    good = "good"
    poor = "poor"

class Temperament(str, Enum):
    calm = "calm"
    normal = "normal"
    aggressive = "aggressive"

class InspectionBase(BaseModel):  
    hive_id: int = Field(..., alias="hiveId")
    date: datetime
    inspector: str
    queen_seen: bool = Field(..., alias="queenSeen")
    brood_pattern: BroodPattern = Field(..., alias="broodPattern")
    temperament: Temperament
    signs: List[str] = []
    notes: str
    images: Optional[List[str]] = []

    class Config:
        populate_by_name = True
        from_attributes = True

class InspectionCreate(InspectionBase):
    pass

class InspectionResponse(InspectionBase):
    id: int

    class Config:
        from_attributes = True