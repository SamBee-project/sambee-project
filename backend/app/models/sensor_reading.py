from sqlalchemy import Column, DateTime, Float, Integer, String, func
from app.db.base import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True)
    hive_id = Column(String, nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    weight = Column(Float, nullable=False)
    recorded_at = Column(DateTime(timezone=True),
                         server_default=func.now(), nullable=False)
