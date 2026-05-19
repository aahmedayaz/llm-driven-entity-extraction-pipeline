import json
import re

from openai import APIConnectionError, APIStatusError, AsyncOpenAI, RateLimitError

from app.core.config import get_settings
from app.schemas.chat_schema import ChatResponse, PropertyData
from app.services.prompt_builder import SYSTEM_INSTRUCTION

REQUIRED_FIELDS = (
    "propertyType",
    "annualElectricityBill",
    "occupants",
    "heatingSystem",
    "interest",
)


class OpenAIServiceError(Exception):
    """Base error for OpenAI integration failures."""


class OpenAIRateLimitError(OpenAIServiceError):
    def __init__(self, message: str, retry_after_seconds: int | None = None) -> None:
        super().__init__(message)
        self.retry_after_seconds = retry_after_seconds


def _extract_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if not match:
            raise OpenAIServiceError("Model did not return valid JSON") from None
        return json.loads(match.group())


def _all_fields_present(data: PropertyData) -> bool:
    payload = data.model_dump()
    return all(payload.get(field) is not None for field in REQUIRED_FIELDS)


def _build_api_messages(messages: list[dict[str, str]]) -> list[dict[str, str]]:
    api_messages: list[dict[str, str]] = [
        {"role": "system", "content": SYSTEM_INSTRUCTION},
    ]

    for message in messages:
        role = message["role"]
        if role not in ("user", "assistant"):
            continue
        api_messages.append({"role": role, "content": message["content"]})

    api_messages.append(
        {
            "role": "user",
            "content": (
                "Based on the conversation, respond with JSON only. "
                "Ask for the next missing field if not complete."
            ),
        }
    )
    return api_messages


class OpenAIService:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    async def generate_chat_response(self, messages: list[dict[str, str]]) -> ChatResponse:
        api_messages = _build_api_messages(messages)

        try:
            completion = await self._client.chat.completions.create(
                model=self._model,
                messages=api_messages,
                temperature=0.4,
                response_format={"type": "json_object"},
            )
        except RateLimitError as exc:
            retry_after = None
            if exc.response and exc.response.headers.get("retry-after"):
                try:
                    retry_after = int(exc.response.headers["retry-after"])
                except ValueError:
                    pass
            raise OpenAIRateLimitError(
                "The AI service is temporarily busy. Please wait a moment and try again.",
                retry_after_seconds=retry_after,
            ) from exc
        except APIConnectionError as exc:
            raise OpenAIServiceError(
                "Could not connect to OpenAI. Check your network and try again."
            ) from exc
        except APIStatusError as exc:
            raise OpenAIServiceError(f"OpenAI API request failed: {exc.message}") from exc
        except Exception as exc:
            raise OpenAIServiceError(f"OpenAI API request failed: {exc}") from exc

        content = completion.choices[0].message.content
        if not content:
            raise OpenAIServiceError("Empty response from OpenAI")

        parsed = _extract_json(content)
        reply = str(parsed.get("reply", "")).strip()
        if not reply:
            raise OpenAIServiceError("Model response missing reply field")

        raw_data = parsed.get("data") or {}
        property_data = PropertyData.model_validate(raw_data)
        complete = bool(parsed.get("complete", False))

        if complete and not _all_fields_present(property_data):
            complete = False

        if complete:
            return ChatResponse(reply=reply, complete=True, data=property_data)

        return ChatResponse(reply=reply, complete=False, data=property_data)
