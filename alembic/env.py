from backend.app.models.hive import Hive
from backend.app.models.user import User
from backend.app.db.base import Base
import asyncio
import os
import sys
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context
from dotenv import load_dotenv

# 1. Налаштовуємо шляхи, щоб Python бачив папку backend
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)

# Шукаємо .env саме в папці backend
load_dotenv(os.path.join(BASE_DIR, "backend", ".env"))

# 3. Імпортуємо твої моделі для автогенерації

# Об'єкт конфігурації Alembic
config = context.config

# 4. Налаштування логування
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 5. Метадані моделей
target_metadata = Base.metadata


def get_url():
    """Отримуємо URL бази з середовища або помилка"""
    url = os.getenv("DATABASE_URL")
    if not url:
        raise ValueError(
            "DATABASE_URL не знайдено в .env! Перевір шлях до файлу.")
    return url


def run_migrations_offline() -> None:
    """Запуск міграцій в 'offline' режимі."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Запуск міграцій в 'online' режимі (асинхронно)."""
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()

    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
