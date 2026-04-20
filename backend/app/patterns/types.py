"""Shapes returned by detectors and emitted through the hub."""

from typing import Literal

from pydantic import BaseModel, Field

PatternName = Literal["hammer", "doji", "engulfing", "shooting_star", "inside_bar"]

PatternDirection = Literal["bullish", "bearish", "neutral"]


class DetectedPattern(BaseModel):
    symbol: str
    timeframe: str
    pattern: PatternName
    direction: PatternDirection
    confidence: int = Field(ge=0, le=100, description="Textbook-fit score 0–100.")
    time: int = Field(description="Unix seconds of the bar the pattern confirmed on.")
