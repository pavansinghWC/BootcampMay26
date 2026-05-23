from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_ENV: str = "development"
    PORT: int = 8000
    MONGODB_URI: str
    JWT_SECRET: str
    JWT_EXPIRES_IN: int = 86400
    CORS_ORIGINS: str = "http://localhost:5500,http://127.0.0.1:5500"
    ANTHROPIC_API_KEY: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
