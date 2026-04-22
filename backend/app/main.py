from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.users import fastapi_users, auth_backend
from app.schemas.user import UserOut, UserCreate

# Створюємо додаток ОДИН раз
app = FastAPI(title="SamBee API")

# Налаштовуємо CORS (Тільки один раз!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Поки тунель — дозволяємо все
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
