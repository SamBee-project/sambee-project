from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import create_engine, pool

# --- 1. Налаштування шляхів до проекту ---
_here = Path(__file__).resolve()
_alembic_dir = _here.parent
_repo_or_backend = _alembic_dir.parent

# Визначаємо корінь бекенду, щоб Python бачив папку `app`
if (_repo_or_backend / "app").is_dir():
    BACKEND_ROOT = _repo_or_backend
elif (_repo_or_backend / "backend" / "app").is_dir():
    BACKEND_ROOT = _repo_or_backend / "backend"
else:
    raise RuntimeError(
        "Alembic: не знайдено пакет `app`. Перевірте структуру папок!"
    )

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# --- 2. Завантаження налаштувань ---
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

load_dotenv(BACKEND_ROOT / ".env")

# --- 3. Імпорт моделей (КРИТИЧНО ДЛЯ AUTOGENERATE) ---
# Імпортуємо ТУ САМУ Base, від якої наслідуються моделі
from app.db.base_class import Base 

# Явно імпортуємо класи, щоб SQLAlchemy "побачила" їх в MetaData
from app.models.user import User
from app.models.hive import Hive

from app.models.sensor_reading import SensorReading
target_metadata = Base.metadata

# --- 4. Функції для роботи з БД ---

def get_sync_database_url() -> str:
    """Конвертуємо асинхронний URL в синхронний для Alembic (psycopg2)."""
    url = os.getenv("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL is not set in .env")
    if "+asyncpg" in url:
        return url.replace("postgresql+asyncpg", "postgresql+psycopg2", 1)
    return url

def run_migrations_offline() -> None:
    """Запуск міграцій в офлайн режимі (генерує SQL скрипт)."""
    url = get_sync_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Запуск міграцій в онлайн режимі (прямий конект до БД)."""
    connectable = create_engine(
        get_sync_database_url(), 
        poolclass=pool.NullPool
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# --- 5. Вибір режиму запуску ---
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()