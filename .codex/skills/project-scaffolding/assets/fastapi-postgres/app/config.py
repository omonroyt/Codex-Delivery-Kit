from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5432/appdb"
    app_env: str = "development"
    port: int = 8000
    jwt_secret: str = "change-me-fastapi-secret"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
