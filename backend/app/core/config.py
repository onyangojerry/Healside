try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://user:password@localhost/healside"
    redis_url: str = "redis://localhost:6379/0"
    secret_key: str = "secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    llm_provider: str = "none"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "phi3:mini"

    class Config:
        env_file = ".env"

settings = Settings()
