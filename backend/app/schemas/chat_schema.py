from typing import Literal

from pydantic import BaseModel, Field

Role = Literal["user", "assistant"]


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(min_length=1)


class PropertyData(BaseModel):
    propertyType: str | None = None
    annualElectricityBill: float | None = None
    occupants: int | None = None
    heatingSystem: str | None = None
    interest: str | None = None


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)
    conversation_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    complete: bool
    data: PropertyData | None = None
