import uuid
from pydantic import ConfigDict, EmailStr
from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    """Схема для читання даних користувача (те саме, що UserOut)"""
    model_config = ConfigDict(from_attributes=True)


class UserCreate(schemas.BaseUserCreate):
    """Схема для реєстрації"""
    email: EmailStr
    password: str
    is_active: bool | None = True
    is_superuser: bool | None = False
    is_verified: bool | None = False


class UserUpdate(schemas.BaseUserUpdate):
    """Схема для оновлення профілю"""
    password: str | None = None
    email: EmailStr | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    is_verified: bool | None = None


UserOut = UserRead