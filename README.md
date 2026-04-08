# SamBee — Smart Beehive Monitoring System

SamBee is a smart beehive monitoring system. An ESP32 collects sensor data (temperature, humidity, pressure, weight) and transmits it via MQTT. The backend stores data in PostgreSQL, and the frontend displays real-time analytics. A CV module based on YOLO for Varroa mite detection is currently in development.

## Stack

| Layer | Technology |
|---|---|
| Firmware | ESP32 · PlatformIO · C++ / Arduino |
| Protocol | MQTT · Mosquitto |
| Backend | FastAPI · SQLAlchemy · Alembic · PostgreSQL |
| Frontend | Next.js 16 · React 19 · Redux · Recharts |
| CV | YOLO _(in development)_ |
| Infrastructure | Docker · Docker Compose |

## Project Structure

```
sambee-project/
├── backend/           # FastAPI application
├── frontend/          # Next.js application
├── firmware/          # ESP32 firmware (PlatformIO)
├── ai/                # CV module — Varroa detection (in development)
├── infrastructure/
│   └── mosquitto/     # MQTT broker config
├── docker-compose.yml
├── Makefile
└── .env.example
```

## Quick Start

### Requirements
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- `make`

> Works on Linux, macOS, and Windows (via Docker).

### 1. Clone the repository

```bash
git clone <repo-url>
cd sambee-project
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

At minimum, generate and set a `SECRET_KEY`:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Start

```bash
make dev
```

The first run will take a few minutes to pull images and install dependencies. Once ready:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/docs |
| Adminer (DB UI) | http://localhost:8080 |

**Adminer login:** System: `PostgreSQL` · Server: `postgres` · User / Password / Database: `sambee`

## Commands

```bash
make dev             # start all services with hot-reload
make down            # stop all services
make logs            # stream logs from all services
make ps              # show container status
make migrate         # run Alembic migrations
make shell-backend   # open shell in backend container
make shell-frontend  # open shell in frontend container
make shell-db        # open psql in postgres container
make clean           # remove containers and images
make reset           # remove everything including DB data ⚠️
```

## ESP32 Firmware

### Requirements
- [PlatformIO](https://platformio.org/)

### Setup

Create `firmware/src/config/secrets.h` (git-ignored, do not commit):

```cpp
#pragma once

#define WIFI_SSID      "your-network"
#define WIFI_PASSWORD  "your-password"
#define MQTT_HOST      "192.168.x.x"  // IP of the machine running Docker
#define MQTT_PORT      1883
#define HIVE_ID        "hive_01"

#define WEIGHT_CALIBRATION_FACTOR 183.33
```

Find your machine's IP:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1  # Linux / macOS
ipconfig                                           # Windows
```

### Build & Flash

```bash
cd firmware
pio run --target upload   # compile and flash
pio device monitor        # serial monitor (115200 baud)
```

### MQTT Payload Format

Topic: `hives/{hive_id}/sensors/environment`

```json
{
  "hive_id": "hive_01",
  "temperature": 36.5,
  "humidity": 60.2,
  "pressure": 1013.25,
  "weight": 42.1
}
```

## CV Module — Varroa Detection

> This module is currently in development. Documentation will be added upon completion.

Planned: YOLO-based automatic detection of Varroa destructor mites from beehive camera images.

## Development

### Hot-reload
`make dev` automatically picks up changes in:
- `backend/app/**` — no restart needed (uvicorn `--reload`)
- `frontend/src/**` — no restart needed (Next.js dev server)

### Dependency changes
After modifying `requirements.txt` or `package.json`:
```bash
docker compose build backend    # or frontend
docker compose up backend -d
```

### Database migrations
```bash
# Generate a migration after changing models
docker compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
make migrate

# Check current state
docker compose exec backend alembic current
docker compose exec backend alembic history
```
