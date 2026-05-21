from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_optional_guest_id, get_optional_user_id
from app.schemas.chat_schema import ChatMessage, PropertyData
from app.schemas.conversation_schema import (
    ConversationDetail,
    ConversationSummary,
    CreateConversationResponse,
)
from app.services.supabase_store import SupabaseStoreError, get_supabase_store

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("", response_model=CreateConversationResponse)
async def create_conversation(
    user_id: str | None = Depends(get_optional_user_id),
    guest_id: str | None = Depends(get_optional_guest_id),
) -> CreateConversationResponse:
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Sign in to save chat history.",
        )

    store = get_supabase_store()
    if not store:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        row = await store.create_conversation(user_id=user_id, guest_id=guest_id)
    except SupabaseStoreError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return CreateConversationResponse(id=row["id"])


@router.get("", response_model=list[ConversationSummary])
async def list_conversations(
    user_id: str | None = Depends(get_optional_user_id),
) -> list[ConversationSummary]:
    if not user_id:
        raise HTTPException(status_code=401, detail="Sign in required")

    store = get_supabase_store()
    if not store:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        rows = await store.list_conversations_for_user(user_id)
    except SupabaseStoreError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return [
        ConversationSummary(
            id=row["id"],
            status=row.get("status", "in_progress"),
            extracted_data=row.get("extracted_data"),
            created_at=row.get("created_at"),
            updated_at=row.get("updated_at"),
        )
        for row in rows
    ]


@router.get("/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(
    conversation_id: str,
    user_id: str | None = Depends(get_optional_user_id),
) -> ConversationDetail:
    if not user_id:
        raise HTTPException(status_code=401, detail="Sign in required")

    store = get_supabase_store()
    if not store:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        conv = await store.get_conversation_for_user(conversation_id, user_id)
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        messages_raw = await store.get_messages(conversation_id)
    except SupabaseStoreError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    messages = [
        ChatMessage(role=m["role"], content=m["content"]) for m in messages_raw
    ]

    return ConversationDetail(
        id=conv["id"],
        status=conv.get("status", "in_progress"),
        extracted_data=conv.get("extracted_data"),
        messages=messages,
    )
