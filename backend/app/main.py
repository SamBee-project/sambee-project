from fastapi import FastAPI
from app.api.v1.api import api_router 
from app.core.users import fastapi_users, auth_backend 
from app.schemas.user import UserOut, UserCreate 

app = FastAPI(title="SamBee API")

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/v1/auth/jwt",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserOut, UserCreate),
    prefix="/api/v1/auth",
    tags=["auth"],
)

app.include_router(api_router, prefix="/api/v1")