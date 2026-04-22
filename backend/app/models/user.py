from sqlalchemy import Column, String
from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from app.db.base_class import Base
from sqlalchemy.orm import relationship

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    name = Column(String, nullable=False)
    hives = relationship("Hive", back_populates="owner")