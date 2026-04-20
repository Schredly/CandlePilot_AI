"""Replay candles through strategy detectors, simulate trades, return results.

Model assumptions (document everything so metrics are interpretable):

- One open position at a time. A signal that fires while a trade is open is
  skipped — the simpler model; otherwise results depend on sizing policy for
  pyramiding which is out of scope.
- Entry fills at the signal's `entry` price on the bar it fires (equal to that
  bar's close). A real broker fills at next bar's open; we accept the small
  look-ahead to keep the simulation deterministic and self-contained.
- Exit checks happen on every subsequent bar's high/low against stop + target.
- When a single bar's range contains BOTH stop and target, the stop is assumed
  to hit first — the pessimistic assumption is standard for simple backtests.
- Position size = `risk_per_trade × current_balance / |entry − stop|`. One
  stop-out loses exactly `risk_per_trade` percent of balance at that moment.
- Any trade still open when the replay ends is closed at the last bar's close
  and tagged `timeout`.
"""

from collections.abc import Callable, Iterable, Sequence
from dataclasses import dataclass

from app.market_data.service import MarketDataService
from app.market_data.types import Candle
from app.strategies.detectors import (
    ALL_STRATEGIES,
    detect_failed_breakout,
    detect_mean_reversion,
    detect_opening_range_breakout,
    detect_pullback_continuation,
    detect_vwap_reclaim,
)
from app.strategies.types import StrategyDraft, StrategyDirection, StrategyName

from .metrics import compute_metrics
from .types import BacktestRequest, BacktestResult, EquityPoint, Trade

Detector = Callable[[Sequence[Candle]], StrategyDraft | None]

_BY_NAME: dict[StrategyName, Detector] = {
    "vwap_reclaim": detect_vwap_reclaim,
    "opening_range_breakout": detect_opening_range_breakout,
    "pullback_continuation": detect_pullback_continuation,
    "mean_reversion": detect_mean_reversion,
    "failed_breakout": detect_failed_breakout,
}


def _select_detectors(selection: str) -> list[Detector]:
    if selection == "all":
        return list(ALL_STRATEGIES)
    det = _BY_NAME.get(selection)  # type: ignore[arg-type]
    if det is None:
        raise ValueError(f"Unknown strategy '{selection}'")
    return [det]


@dataclass
class _Open:
    strategy: StrategyName
    direction: StrategyDirection
    entry: float
    stop: float
    target: float
    entry_time: int
    size: float  # units; can be fractional


def _close(
    open_trade: _Open,
    candle: Candle,
    exit_price: float,
    outcome: str,
) -> Trade:
    direction_mult = 1.0 if open_trade.direction == "LONG" else -1.0
    pnl = (exit_price - open_trade.entry) * open_trade.size * direction_mult
    return_pct = (exit_price / open_trade.entry - 1.0) * 100.0 * direction_mult

    return Trade(
        strategy=open_trade.strategy,
        direction=open_trade.direction,
        entry=round(open_trade.entry, 4),
        stop=round(open_trade.stop, 4),
        target=round(open_trade.target, 4),
        exit=round(exit_price, 4),
        entry_time=open_trade.entry_time,
        exit_time=candle.time,
        outcome=outcome,  # type: ignore[arg-type]
        return_pct=round(return_pct, 4),
        pnl=round(pnl, 2),
    )


def _try_close_on_bar(open_trade: _Open, candle: Candle) -> tuple[float, str] | None:
    """Check if stop or target hit on this bar. Returns (exit_price, outcome) or None."""
    if open_trade.direction == "LONG":
        stop_hit = candle.low <= open_trade.stop
        target_hit = candle.high >= open_trade.target
        if stop_hit and target_hit:
            return open_trade.stop, "loss"  # pessimistic
        if stop_hit:
            return open_trade.stop, "loss"
        if target_hit:
            return open_trade.target, "win"
        return None
    # SHORT
    stop_hit = candle.high >= open_trade.stop
    target_hit = candle.low <= open_trade.target
    if stop_hit and target_hit:
        return open_trade.stop, "loss"
    if stop_hit:
        return open_trade.stop, "loss"
    if target_hit:
        return open_trade.target, "win"
    return None


async def run_backtest(
    service: MarketDataService, request: BacktestRequest
) -> BacktestResult:
    detectors = _select_detectors(request.strategy)
    symbol = request.symbol.upper()

    candles = await service.backfill(symbol, request.timeframe, request.bars)
    if not candles:
        return BacktestResult(
            request=request,
            trades=[],
            equity_curve=[],
            metrics=compute_metrics([], [], request.initial_balance, request.initial_balance),
        )

    balance = request.initial_balance
    trades: list[Trade] = []
    equity: list[EquityPoint] = [EquityPoint(time=candles[0].time, balance=balance)]

    buffer: list[Candle] = []
    open_trade: _Open | None = None

    for candle in candles:
        # ── 1. Check if an open trade closes on this bar ─────────────
        if open_trade is not None:
            close_info = _try_close_on_bar(open_trade, candle)
            if close_info is not None:
                exit_price, outcome = close_info
                trade = _close(open_trade, candle, exit_price, outcome)
                trades.append(trade)
                balance += trade.pnl
                equity.append(EquityPoint(time=candle.time, balance=round(balance, 2)))
                open_trade = None

        # Bar is closed; add to the strategy buffer.
        buffer.append(candle)

        # ── 2. Look for a new signal only when flat ─────────────────
        if open_trade is None:
            for detector in detectors:
                draft = detector(buffer)
                if draft is None:
                    continue
                risk_per_unit = abs(draft.entry - draft.stop)
                if risk_per_unit <= 0:
                    continue
                size = (balance * request.risk_per_trade) / risk_per_unit
                open_trade = _Open(
                    strategy=draft.strategy,
                    direction=draft.direction,
                    entry=draft.entry,
                    stop=draft.stop,
                    target=draft.target,
                    entry_time=candle.time,
                    size=size,
                )
                break  # at most one new position per bar

    # ── 3. Close any position left open at the end of the replay ────
    if open_trade is not None and candles:
        last = candles[-1]
        trade = _close(open_trade, last, last.close, "timeout")
        trades.append(trade)
        balance += trade.pnl
        equity.append(EquityPoint(time=last.time, balance=round(balance, 2)))

    metrics = compute_metrics(trades, equity, request.initial_balance, balance)
    return BacktestResult(
        request=request,
        trades=trades,
        equity_curve=equity,
        metrics=metrics,
    )


# Re-export for nicer import paths.
__all__ = ["run_backtest", "Detector"]


def _unused() -> Iterable[None]:  # silence unused-import lints for the detector names
    return iter(())
