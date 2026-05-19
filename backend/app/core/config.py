from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    # Comma-separated production origins (e.g. Vercel URL). Optional for local dev.
    cors_origins: str = ""
    # Allow http://localhost:<any-port> and http://127.0.0.1:<any-port>
    cors_allow_localhost_any_port: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def cors_localhost_regex(self) -> str | None:
        if not self.cors_allow_localhost_any_port:
            return None
        return r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$"


@lru_cache
def get_settings() -> Settings:
    return Settings()
