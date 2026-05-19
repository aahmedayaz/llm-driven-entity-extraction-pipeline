from fastapi import APIRouter, HTTPException

from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.openai_service import (
    OpenAIRateLimitError,
    OpenAIService,
    OpenAIServiceError,
)

router = APIRouter(prefix="/chat", tags=["chat"])
_openai_service = OpenAIService()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    message_payload = [
        {"role": message.role, "content": message.content}
        for message in request.messages
    ]

    try:
        return await _openai_service.generate_chat_response(message_payload)
    except OpenAIRateLimitError as exc:
        headers = {}
        if exc.retry_after_seconds is not None:
            headers["Retry-After"] = str(exc.retry_after_seconds)
        raise HTTPException(
            status_code=429,
            detail=str(exc),
            headers=headers,
        ) from exc
    except OpenAIServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
