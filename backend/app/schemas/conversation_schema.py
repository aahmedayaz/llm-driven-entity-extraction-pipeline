from pydantic import BaseModel, Field

from app.schemas.chat_schema import ChatMessage, PropertyData


class ConversationSummary(BaseModel):
    id: str
    status: str
    extracted_data: PropertyData | None = None
    created_at: str | None = None
    updated_at: str | None = None


class ConversationDetail(BaseModel):
    id: str
    status: str
    extracted_data: PropertyData | None = None
    messages: list[ChatMessage] = Field(default_factory=list)


class CreateConversationResponse(BaseModel):
    id: str
