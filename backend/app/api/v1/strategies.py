"""REST endpoint for recent strategy signals."""

from typing import get_args

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field

from app.market_data.types import Timeframe
from app.strategies.types import StrategySignal

router = APIRouter(prefix="/strategies", tags=["strategies"])

_VALID_TIMEFRAMES = set(get_args(Timeframe))


class StrategiesResponse(BaseModel):
    symbol: str
    timeframe: Timeframe
    signals: list[StrategySignal] = Field(default_factory=list)


@router.get("/{symbol}", response_model=StrategiesResponse)
async def get_strategies(
    request: Request,
    symbol: str,
    timeframe: str = Query(default="1h", description="One of 1m, 5m, 15m, 1h, 4h, 1d."),
    limit: int = Query(default=50, ge=1, le=500),
) -> StrategiesResponse:
    if timeframe not in _VALID_TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported timeframe '{timeframe}'. Use one of: {sorted(_VALID_TIMEFRAMES)}",
        )

    engine = request.app.state.market_data.strategies
    if engine is None:
        raise HTTPException(status_code=503, detail="Strategy engine is not enabled.")

    return StrategiesResponse(
        symbol=symbol.upper(),
        timeframe=timeframe,
        signals=engine.recent(symbol.upper(), timeframe, limit),
    )
