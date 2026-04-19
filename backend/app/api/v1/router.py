"""Composition root for v1 REST routes.

Feature sprints (CP-008 candles, CP-009 patterns, CP-010 strategies, CP-006
alerts backend) plug their APIRouters in here via include_router(). Keeping
one wiring file avoids scattering include_router calls across main.py.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/v1")
