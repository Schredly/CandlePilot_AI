# CandlePilot AI — Backend

FastAPI service that will host market data feeds, pattern detection,
strategy signals, alerts, and backtesting. CP-001 ships a minimal scaffold:
`/health` endpoint, CORS for the Next.js frontend, and architectural seams
for the subsequent sprints.

## Quick start

```bash
cd backend
cp .env.example .env

# With uv (recommended)
uv venv
uv pip install -e ".[dev]"
uv run uvicorn app.main:app --reload --port 8000

# Or with stdlib pip
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload --port 8000
```

Then hit `http://localhost:8000/health` or the OpenAPI docs at
`http://localhost:8000/docs`.

## Layout

```
backend/
├── app/
│   ├── main.py          # FastAPI app factory
│   ├── api/
│   │   ├── health.py    # /health
│   │   └── v1/
│   │       └── router.py  # /api/v1/* — populated by later sprints
│   ├── core/
│   │   └── config.py    # pydantic-settings, env-driven
│   └── db/
│       └── session.py   # lazy async SQLAlchemy engine + session
├── pyproject.toml
└── .env.example
```

## Roadmap

| Sprint  | Adds                                                  |
| ------- | ----------------------------------------------------- |
| CP-008  | Real-time candles (REST + WebSocket fan-out)          |
| CP-009  | Pattern detection endpoints                           |
| CP-010  | Strategy signal endpoints                             |
| CP-006* | Alerts persistence + delivery (UI already exists)     |
| CP-011* | Backtesting engine (UI already exists)                |
| CP-007  | Auth (Clerk or Supabase integration)                  |

`*` = backend catches up to the existing frontend UI.
