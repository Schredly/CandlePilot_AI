"""Deterministic synthetic-tick provider for development and tests.

No network calls, no credentials. Each symbol gets a seeded random-walk so the
series looks plausible but reproducible across restarts. Historical candles are
generated the same way so backfill + live stream line up visually.
"""

import asyncio
import random
import time
from collections.abc import AsyncIterator

from ..provider import MarketDataProvider
from ..types import TIMEFRAME_SECONDS, Candle, Tick, Timeframe


class MockProvider(MarketDataProvider):
    def __init__(self, tick_interval_seconds: float = 0.5) -> None:
        self._symbols: set[str] = set()
        self._prices: dict[str, float] = {}
        self._tick_interval = tick_interval_seconds
        self._queue: asyncio.Queue[Tick] = asyncio.Queue(maxsize=1000)
        self._producer: asyncio.Task[None] | None = None
        self._connected = False

    # ── connection lifecycle ────────────────────────────────────────────────
    async def connect(self) -> None:
        if self._connected:
            return
        self._connected = True
        self._producer = asyncio.create_task(self._produce())

    async def disconnect(self) -> None:
        self._connected = False
        if self._producer:
            self._producer.cancel()
            try:
                await self._producer
            except asyncio.CancelledError:
                pass
            self._producer = None

    # ── subscription management ────────────────────────────────────────────
    async def subscribe(self, symbols: list[str]) -> None:
        for sym in symbols:
            if sym not in self._symbols:
                self._symbols.add(sym)
                self._prices[sym] = self._seed_price(sym)

    async def unsubscribe(self, symbols: list[str]) -> None:
        for sym in symbols:
            self._symbols.discard(sym)
            self._prices.pop(sym, None)

    # ── streaming ──────────────────────────────────────────────────────────
    async def ticks(self) -> AsyncIterator[Tick]:
        while self._connected:
            tick = await self._queue.get()
            yield tick

    async def _produce(self) -> None:
        """Emit one tick per subscribed symbol every tick_interval seconds."""
        while True:
            now = int(time.time())
            for sym in list(self._symbols):
                price = self._prices.get(sym)
                if price is None:
                    continue
                # Random walk around current price; average drift ≈ +0.05% per tick.
                change = random.gauss(0.0005, 0.001)
                new_price = max(0.01, price * (1 + change))
                self._prices[sym] = new_price
                tick = Tick(
                    symbol=sym,
                    price=round(new_price, 2),
                    size=round(random.uniform(10.0, 500.0), 2),
                    time=now,
                )
                try:
                    self._queue.put_nowait(tick)
                except asyncio.QueueFull:
                    # Drop when the aggregator is too slow; better than unbounded growth.
                    pass
            await asyncio.sleep(self._tick_interval)

    # ── historical backfill ────────────────────────────────────────────────
    async def historical_candles(
        self, symbol: str, timeframe: Timeframe, limit: int
    ) -> list[Candle]:
        tf_seconds = TIMEFRAME_SECONDS[timeframe]
        end_bar = (int(time.time()) // tf_seconds) * tf_seconds
        start_bar = end_bar - (limit - 1) * tf_seconds

        rng = random.Random(self._seed(symbol))
        price = self._seed_price(symbol)

        candles: list[Candle] = []
        for i in range(limit):
            bar_time = start_bar + i * tf_seconds
            opn = price
            volatility = 1.0 + rng.random() * 2.0
            change = (rng.random() - 0.48) * volatility
            close = opn + change
            high = max(opn, close) + rng.random()
            low = min(opn, close) - rng.random()
            volume = 10_000.0 + rng.random() * 90_000.0

            candles.append(
                Candle(
                    time=bar_time,
                    open=round(opn, 2),
                    high=round(high, 2),
                    low=round(low, 2),
                    close=round(close, 2),
                    volume=round(volume, 2),
                )
            )
            price = close
        return candles

    # ── helpers ────────────────────────────────────────────────────────────
    @staticmethod
    def _seed(symbol: str) -> int:
        acc = 0
        for ch in symbol:
            acc = (acc * 31 + ord(ch)) & 0xFFFFFFFF
        return acc

    @classmethod
    def _seed_price(cls, symbol: str) -> float:
        """Stable starting price in [50, 500) per symbol."""
        return 50.0 + (cls._seed(symbol) % 45000) / 100.0
