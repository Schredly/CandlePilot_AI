# CandlePilot AI

Real-time candlestick analyzer. Human-in-the-loop trading assistant — surfaces
setups, patterns, and opportunities with confidence scoring. Not an auto-trader.

## Monorepo layout

```
CandlePilot_AI/
├── frontend/       Next.js 15 (App Router) + Tailwind v4 + shadcn/ui
├── backend/        FastAPI + SQLAlchemy (async) — market data, signals, alerts
├── docs/           Architecture and developer docs
├── ai-context/     Product spec — source of truth for scope
└── .env.example    Reference inventory of every env var (both services)
```

## Quick start

```bash
# One-time setup
make install

# Two terminals
make frontend       # http://localhost:3000
make backend        # http://localhost:8000  (docs at /docs)
```

The frontend expects the backend at `NEXT_PUBLIC_API_URL` (default
`http://localhost:8000`). Copy each service's `.env.example` to `.env` /
`.env.local` before first run.

## Sprints

See `ai-context/` for the product spec and `docs/ARCHITECTURE.md` for the
service layout. Current progress:

| Sprint | Status | Notes                                                      |
| ------ | ------ | ---------------------------------------------------------- |
| CP-001 | ✅     | Monorepo scaffold, FastAPI skeleton, Next.js UI            |
| CP-002 | ✅     | Figma core layout (sidebar, topbar, mobile nav)            |
| CP-003 | ✅     | Dashboard UI                                               |
| CP-004 | ✅     | Scanner UI                                                 |
| CP-005 | ✅     | Symbol Detail UI (candles render via Recharts)             |
| CP-006 | ◐     | Alerts UI; backend + delivery pending                      |
| CP-007 | ◐     | Settings UI; auth (Clerk/Supabase) pending                 |
| CP-008 | ⬜     | Real-time data engine                                      |
| CP-009 | ⬜     | Pattern engine                                             |
| CP-010 | ⬜     | Strategy engine                                            |
| CP-011 | ◐     | Backtesting UI; engine pending                             |
| CP-012 | ⬜     | Browser extension (Schwab companion)                       |
| CP-013 | ⬜     | AI explanation layer                                       |
| CP-014 | ⬜     | Production hardening                                       |
