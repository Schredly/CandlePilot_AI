"""Backtest request + result shapes."""

from typing import Literal

from pydantic import BaseModel, Field

from app.market_data.types import Timeframe
from app.strategies.types import StrategyDirection, StrategyName

StrategySelection = StrategyName | Literal["all"]


class BacktestRequest(BaseModel):
    symbol: str = Field(description="Ticker, case-insensitive.")
    timeframe: Timeframe = Field(default="1h")
    strategy: StrategySelection = Field(
        default="all",
        description="Specific strategy to run, or 'all' to run every detector.",
    )
    bars: int = Field(default=500, ge=50, le=5000, description="Historical bars to replay.")
    initial_balance: float = Field(default=10_000.0, gt=0)
    risk_per_trade: float = Field(
        default=0.01,
        gt=0.0,
        le=0.1,
        description="Fraction of current balance risked per trade (e.g. 0.01 = 1%).",
    )


class Trade(BaseModel):
    strategy: StrategyName
    direction: StrategyDirection
    entry: float
    stop: float
    target: float
    exit: float
    entry_time: int
    exit_time: int
    outcome: Literal["win", "loss", "timeout"]
    return_pct: float = Field(description="Trade P&L as a percent of entry price.")
    pnl: float = Field(description="Dollar P&L given position sized by risk_per_trade.")


class EquityPoint(BaseModel):
    time: int
    balance: float


class BacktestMetrics(BaseModel):
    total_trades: int
    wins: int
    losses: int
    timeouts: int
    win_rate: float = Field(description="Wins / total trades.")
    avg_return_pct: float = Field(description="Arithmetic mean of per-trade return %.")
    total_return_pct: float = Field(description="Final balance / initial − 1, percent.")
    total_pnl: float
    max_drawdown_pct: float
    sharpe: float = Field(
        description="Mean / stdev of per-trade returns (unitless). No annualization."
    )
    final_balance: float


class BacktestResult(BaseModel):
    request: BacktestRequest
    trades: list[Trade]
    equity_curve: list[EquityPoint]
    metrics: BacktestMetrics
