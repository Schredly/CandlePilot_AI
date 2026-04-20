"""In-memory pub/sub fan-out from the aggregator to connected WebSocket clients.

A subscriber gets an asyncio.Queue for one (symbol, timeframe) pair. Slow
consumers whose queues fill up have messages dropped rather than blocking the
aggregator — a single laggy client must not stall the stream for everyone.
"""

import asyncio
from collections import defaultdict
from typing import Any

Key = tuple[str, str]  # (symbol, timeframe)

QUEUE_MAX = 100


class StreamHub:
    def __init__(self) -> None:
        self._subs: dict[Key, set[asyncio.Queue[dict[str, Any]]]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def subscribe(self, symbol: str, timeframe: str) -> asyncio.Queue[dict[str, Any]]:
        q: asyncio.Queue[dict[str, Any]] = asyncio.Queue(maxsize=QUEUE_MAX)
        async with self._lock:
            self._subs[(symbol, timeframe)].add(q)
        return q

    async def unsubscribe(
        self,
        symbol: str,
        timeframe: str,
        q: asyncio.Queue[dict[str, Any]],
    ) -> None:
        async with self._lock:
            self._subs[(symbol, timeframe)].discard(q)
            if not self._subs[(symbol, timeframe)]:
                self._subs.pop((symbol, timeframe), None)

    async def publish(self, symbol: str, timeframe: str, payload: dict[str, Any]) -> None:
        async with self._lock:
            queues = list(self._subs.get((symbol, timeframe), ()))
        for q in queues:
            try:
                q.put_nowait(payload)
            except asyncio.QueueFull:
                # Slow consumer — drop to keep the stream flowing for everyone else.
                pass

    def active_symbols(self) -> set[str]:
        """Symbols with at least one live subscription."""
        return {sym for (sym, _) in self._subs}

    def has_subscribers_for(self, symbol: str) -> bool:
        return any(sym == symbol for (sym, _) in self._subs)
