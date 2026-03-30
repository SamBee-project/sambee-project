"""
Alembic env: синхронний URL для міграцій (psycopg2), моделі з app.db.base.Base.
Перед upgrade: pip install psycopg2-binary alembic

Важливо: імпорт `app` працює лише якщо у sys.path є каталог backend/.
Цей файл може лежати як у backend/alembic/env.py, так і в корені репо alembic/env.py.
"""
from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import create_engine, pool

# --- Шлях до пакета app (каталог backend/) ---
# Варіант A: .../backend/alembic/env.py  → backend = parents[1]
# Варіант B: .../sambee-project/alembic/env.py → backend = repo/backend
_here = Path(__file__).resolve()
_alembic_dir = _here.parent
_repo_or_backend = _alembic_dir.parent

if (_repo_or_backend / "app").is_dir():
    BACKEND_ROOT = _repo_or_backend
elif (_repo_or_backend / "backend" / "app").is_dir():
    BACKEND_ROOT = _repo_or_backend / "backend"
else:
    raise RuntimeError(
        "Alembic: не знайдено пакет `app`. Очікується backend/app поруч з alembic "
        "(або sambee-project/backend/app, якщо env.py у корені репо)."
    )

if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

# alembic.ini -> [loggers]
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

load_dotenv(BACKEND_ROOT / ".env")

# Імпорт метаданих і реєстрація моделей
from app.db.base import Base  # noqa: E402
from app import models  # noqa: F401, E402

target_metadata = Base.metadata


def get_sync_database_url() -> str:
    """postgresql+asyncpg → postgresql+psycopg2 для Alembic."""
    url = os.getenv("DATABASE_URL", "")
    if not url:
        raise RuntimeError("DATABASE_URL is not set (backend/.env)")
    if "+asyncpg" in url:
        return url.replace("postgresql+asyncpg", "postgresql+psycopg2", 1)
    return url


def run_migrations_offline() -> None:
    context.configure(
        url=get_sync_database_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = create_engine(get_sync_database_url(), poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
