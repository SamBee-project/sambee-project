FROM python:3.12-slim

# 1. Налаштування середовища
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# 2. Встановлення системних залежностей (gcc потрібен для bcrypt/psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. КЕШУВАННЯ ЗАЛЕЖНОСТЕЙ (найважливіший етап)
# Спочатку копіюємо ТІЛЬКИ requirements.txt
COPY requirements.txt .

# Встановлюємо бібліотеки. Використовуємо --break-system-packages, 
# щоб не бавитися з venv всередині ізольованого контейнера.
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --break-system-packages -r requirements.txt

# 4. КОПІЮВАННЯ КОДУ (це робиться в кінці)
COPY . .

# 5. Налаштування Alembic та прав на запуск
# Якщо alembic.ini.bak існує, копіюємо його
RUN if [ -f alembic.ini.bak ]; then cp alembic.ini.bak alembic.ini; fi

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]