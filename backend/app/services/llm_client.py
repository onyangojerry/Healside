from typing import Optional

from app.core.config import settings

try:
    from langchain_community.llms import Ollama
    _OLLAMA_IMPORT_ERROR = ""
except ImportError:
    Ollama = None
    _OLLAMA_IMPORT_ERROR = "langchain_community.llms.Ollama import failed"


def get_llm_status() -> dict:
    provider = settings.llm_provider.lower()
    if provider != "ollama":
        return {
            "provider": provider,
            "enabled": False,
            "available": False,
            "reason": "LLM provider is disabled",
            "base_url": settings.ollama_base_url,
            "model": settings.ollama_model,
        }
    if Ollama is None:
        return {
            "provider": provider,
            "enabled": True,
            "available": False,
            "reason": _OLLAMA_IMPORT_ERROR,
            "base_url": settings.ollama_base_url,
            "model": settings.ollama_model,
        }
    return {
        "provider": provider,
        "enabled": True,
        "available": True,
        "reason": "ready",
        "base_url": settings.ollama_base_url,
        "model": settings.ollama_model,
    }


def get_llm() -> Optional[object]:
    status = get_llm_status()
    if not status["available"]:
        return None
    return Ollama(base_url=settings.ollama_base_url, model=settings.ollama_model)
