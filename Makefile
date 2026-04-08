.PHONY: help up down build logs ps \
        dev dev-build \
        migrate shell-backend shell-frontend shell-db \
        clean reset

# ── Default target ─────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  SamBee — Docker commands"
	@echo ""
	@echo "  Dev (hot-reload):"
	@echo "    make dev            — build & start all services with hot-reload"
	@echo "    make dev-build      — rebuild images before starting"
	@echo ""
	@echo "  Production:"
	@echo "    make up             — start all services (production build)"
	@echo "    make build          — build production images"
	@echo ""
	@echo "  Utilities:"
	@echo "    make down           — stop all services"
	@echo "    make logs           — follow logs from all services"
	@echo "    make ps             — show running containers"
	@echo "    make migrate        — run Alembic migrations"
	@echo "    make shell-backend  — open shell in backend container"
	@echo "    make shell-frontend — open shell in frontend container"
	@echo "    make shell-db       — open psql in postgres container"
	@echo "    make clean          — stop & remove containers + images"
	@echo "    make reset          — clean + remove volumes (DELETES DB DATA!)"
	@echo ""

# ── Dev mode (override автоматично підхоплюється) ─────────────────────────────
dev:
	docker compose up

dev-build:
	docker compose build
	docker compose up

# ── Production ─────────────────────────────────────────────────────────────────
up:
	docker compose -f docker-compose.yml up -d

build:
	docker compose -f docker-compose.yml build

# ── Common ─────────────────────────────────────────────────────────────────────
down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps

# ── Database ───────────────────────────────────────────────────────────────────
migrate:
	docker compose exec backend alembic upgrade head

shell-db:
	docker compose exec postgres psql -U $${POSTGRES_USER:-sambee} -d $${POSTGRES_DB:-sambee}

# ── Shells ─────────────────────────────────────────────────────────────────────
shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

# ── Cleanup ────────────────────────────────────────────────────────────────────
clean:
	docker compose down --rmi local

reset:
	@echo "WARNING: This will delete all database data!"
	@read -p "Are you sure? [y/N] " ans && [ "$$ans" = "y" ]
	docker compose down -v --rmi local
