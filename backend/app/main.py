"""FastAPI application factory.

Wires middleware, mounts routes, and manages the MarketDataService lifecycle.
The service is started in the lifespan enter-phase so the provider connection
is live before the first HTTP request, and stopped cleanly on shutdown.
"""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.health import router as health_router
from app.api.v1.router import router as v1_router
from app.api.v1.ws import router as ws_router
from app.core.config import get_settings
from app.market_data.provider import MarketDataProvider
from app.market_data.providers.mock import MockProvider
from app.market_data.service import MarketDataService
from app.patterns.engine import PatternEngine
from app.strategies.engine import StrategyEngine

log = logging.getLogger(__name__)


def _build_provider() -> MarketDataProvider:
    """Pick a provider implementation based on settings.

    CP-008 ships MockProvider. Future sprints register Alpaca/Polygon/Finnhub
    here via the same env var.
    """
    settings = get_settings()
    name = (settings.market_data_provider or "mock").lower()
    if name == "mock":
        return MockProvider()
    raise ValueError(
        f"Unknown MARKET_DATA_PROVIDER '{settings.market_data_provider}'. "
        "Only 'mock' is registered in CP-008."
    )


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    service = MarketDataService(
        _build_provider(),
        pattern_engine=PatternEngine(),
        strategy_engine=StrategyEngine(),
    )
    await service.start()
    app.state.market_data = service
    log.info("market-data service started (patterns + strategies enabled)")
    try:
        yield
    finally:
        await service.stop()
        log.info("market-data service stopped")


def create_app() -> FastAPI:
    settings = get_settings()
    logging.basicConfig(level=settings.log_level)

    app = FastAPI(
        title="CandlePilot AI API",
        version=settings.app_version,
        description="Market data, pattern detection, strategy signals, and alerts.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(v1_router, prefix="/api")
    app.include_router(ws_router)

    return app


app = create_app()
