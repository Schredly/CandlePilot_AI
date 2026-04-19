"""Lazy async SQLAlchemy engine + session factory.

The engine is constructed on first use so the service can boot without a
database configured. Any caller that needs persistence raises immediately
with a clear error if DATABASE_URL is unset.
"""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

_engine: AsyncEngine | None = None
_session_factory: async_sessionmaker[AsyncSession] | None = None


def _init() -> async_sessionmaker[AsyncSession]:
    global _engine, _session_factory
    settings = get_settings()
    if not settings.database_url:
        raise RuntimeError(
            "DATABASE_URL is not configured. Set it in backend/.env before using the database."
        )
    if _engine is None:
        _engine = create_async_engine(settings.database_url, pool_pre_ping=True)
        _session_factory = async_sessionmaker(_engine, expire_on_commit=False)
    assert _session_factory is not None
    return _session_factory


async def get_session() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency yielding an AsyncSession scoped to the request."""
    factory = _init()
    async with factory() as session:
        yield session
