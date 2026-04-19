# Getting Started

## Prerequisites

- **Node.js** 20+ and **pnpm** 10+
- **Python** 3.11+ and **uv** (recommended) or pip

```bash
node --version       # v20+
pnpm --version       # 10+
python3 --version    # 3.11+
uv --version         # optional but faster
```

## Install

```bash
git clone https://github.com/Schredly/CandlePilot_AI.git
cd CandlePilot_AI
make install
```

That runs:

- `cd frontend && pnpm install`
- `cd backend && uv venv && uv pip install -e ".[dev]"`

## Configure

Each service has its own env file. Copy the examples on first run:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

During CP-001 the defaults work out of the box — all market-data and
database settings are optional. The root `.env.example` lists every var
that exists across the monorepo for reference.

## Run

Two terminals:

```bash
make frontend   # Next.js on http://localhost:3000
make backend    # FastAPI on http://localhost:8000
```

Check both are alive:

```bash
curl http://localhost:8000/health
# {"status":"ok","service":"candlepilot-backend","version":"0.1.0","environment":"dev"}

open http://localhost:3000
```

Interactive API docs live at `http://localhost:8000/docs`.

## Common tasks

```bash
make build        # Production build of the frontend
make typecheck    # TypeScript check
make clean        # Remove caches and build artifacts
```

## Trouble?

- **`make install` fails on backend** — make sure `uv` is on PATH
  (`brew install uv` on macOS) or fall back to `pip install -e ".[dev]"`
  inside a venv.
- **Frontend build warns about Next.js cache** — delete `frontend/.next`
  and rebuild. Usually caused by switching between `pnpm build` and
  `pnpm dev` in the same directory without cleaning.
- **CORS errors from the frontend** — ensure `FRONTEND_ORIGINS` in
  `backend/.env` includes the URL you're loading the frontend from.
