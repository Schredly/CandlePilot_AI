.PHONY: help install frontend backend dev build typecheck clean

help:
	@echo "CandlePilot AI — monorepo dev targets"
	@echo ""
	@echo "  make install       Install both frontend and backend dependencies"
	@echo "  make frontend      Run the Next.js dev server (port 3000)"
	@echo "  make backend       Run the FastAPI dev server (port 8000)"
	@echo "  make build         Build the production frontend"
	@echo "  make typecheck     Typecheck the frontend"
	@echo "  make clean         Remove build artifacts and caches"

install:
	cd frontend && pnpm install
	cd backend && uv venv && uv pip install -e ".[dev]"

frontend:
	cd frontend && pnpm dev

backend:
	cd backend && uv run uvicorn app.main:app --reload --port 8000

build:
	cd frontend && pnpm build

typecheck:
	cd frontend && pnpm typecheck

clean:
	rm -rf frontend/.next frontend/node_modules/.cache
	rm -rf backend/.pytest_cache backend/.ruff_cache backend/.venv
	find backend -type d -name __pycache__ -prune -exec rm -rf {} +
