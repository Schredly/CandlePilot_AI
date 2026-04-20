"""WebSocket endpoint — streams candle updates to the browser.

Protocol (JSON messages):

  client → server
    { "action": "subscribe",   "symbol": "AAPL", "timeframe": "1m" }
    { "action": "unsubscribe", "symbol": "AAPL", "timeframe": "1m" }
    { "action": "ping" }

  server → client
    { "type": "subscribed",      "symbol": "AAPL", "timeframe": "1m" }
    { "type": "unsubscribed",    "symbol": "AAPL", "timeframe": "1m" }
    { "type": "candle.update",   "symbol": "AAPL", "timeframe": "1m", "candle": { ... } }
    { "type": "candle.closed",   "symbol": "AAPL", "timeframe": "1m", "candle": { ... } }
    { "type": "pong" }
    { "type": "error",           "message": "..." }
"""

import asyncio
import logging
from typing import Any, get_args

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.market_data.service import MarketDataService
from app.market_data.types import Timeframe

log = logging.getLogger(__name__)

router = APIRouter()

_VALID_TIMEFRAMES = set(get_args(Timeframe))


async def _relay(
    ws: WebSocket, q: asyncio.Queue[dict[str, Any]]
) -> None:
    """Pump one subscription's queue to the websocket until cancelled or closed."""
    try:
        while True:
            event = await q.get()
            await ws.send_json(event)
    except asyncio.CancelledError:
        raise
    except WebSocketDisconnect:
        pass
    except Exception:
        # Socket hard-closed or similar; let the outer loop clean up.
        log.debug("relay task exiting due to send failure", exc_info=True)


@router.websocket("/ws")
async def ws_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    service: MarketDataService = websocket.app.state.market_data

    # Keyed by (symbol, timeframe): the queue + its relay task.
    subscriptions: dict[tuple[str, str], tuple[asyncio.Queue[dict[str, Any]], asyncio.Task[None]]] = {}

    try:
        while True:
            msg = await websocket.receive_json()
            action = msg.get("action")

            if action == "subscribe":
                symbol = str(msg.get("symbol", "")).upper()
                tf = str(msg.get("timeframe", ""))
                if not symbol or tf not in _VALID_TIMEFRAMES:
                    await websocket.send_json(
                        {"type": "error", "message": "subscribe requires symbol and valid timeframe"}
                    )
                    continue
                if (symbol, tf) in subscriptions:
                    await websocket.send_json({"type": "subscribed", "symbol": symbol, "timeframe": tf})
                    continue
                q = await service.subscribe_client(symbol, tf)  # type: ignore[arg-type]
                task = asyncio.create_task(_relay(websocket, q))
                subscriptions[(symbol, tf)] = (q, task)
                await websocket.send_json({"type": "subscribed", "symbol": symbol, "timeframe": tf})

            elif action == "unsubscribe":
                symbol = str(msg.get("symbol", "")).upper()
                tf = str(msg.get("timeframe", ""))
                key = (symbol, tf)
                if key in subscriptions:
                    q, task = subscriptions.pop(key)
                    task.cancel()
                    try:
                        await task
                    except asyncio.CancelledError:
                        pass
                    await service.unsubscribe_client(symbol, tf, q)  # type: ignore[arg-type]
                await websocket.send_json({"type": "unsubscribed", "symbol": symbol, "timeframe": tf})

            elif action == "ping":
                await websocket.send_json({"type": "pong"})

            else:
                await websocket.send_json(
                    {"type": "error", "message": f"unknown action '{action}'"}
                )

    except WebSocketDisconnect:
        pass
    finally:
        # Cancel all relay tasks and unsubscribe from the service so the provider
        # stops streaming symbols nobody's listening to.
        for (symbol, tf), (q, task) in list(subscriptions.items()):
            task.cancel()
            try:
                await task
            except (asyncio.CancelledError, Exception):  # noqa: BLE001
                pass
            try:
                await service.unsubscribe_client(symbol, tf, q)  # type: ignore[arg-type]
            except Exception:  # noqa: BLE001
                log.debug("cleanup unsubscribe failed", exc_info=True)
        subscriptions.clear()
