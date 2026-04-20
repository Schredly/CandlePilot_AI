"""StrategyEngine — runs every detector on each closed bar.

Structurally the same as PatternEngine: per-(symbol, timeframe) rolling
candle buffer + per-key detection history. Larger buffer (50) than the pattern
engine because some strategies look 20+ bars back.
"""

from collections import defaultdict, deque

from app.market_data.types import Candle, Timeframe

from .detectors import ALL_STRATEGIES
from .types import StrategySignal

Key = tuple[str, str]


class StrategyEngine:
    def __init__(
        self,
        *,
        candle_buffer: int = 50,
        signal_history: int = 200,
    ) -> None:
        self._candle_buffer_size = candle_buffer
        self._signal_history_size = signal_history
        self._candles: dict[Key, deque[Candle]] = defaultdict(
            lambda: deque(maxlen=self._candle_buffer_size)
        )
        self._history: dict[Key, deque[StrategySignal]] = defaultdict(
            lambda: deque(maxlen=self._signal_history_size)
        )

    def on_closed_candle(
        self, symbol: str, timeframe: Timeframe, candle: Candle
    ) -> list[StrategySignal]:
        key = (symbol, timeframe)
        self._candles[key].append(candle)

        signals: list[StrategySignal] = []
        for detector in ALL_STRATEGIES:
            draft = detector(list(self._candles[key]))
            if draft is None:
                continue

            risk = abs(draft.entry - draft.stop)
            reward = abs(draft.target - draft.entry)
            risk_reward = round(reward / risk, 2) if risk > 0 else 0.0

            signal = StrategySignal(
                symbol=symbol,
                timeframe=timeframe,
                strategy=draft.strategy,
                direction=draft.direction,
                entry=round(draft.entry, 4),
                stop=round(draft.stop, 4),
                target=round(draft.target, 4),
                risk_reward=risk_reward,
                confidence=max(0, min(100, draft.confidence)),
                notes=draft.notes,
                time=candle.time,
            )
            signals.append(signal)
            self._history[key].append(signal)

        return signals

    def recent(
        self, symbol: str, timeframe: Timeframe, limit: int = 50
    ) -> list[StrategySignal]:
        key = (symbol, timeframe)
        buf = self._history.get(key)
        if not buf:
            return []
        if limit >= len(buf):
            return list(buf)
        return list(buf)[-limit:]
