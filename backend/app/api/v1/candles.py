"""REST endpoint for candle backfill.

Clients call this to populate their chart's history before attaching to the
WebSocket feed for live updates.
"""

from typing import get_args

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel, Field

from app.market_data.types import Candle, Timeframe

router = APIRouter(prefix="/candles", tags=["market-data"])

_VALID_TIMEFRAMES = set(get_args(Timeframe))


class CandleSeriesResponse(BaseModel):
    symbol: str
    timeframe: Timeframe
    candles: list[Candle] = Field(default_factory=list)


@router.get("/{symbol}", response_model=CandleSeriesResponse)
async def get_candles(
    request: Request,
    symbol: str,
    timeframe: str = Query(default="1h", description="One of 1m, 5m, 15m, 1h, 4h, 1d."),
    limit: int = Query(default=120, ge=1, le=1000),
) -> CandleSeriesResponse:
    if timeframe not in _VALID_TIMEFRAMES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported timeframe '{timeframe}'. Use one of: {sorted(_VALID_TIMEFRAMES)}",
        )

    service = request.app.state.market_data
    candles = await service.backfill(symbol.upper(), timeframe, limit)
    return CandleSeriesResponse(
        symbol=symbol.upper(),
        timeframe=timeframe,
        candles=candles,
    )
