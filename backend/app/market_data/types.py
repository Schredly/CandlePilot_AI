"""Core market-data types shared by providers, aggregator, hub, and transport."""

from typing import Literal

from pydantic import BaseModel, Field

Timeframe = Literal["1m", "5m", "15m", "1h", "4h", "1d"]

ALL_TIMEFRAMES: tuple[Timeframe, ...] = ("1m", "5m", "15m", "1h", "4h", "1d")

TIMEFRAME_SECONDS: dict[Timeframe, int] = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3_600,
    "4h": 14_400,
    "1d": 86_400,
}


class Tick(BaseModel):
    """A single trade print."""

    symbol: str
    price: float
    size: float = Field(description="Trade size (shares / units).")
    time: int = Field(description="Unix seconds.")


class Candle(BaseModel):
    """OHLCV bar aligned to a timeframe bucket."""

    time: int = Field(description="Unix seconds at bar open.")
    open: float
    high: float
    low: float
    close: float
    volume: float
