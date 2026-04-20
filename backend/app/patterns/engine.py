"""PatternEngine — rolling-buffer dispatch across all detectors.

For each `(symbol, timeframe)` it keeps the last N closed candles, runs every
detector when a new closed bar arrives, and returns the list of matches so the
service layer can publish them. The engine also retains a rolling history of
detections that the REST endpoint queries.
"""

from collections import defaultdict, deque

from app.market_data.types import Candle, Timeframe

from .detectors import ALL_DETECTORS
from .types import DetectedPattern

Key = tuple[str, str]  # (symbol, timeframe)


class PatternEngine:
    def __init__(
        self,
        *,
        candle_buffer: int = 20,
        detection_history: int = 200,
    ) -> None:
        self._candle_buffer_size = candle_buffer
        self._detection_history_size = detection_history
        self._candles: dict[Key, deque[Candle]] = defaultdict(
            lambda: deque(maxlen=self._candle_buffer_size)
        )
        self._history: dict[Key, deque[DetectedPattern]] = defaultdict(
            lambda: deque(maxlen=self._detection_history_size)
        )

    def on_closed_candle(
        self, symbol: str, timeframe: Timeframe, candle: Candle
    ) -> list[DetectedPattern]:
        """Push a closed bar into the buffer and return any matches it triggered."""
        key = (symbol, timeframe)
        self._candles[key].append(candle)

        matches: list[DetectedPattern] = []
        for detector in ALL_DETECTORS:
            result = detector(self._candles[key])
            if result is None:
                continue
            pattern, direction, confidence = result
            detected = DetectedPattern(
                symbol=symbol,
                timeframe=timeframe,
                pattern=pattern,
                direction=direction,
                confidence=confidence,
                time=candle.time,
            )
            matches.append(detected)
            self._history[key].append(detected)

        return matches

    def recent(
        self, symbol: str, timeframe: Timeframe, limit: int = 50
    ) -> list[DetectedPattern]:
        """Most-recent `limit` detections for a (symbol, timeframe), newest last."""
        key = (symbol, timeframe)
        buf = self._history.get(key)
        if not buf:
            return []
        if limit >= len(buf):
            return list(buf)
        return list(buf)[-limit:]
