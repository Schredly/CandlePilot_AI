"""POST /api/v1/backtest — run a strategy over historical candles."""

from fastapi import APIRouter, Request

from app.backtest.runner import run_backtest
from app.backtest.types import BacktestRequest, BacktestResult

router = APIRouter(prefix="/backtest", tags=["backtest"])


@router.post("", response_model=BacktestResult)
async def post_backtest(request: Request, body: BacktestRequest) -> BacktestResult:
    service = request.app.state.market_data
    return await run_backtest(service, body)
