from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "local"
    
    # DB URL
    DB_URL: str
    
    # Identity Provider specifics
    IDP_JWKS_URL: str = ""
    IDP_CLIENT_ID: str = ""
    
    # Dev-only secret for mocked SSO
    JWT_SECRET: str = "dev_only"
    JWT_ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
