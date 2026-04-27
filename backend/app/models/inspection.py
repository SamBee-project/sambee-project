from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, ARRAY
from sqlalchemy.sql import func
from app.db.base_class import Base

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    hive_id = Column(Integer, ForeignKey("hives.id", ondelete="CASCADE"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    inspector = Column(String, nullable=False)
    queen_seen = Column(Boolean, default=False)
    brood_pattern = Column(String)  
    temperament = Column(String)   
    signs = Column(ARRAY(String))   
    notes = Column(Text)
    images = Column(ARRAY(String), nullable=True)