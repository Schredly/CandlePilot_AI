"""Shapes for strategy drafts (detector output) and finalized signals."""

from dataclasses import dataclass
from typing import Literal

from pydantic import BaseModel, Field

StrategyName = Literal[
    "vwap_reclaim",
    "opening_range_breakout",
    "pullback_continuation",
    "mean_reversion",
    "failed_breakout",
]

StrategyDirection = Literal["LONG", "SHORT"]


@dataclass
class StrategyDraft:
    """Detector output before the engine attaches symbol/timeframe/time.

    Kept as a dataclass (not a BaseModel) so detectors can return it cheaply
    without Pydantic validation overhead per closed bar.
    """

    strategy: StrategyName
    direction: StrategyDirection
    entry: float
    stop: float
    target: float
    confidence: int
    notes: str


class StrategySignal(BaseModel):
    symbol: str
    timeframe: str
    strategy: StrategyName
    direction: StrategyDirection
    entry: float
    stop: float
    target: float
    risk_reward: float = Field(
        description="Reward/risk ratio computed from |target-entry| / |entry-stop|."
    )
    confidence: int = Field(ge=0, le=100)
    notes: str = Field(description="One-sentence human-readable description of the setup.")
    time: int = Field(description="Unix seconds of the bar that produced the signal.")
