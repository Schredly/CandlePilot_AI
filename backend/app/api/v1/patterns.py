"""REST endpoint for recent detected patterns.

Used by the frontend to populate an initial list before attaching to the WS
feed, and by anything async (alerting, digests) that wants a snapshot.
"""

from typing import get_args

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field

from app.market_data.types import Timeframe
from app.patterns.types import DetectedPattern

router = APIRouter(prefix="/patterns", tags=["patterns"])

_VALID_TIMEFRAMES = set(get_args(Timeframe))


class PatternsResponse(BaseModel):
    symbol: str
    timeframe: Timeframe
    patterns: list[DetectedPattern] = Field(default_factory=list)


@router.get("/{symbol}", response_model=PatternsResponse)
async def get_patterns(
    request: Request,
    symbol: str,
    timeframe: str = Query(default="1h", description="One of 1m, 5m, 15m, 1h, 4h, 1d."),
    limit: int = Query(default=50, ge=1, le=500),
) -> PatternsResponse:
    if timeframe not in _VALID_TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported timeframe '{timeframe}'. Use one of: {sorted(_VALID_TIMEFRAMES)}",
        )

    engine = request.app.state.market_data.patterns
    if engine is None:
        raise HTTPException(status_code=503, detail="Pattern engine is not enabled.")

    return PatternsResponse(
        symbol=symbol.upper(),
        timeframe=timeframe,
        patterns=engine.recent(symbol.upper(), timeframe, limit),
    )
