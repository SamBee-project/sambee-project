import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.users import fastapi_users, auth_backend
from app.schemas.user import UserOut, UserCreate
from app.services.mqtt_subscriber import mqtt_subscriber


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(mqtt_subscriber())
    yield
    task.cancel()


app = FastAPI(title="SamBee API", lifespan=lifespan)

# Налаштовуємо CORS (Тільки один раз!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: замінити на конкретний Vercel URL після деплою
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ПІДКЛЮЧАЄМО РОУТЕРИ (Тільки один раз кожен!)

# Авторизація (Логін)
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/v1/auth/jwt",
    tags=["auth"],
)

# Реєстрація
app.include_router(
    fastapi_users.get_register_router(UserOut, UserCreate),
    prefix="/api/v1/auth",
    tags=["auth"],
)

# Всі інші роути (Вулики, Телеметрія і т.д.)
app.include_router(api_router, prefix="/api/v1")
