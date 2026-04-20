"""MarketDataService — glue between the provider, aggregator, and hub.

One service instance owns one provider connection. It runs a background task
that drains `provider.ticks()`, feeds the aggregator, and publishes each
resulting candle update to the hub. On provider error it reconnects with a
fixed backoff.

WebSocket handlers subscribe through `subscribe_client` and receive an
asyncio.Queue of candle events for their (symbol, timeframe).
"""

import asyncio
import logging
from typing import Any

from app.patterns.engine import PatternEngine
from app.strategies.engine import StrategyEngine

from .aggregator import CandleAggregator
from .hub import StreamHub
from .provider import MarketDataProvider
from .types import ALL_TIMEFRAMES, Candle, Timeframe

log = logging.getLogger(__name__)


class MarketDataService:
    def __init__(
        self,
        provider: MarketDataProvider,
        timeframes: list[Timeframe] | None = None,
        reconnect_seconds: float = 5.0,
        pattern_engine: PatternEngine | None = None,
        strategy_engine: StrategyEngine | None = None,
    ) -> None:
        self.provider = provider
        self.aggregator = CandleAggregator(list(timeframes or ALL_TIMEFRAMES))
        self.hub = StreamHub()
        self.patterns = pattern_engine
        self.strategies = strategy_engine
        self._task: asyncio.Task[None] | None = None
        self._reconnect_seconds = reconnect_seconds
        self._running = False

    # ── lifecycle ──────────────────────────────────────────────────────────
    async def start(self) -> None:
        await self.provider.connect()
        self._running = True
        self._task = asyncio.create_task(self._run(), name="market-data-stream")

    async def stop(self) -> None:
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None
        await self.provider.disconnect()

    # ── client-facing API ──────────────────────────────────────────────────
    async def subscribe_client(
        self, symbol: str, timeframe: Timeframe
    ) -> asyncio.Queue[dict[str, Any]]:
        q = await self.hub.subscribe(symbol, timeframe)
        await self.provider.subscribe([symbol])
        return q

    async def unsubscribe_client(
        self,
        symbol: str,
        timeframe: Timeframe,
        q: asyncio.Queue[dict[str, Any]],
    ) -> None:
        await self.hub.unsubscribe(symbol, timeframe, q)
        if not self.hub.has_subscribers_for(symbol):
            await self.provider.unsubscribe([symbol])

    async def backfill(
        self, symbol: str, timeframe: Timeframe, limit: int = 120
    ) -> list[Candle]:
        return await self.provider.historical_candles(symbol, timeframe, limit)

    # ── internal loop ──────────────────────────────────────────────────────
    async def _run(self) -> None:
        """Consume ticks forever; on error, back off and reconnect."""
        while self._running:
            try:
                async for tick in self.provider.ticks():
                    for sym, update in self.aggregator.on_tick(tick):
                        event_type = "candle.closed" if update.closed else "candle.update"
                        await self.hub.publish(
                            sym,
                            update.timeframe,
                            {
                                "type": event_type,
                                "symbol": sym,
                                "timeframe": update.timeframe,
                                "candle": update.candle.model_dump(),
                            },
                        )
                        # Fan pattern + strategy events out through the same hub so any
                        # client subscribed to (symbol, timeframe) gets all three streams.
                        if update.closed and self.patterns is not None:
                            for detected in self.patterns.on_closed_candle(
                                sym, update.timeframe, update.candle
                            ):
                                await self.hub.publish(
                                    sym,
                                    update.timeframe,
                                    {
                                        "type": "pattern.detected",
                                        "symbol": sym,
                                        "timeframe": update.timeframe,
                                        "pattern": detected.model_dump(),
                                    },
                                )

                        if update.closed and self.strategies is not None:
                            for signal in self.strategies.on_closed_candle(
                                sym, update.timeframe, update.candle
                            ):
                                await self.hub.publish(
                                    sym,
                                    update.timeframe,
                                    {
                                        "type": "strategy.signal",
                                        "symbol": sym,
                                        "timeframe": update.timeframe,
                                        "signal": signal.model_dump(),
                                    },
                                )
            except asyncio.CancelledError:
                raise
            except Exception:  # noqa: BLE001 — intentional catch-all for reconnect
                log.warning(
                    "market data stream error; reconnecting in %ss",
                    self._reconnect_seconds,
                    exc_info=True,
                )
                await asyncio.sleep(self._reconnect_seconds)
                try:
                    await self.provider.disconnect()
                    await self.provider.connect()
                except Exception:  # noqa: BLE001
                    log.exception("reconnect failed; will retry on next cycle")
                    await asyncio.sleep(self._reconnect_seconds)
