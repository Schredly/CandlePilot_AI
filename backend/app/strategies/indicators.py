"""Small, dependency-free indicator helpers used by strategy detectors.

Everything takes a slice of candles and returns a scalar (or None if the
window is too short). Keeping these pure and obvious — performance isn't a
concern at bar-close cadence.
"""

from collections.abc import Sequence

from app.market_data.types import Candle


def typical_price(candle: Candle) -> float:
    return (candle.high + candle.low + candle.close) / 3.0


def rolling_vwap(candles: Sequence[Candle]) -> float | None:
    """Volume-weighted average price over the window. None if total volume is 0."""
    if not candles:
        return None
    total_pv = sum(typical_price(c) * c.volume for c in candles)
    total_v = sum(c.volume for c in candles)
    if total_v <= 0:
        return None
    return total_pv / total_v


def sma(values: Sequence[float], period: int) -> float | None:
    if len(values) < period or period <= 0:
        return None
    window = values[-period:]
    return sum(window) / period


def ema(values: Sequence[float], period: int) -> list[float] | None:
    """Full EMA series aligned with `values`. None if not enough data."""
    if len(values) < period or period <= 0:
        return None
    k = 2.0 / (period + 1)
    # Seed with SMA of the first `period` values.
    seed = sum(values[:period]) / period
    out: list[float] = [seed] * period
    for v in values[period:]:
        out.append(v * k + out[-1] * (1 - k))
    return out


def stddev(values: Sequence[float], period: int) -> float | None:
    if len(values) < period or period <= 1:
        return None
    window = values[-period:]
    mean = sum(window) / period
    var = sum((v - mean) ** 2 for v in window) / period
    return var ** 0.5


def atr(candles: Sequence[Candle], period: int = 14) -> float | None:
    """Average true range — mean true-range over `period` bars."""
    if len(candles) < period + 1 or period <= 0:
        return None
    trs: list[float] = []
    for i in range(1, len(candles)):
        c = candles[i]
        prev = candles[i - 1]
        tr = max(
            c.high - c.low,
            abs(c.high - prev.close),
            abs(c.low - prev.close),
        )
        trs.append(tr)
    if len(trs) < period:
        return None
    return sum(trs[-period:]) / period
