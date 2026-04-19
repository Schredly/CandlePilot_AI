# Architecture

## Services

```
┌───────────────┐    HTTPS + WSS     ┌──────────────────┐    async SQL     ┌───────────────┐
│   Next.js     │ ─────────────────▶ │     FastAPI      │ ───────────────▶ │  PostgreSQL   │
│   frontend    │ ◀───────────────── │     backend      │ ◀─────────────── │  (future)     │
└───────────────┘                    └──────────────────┘                  └───────────────┘
                                              │
                                              │ httpx / websockets
                                              ▼
                                     ┌──────────────────┐
                                     │  Market data     │
                                     │  (Alpaca /       │
                                     │   Polygon / …)   │
                                     └──────────────────┘
```

- **Frontend** never holds provider API keys. It subscribes to our own
  WebSocket (`NEXT_PUBLIC_WS_URL`) and calls our REST API
  (`NEXT_PUBLIC_API_URL`).
- **Backend** owns provider credentials, fan-out, caching, and market-hours
  gating. One connection to the provider per symbol, broadcast to N clients.
- **Database** persists users, watchlists, alerts, signals, trade journal,
  backtest runs. Wired in CP-008.

## Frontend layout

```
frontend/src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # / — Dashboard
│   ├── scanner/
│   ├── symbol/[ticker]/
│   ├── alerts/
│   ├── backtesting/
│   ├── settings/
│   ├── layout.tsx       # Root layout (dark, applies AppShell)
│   ├── globals.css      # Tailwind v4 + theme tokens from Figma
│   └── not-found.tsx
├── components/
│   ├── ui/              # shadcn/ui primitives (48 files)
│   ├── layout/          # AppShell, Sidebar, TopBar, MobileBottomNav
│   ├── dashboard/
│   ├── scanner/
│   ├── symbol/
│   ├── alerts/
│   ├── backtesting/
│   ├── settings/
│   └── figma/           # ImageWithFallback helper
├── hooks/
├── lib/                 # Utilities, types, mock data
└── public/
```

## Backend layout

```
backend/app/
├── main.py              # FastAPI factory, CORS, router mounting
├── api/
│   ├── health.py        # /health — liveness + metadata
│   └── v1/
│       └── router.py    # /api/v1 — composition root; features plug in here
├── core/
│   └── config.py        # pydantic-settings reading env
└── db/
    └── session.py       # lazy async SQLAlchemy session factory
```

Future modules slot in under `api/v1/` (candles, patterns, strategies,
alerts, backtests) and add top-level packages for shared domain logic
(`app/services/`, `app/models/`) as they grow.

## Data flow examples

**Loading a symbol page.** Client asks backend for historical candles
(REST), then opens a WebSocket subscribing to that symbol. Backend streams
new bars as they print.

**Triggering an alert.** Pattern engine detects a match on an incoming bar,
looks up matching alert rules, dispatches via push/email/SMS workers.

## Non-goals (current)

- Placing orders. CandlePilot surfaces signals; the user executes in their
  broker. A future Schwab-companion extension (CP-012) bridges that gap.
- Running on the client's machine. All market data, patterns, and
  strategies run server-side.
