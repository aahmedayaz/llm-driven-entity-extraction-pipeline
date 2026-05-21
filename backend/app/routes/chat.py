from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_optional_user_id
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.openai_service import (
    OpenAIRateLimitError,
    OpenAIService,
    OpenAIServiceError,
)
from app.services.supabase_store import SupabaseStoreError, get_supabase_store

router = APIRouter(prefix="/chat", tags=["chat"])
_openai_service = OpenAIService()


@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user_id: str | None = Depends(get_optional_user_id),
) -> ChatResponse:
    message_payload = [
        {"role": message.role, "content": message.content}
        for message in request.messages
    ]

    try:
        response = await _openai_service.generate_chat_response(message_payload)
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

    if user_id and request.conversation_id:
        store = get_supabase_store()
        if store:
            last_user = next(
                (m for m in reversed(request.messages) if m.role == "user"),
                None,
            )
            try:
                if last_user:
                    await store.insert_message(
                        request.conversation_id,
                        "user",
                        last_user.content,
                    )
                await store.insert_message(
                    request.conversation_id,
                    "assistant",
                    response.reply,
                )
                status = "completed" if response.complete else "in_progress"
                extracted = response.data.model_dump() if response.data else None
                await store.update_conversation(
                    request.conversation_id,
                    status=status,
                    extracted_data=extracted,
                )
            except SupabaseStoreError:
                pass

    return response
