"""Composition root for v1 REST routes.

Feature sprints plug their APIRouters in here. Keeping one wiring file avoids
scattering include_router calls across main.py.
"""

from fastapi import APIRouter

from . import backtest, candles, patterns, strategies

router = APIRouter(prefix="/v1")

router.include_router(candles.router)
router.include_router(patterns.router)
router.include_router(strategies.router)
router.include_router(backtest.router)
