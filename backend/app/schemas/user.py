import uuid
from pydantic import ConfigDict
from fastapi_users import schemas

class UserRead(schemas.BaseUser[uuid.UUID]):
    name: str
    model_config = ConfigDict(from_attributes=True)

class UserCreate(schemas.BaseUserCreate):
    name: str

class UserUpdate(schemas.BaseUserUpdate):
    name: str | None = None

UserOut = UserRead