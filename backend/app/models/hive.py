from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from sqlalchemy.dialects.postgresql import UUID


class Hive(Base):
    __tablename__ = 'hives'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    api_key = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    user_id = Column(UUID(as_uuid=True), ForeignKey(
        'users.id'), nullable=False)

    owner = relationship("User", back_populates="hives")
