from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DEV_MODE: bool = True
    
    # DB URL
    DB_URL: str
    
    # Entra ID specifics (Mocked for now in .env)
    ENTRA_TENANT_ID: str = "mock-tenant-id"
    ENTRA_CLIENT_ID: str = "mock-client-id"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
