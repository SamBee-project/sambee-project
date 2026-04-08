from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from app.db.base_class import Base 

class User(SQLAlchemyBaseUserTableUUID, Base):
   __tablename__ = "users"
   pass