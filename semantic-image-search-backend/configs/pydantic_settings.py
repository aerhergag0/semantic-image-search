from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", env_prefix="APP_")

    POSTGRESQL_DB_URL: str
    FRONTEND_URL: str
    S3_BUCKET_PATH: str
    UPLOADS_PATH: str
    ALLOWED_ORIGINS: str

    @property
    def origins(self) -> list[str]:
        return self.ALLOWED_ORIGINS.split(',')


settings = AppSettings()
