# CandlePilot Companion — Chrome Extension

A small MV3 extension that detects the symbol on the page you're looking at
(Yahoo Finance, TradingView, Google Finance, Schwab, or any URL with
`?symbol=XXX`) and shows quick signals + patterns straight from the
CandlePilot AI backend.

## Load it (dev)

1. Start the backend (`make backend`) and, optionally, the frontend (`make frontend`).
2. Open `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and pick the `extension/` directory.
4. Navigate to a supported site, e.g. `https://finance.yahoo.com/quote/AAPL`.
5. Click the CandlePilot Companion toolbar icon.

## Settings

Open the extension's Settings page (gear icon) to change:

- **Backend API base** — default `http://localhost:8000`.
- **Frontend app base** — default `http://localhost:3000`. Used by the "Open app" button.
- **Default timeframe** — 1m / 5m / 15m / 1h / 4h / 1d.

## What it does

- Reads the active tab's URL (no content-script injection into the page — just the URL).
- Maps the URL to a ticker using per-site rules + a generic `?symbol=` fallback.
- Calls `GET /api/v1/strategies/{symbol}` and `GET /api/v1/patterns/{symbol}` on the backend.
- Renders the latest four of each.
- "Open app ↗" opens `/symbol/{ticker}` in the full web app.

## Layout

```
extension/
├── manifest.json           # MV3 manifest
└── popup/
    ├── popup.html / .css / .js
    └── options.html / .js
```

No build step, no bundler. Pure HTML/CSS/JS served by Chrome directly.

## Icons

The manifest doesn't currently reference icon assets — Chrome falls back to the
default puzzle-piece icon. Add `icons/icon16.png`, `48`, `128` and register them
in `manifest.json` before publishing.

## Limitations today

- Schwab's trading URLs don't always carry the symbol in the URL; the extension
  only detects Schwab pages that pass `?symbol=` or `?sym=`. Full Schwab
  detection would need a content script to read their DOM.
- CORS: the backend allows `chrome-extension://*` via `allow_origin_regex` so
  popup fetches succeed without per-extension-ID config.
- Running the extension from `chrome-extension://…` against a remote backend
  requires adding that host to `host_permissions` in the manifest.

## Next

Wire live `candle.update` / `strategy.signal` / `pattern.detected` events over
the backend WebSocket (`/ws`) instead of polling REST on popup open. The popup
is small, so polling on open is fine for now.
