# CandlePilot AI

Real-time candlestick analyzer. Human-in-the-loop trading assistant — surfaces
setups, patterns, and opportunities with confidence scoring. Not an auto-trader.

## Monorepo layout

```
CandlePilot_AI/
├── frontend/       Next.js 15 (App Router) + Tailwind v4 + shadcn/ui
├── backend/        FastAPI + SQLAlchemy (async) — market data, signals, alerts
├── extension/      Chrome (MV3) companion — quick signals from any symbol page
├── docs/           Architecture and developer docs
├── ai-context/     Product spec — source of truth for scope
├── ledger/         Per-sprint change log (ledger/CP-<nnn>.md)
└── .env.example    Reference inventory of every env var
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
| CP-005 | ✅     | Symbol Detail UI (TradingView Lightweight Charts)          |
| CP-006 | ✅     | Alerts UI + localStorage mock persistence                  |
| CP-007 | ◐     | Settings + placeholder auth (Clerk/Supabase pending)       |
| CP-008 | ✅     | Real-time data engine (MockProvider + WS fan-out)          |
| CP-009 | ✅     | Pattern engine (5 detectors)                               |
| CP-010 | ✅     | Strategy engine (5 strategies)                             |
| CP-011 | ◐     | Backtest runner done; UI wiring pending                    |
| CP-012 | ✅     | Chrome extension companion                                 |
| CP-013 | ⬜     | AI explanation layer                                       |
| CP-014 | ⬜     | Production hardening                                       |
