"""Provider abstraction — one adapter per market-data vendor.

Each concrete provider owns its own connection, credentials, and wire format.
The service layer never imports a vendor SDK; it talks to this interface, which
means CP-008's MockProvider can be swapped for Alpaca/Polygon/Finnhub by
registering a new class and flipping the env var.
"""

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator

from .types import Candle, Tick, Timeframe


class MarketDataProvider(ABC):
    @abstractmethod
    async def connect(self) -> None:
        """Open the upstream connection. Idempotent for already-connected providers."""

    @abstractmethod
    async def disconnect(self) -> None:
        """Close the upstream connection and release resources."""

    @abstractmethod
    async def subscribe(self, symbols: list[str]) -> None:
        """Start streaming trades for the given symbols."""

    @abstractmethod
    async def unsubscribe(self, symbols: list[str]) -> None:
        """Stop streaming trades for the given symbols."""

    @abstractmethod
    def ticks(self) -> AsyncIterator[Tick]:
        """Async iterator yielding ticks from subscribed symbols.

        Must run until cancelled. Must raise on disconnection so the service
        layer can apply backoff and call connect() again.
        """

    @abstractmethod
    async def historical_candles(
        self, symbol: str, timeframe: Timeframe, limit: int
    ) -> list[Candle]:
        """Fetch the most recent `limit` bars ending "now" for a symbol/timeframe."""
