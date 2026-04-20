"""Pure metric functions. Take trade + equity data, return `BacktestMetrics`."""

from collections.abc import Sequence

from .types import BacktestMetrics, EquityPoint, Trade


def _max_drawdown_pct(points: Sequence[EquityPoint]) -> float:
    """Largest peak-to-trough drawdown in the equity curve, as a positive percent."""
    if not points:
        return 0.0
    peak = points[0].balance
    worst = 0.0
    for p in points:
        if p.balance > peak:
            peak = p.balance
        if peak > 0:
            dd = (peak - p.balance) / peak
            if dd > worst:
                worst = dd
    return round(worst * 100.0, 4)


def _sharpe(returns: Sequence[float]) -> float:
    """Mean / stdev of per-trade return percents. Unitless; no annualization."""
    if len(returns) < 2:
        return 0.0
    n = len(returns)
    mean = sum(returns) / n
    var = sum((r - mean) ** 2 for r in returns) / n
    sd = var ** 0.5
    if sd == 0:
        return 0.0
    return round(mean / sd, 4)


def compute_metrics(
    trades: Sequence[Trade],
    equity_curve: Sequence[EquityPoint],
    initial_balance: float,
    final_balance: float,
) -> BacktestMetrics:
    wins = sum(1 for t in trades if t.outcome == "win")
    losses = sum(1 for t in trades if t.outcome == "loss")
    timeouts = sum(1 for t in trades if t.outcome == "timeout")
    total = len(trades)

    win_rate = round(wins / total, 4) if total else 0.0
    returns = [t.return_pct for t in trades]
    avg_return = round(sum(returns) / total, 4) if total else 0.0
    total_pnl = round(sum(t.pnl for t in trades), 2)
    total_return_pct = (
        round((final_balance / initial_balance - 1.0) * 100.0, 4)
        if initial_balance > 0
        else 0.0
    )

    return BacktestMetrics(
        total_trades=total,
        wins=wins,
        losses=losses,
        timeouts=timeouts,
        win_rate=win_rate,
        avg_return_pct=avg_return,
        total_return_pct=total_return_pct,
        total_pnl=total_pnl,
        max_drawdown_pct=_max_drawdown_pct(equity_curve),
        sharpe=_sharpe(returns),
        final_balance=round(final_balance, 2),
    )
