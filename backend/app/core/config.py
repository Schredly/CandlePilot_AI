"""Application settings loaded from environment variables.

Uses pydantic-settings so every env var is validated at boot and surfaces
a clear error if something is missing once we actually need it. During
CP-001 most values are optional — they only become required when the
feature that uses them is built (database in CP-008, market-data in
CP-008, etc.).
"""

from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    environment: Literal["dev", "staging", "prod"] = "dev"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # Comma-separated list. Parsed by cors_origins().
    frontend_origins: str = "http://localhost:3000"

    # Postgres async DSN (postgresql+asyncpg://...). Empty until CP-008 wires it up.
    database_url: str = ""

    # Market-data provider config — populated in CP-008.
    market_data_provider: str = ""
    market_data_api_key: str = ""
    market_data_api_secret: str = ""

    # App metadata surfaced via /health.
    app_name: str = Field(default="candlepilot-backend")
    app_version: str = Field(default="0.1.0")

    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached accessor so settings are parsed once per process."""
    return Settings()
