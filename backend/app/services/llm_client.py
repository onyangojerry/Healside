from typing import Optional

from app.core.config import settings

try:
    from langchain_community.llms import Ollama
except ImportError:
    Ollama = None


def get_llm() -> Optional[object]:
    if settings.llm_provider.lower() != "ollama":
        return None
    if Ollama is None:
        return None
    return Ollama(base_url=settings.ollama_base_url, model=settings.ollama_model)
