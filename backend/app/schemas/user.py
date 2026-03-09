from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr 


class UserCreate(UserBase):
    password: str = Field(ge=8, le=25, )

class UserOut(UserBase):
    id: int 
    is_active: bool

    class Config:
        from_atributes = True