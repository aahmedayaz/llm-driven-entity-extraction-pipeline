from app.schemas.chat_schema import ChatResponse
from app.services.fallback_chat_service import generate_fallback_response


class OpenAIServiceError(Exception):
    """Base error for OpenAI integration failures."""


class OpenAIRateLimitError(OpenAIServiceError):
    def __init__(self, message: str, retry_after_seconds: int | None = None) -> None:
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


class OpenAIService:
    def __init__(self) -> None:
        # The survey has a fixed five-field schema, so deterministic extraction is
        # the reliable source of truth for what has already been answered.
        pass

    async def generate_chat_response(self, messages: list[dict[str, str]]) -> ChatResponse:
        return generate_fallback_response(messages)
