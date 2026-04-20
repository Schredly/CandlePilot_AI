"""Tick → multi-timeframe OHLCV aggregation.

Maintains one "current" candle per (symbol, timeframe). Each incoming tick
either extends the current bar (same timeframe bucket) or closes it and opens
a fresh one.
"""

from dataclasses import dataclass

from .types import TIMEFRAME_SECONDS, Candle, Tick, Timeframe


@dataclass
class CandleUpdate:
    timeframe: Timeframe
    candle: Candle
    closed: bool
    """True when this update represents the final close of a bar, False for
    in-progress updates to the currently-building bar."""


class CandleAggregator:
    def __init__(self, timeframes: list[Timeframe]) -> None:
        self._timeframes = timeframes
        self._current: dict[tuple[str, Timeframe], Candle] = {}

    def on_tick(self, tick: Tick) -> list[tuple[str, CandleUpdate]]:
        """Advance all timeframes against a tick. Returns (symbol, update) pairs."""
        updates: list[tuple[str, CandleUpdate]] = []
        for tf in self._timeframes:
            tf_seconds = TIMEFRAME_SECONDS[tf]
            bar_start = (tick.time // tf_seconds) * tf_seconds
            key = (tick.symbol, tf)
            current = self._current.get(key)

            if current is None or current.time < bar_start:
                # Close the previous bar (if any) before starting a new one.
                if current is not None:
                    updates.append((tick.symbol, CandleUpdate(tf, current, closed=True)))
                new_candle = Candle(
                    time=bar_start,
                    open=tick.price,
                    high=tick.price,
                    low=tick.price,
                    close=tick.price,
                    volume=tick.size,
                )
                self._current[key] = new_candle
                updates.append((tick.symbol, CandleUpdate(tf, new_candle, closed=False)))
            else:
                updated = current.model_copy(
                    update={
                        "high": max(current.high, tick.price),
                        "low": min(current.low, tick.price),
                        "close": tick.price,
                        "volume": current.volume + tick.size,
                    }
                )
                self._current[key] = updated
                updates.append((tick.symbol, CandleUpdate(tf, updated, closed=False)))
        return updates
