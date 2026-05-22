import json
import re

from openai import APIConnectionError, APIStatusError, AsyncOpenAI, RateLimitError

from app.core.config import get_settings
from app.schemas.chat_schema import ChatResponse, PropertyData
from app.services.fallback_chat_service import (
    collect_fields_from_messages,
    next_missing_field,
    survey_prompt_for_field,
)
from app.services.prompt_builder import SYSTEM_INSTRUCTION

REQUIRED_FIELDS = (
    "propertyType",
    "annualElectricityBill",
    "occupants",
    "heatingSystem",
    "interest",
)

_FIELD_LABELS: dict[str, str] = {
    "propertyType": "property type (detached, semi-detached, terraced, or flat)",
    "annualElectricityBill": "approximate annual electricity bill in pounds",
    "occupants": "number of people living in the property",
    "heatingSystem": "heating system (gas boiler, oil, LPG, electric, or other)",
    "interest": "solar only OR solar + battery storage",
}

# Used only to detect when the LLM reply re-asks an already-collected field (triggers one rewrite).
_FIELD_ASK_PATTERNS: dict[str, re.Pattern[str]] = {
    "propertyType": re.compile(
        r"property type|type of property|detached|semi-detached|terraced|\bflat\b",
        re.I,
    ),
    "annualElectricityBill": re.compile(
        r"electricity bill|annual bill|bill in (?:british )?pounds|energy bill",
        re.I,
    ),
    "occupants": re.compile(
        r"how many people|number of people|occupants|live in the property|people living",
        re.I,
    ),
    "heatingSystem": re.compile(
        r"heating system|gas boiler|\blpg\b|\boil\b|electric heating",
        re.I,
    ),
    "interest": re.compile(
        r"solar only|battery storage|solar plus|interested in solar",
        re.I,
    ),
}


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


def _merge_property_data(
    llm_data: PropertyData,
    collected: dict[str, str | float | int | None],
) -> PropertyData:
    """
    LLM data is authoritative when it sets a value (including corrections).
    Deterministic extraction only fills fields the model left null.
    """
    merged: dict[str, str | float | int | None] = {}
    llm_payload = llm_data.model_dump()
    for field in REQUIRED_FIELDS:
        llm_value = llm_payload.get(field)
        extracted = collected.get(field)
        merged[field] = llm_value if llm_value is not None else extracted
    return PropertyData.model_validate(merged)


def _filled_fields(snapshot: dict[str, str | float | int | None]) -> set[str]:
    return {field for field in REQUIRED_FIELDS if snapshot.get(field) is not None}


def _reply_asks_about_field(reply: str, field: str) -> bool:
    pattern = _FIELD_ASK_PATTERNS.get(field)
    return bool(pattern and pattern.search(reply))


def _reply_reasks_collected_field(
    reply: str,
    merged: dict[str, str | float | int | None],
) -> bool:
    for field in _filled_fields(merged):
        if _reply_asks_about_field(reply, field):
            return True
    return False


def _build_api_messages(
    messages: list[dict[str, str]],
    collected: dict[str, str | float | int | None],
) -> list[dict[str, str]]:
    already = {key: value for key, value in collected.items() if value is not None}
    still_need = [field for field in REQUIRED_FIELDS if collected.get(field) is None]
    next_field = still_need[0] if still_need else None

    tail = (
        f"Current understanding of collected fields: {json.dumps(already)}. "
        f"Fields still required (in this order): {still_need}. "
        "Respond with valid JSON only. "
        "The reply field MUST be your own natural, conversational message (not a canned template). "
        "In data, output your latest understanding of ALL five fields from the full conversation. "
        "If the user corrects an earlier answer (e.g. flat then later detached), update that field in data. "
        "Never ask about a field that already has a final value in your data object."
    )
    if next_field:
        label = _FIELD_LABELS[next_field]
        guide = survey_prompt_for_field(messages, next_field)
        tail += (
            f" Ask only about {label} next. Topic guidance (phrase in your own words): {guide}"
        )

    api_messages: list[dict[str, str]] = [
        {"role": "system", "content": SYSTEM_INSTRUCTION},
    ]

    for message in messages:
        role = message["role"]
        if role not in ("user", "assistant"):
            continue
        api_messages.append({"role": role, "content": message["content"]})

    api_messages.append({"role": "user", "content": tail})
    return api_messages


class OpenAIService:
    def __init__(self) -> None:
        settings = get_settings()
        self._client = AsyncOpenAI(api_key=settings.openai_api_key)
        self._model = settings.openai_model

    async def _request_completion(self, api_messages: list[dict[str, str]]) -> str:
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
        return content

    async def _rewrite_reply_via_llm(
        self,
        api_messages: list[dict[str, str]],
        bad_reply: str,
        merged: dict[str, str | float | int | None],
        missing: str,
    ) -> str:
        already = {key: value for key, value in merged.items() if value is not None}
        label = _FIELD_LABELS[missing]
        rewrite_messages = [
            *api_messages,
            {
                "role": "assistant",
                "content": json.dumps({"reply": bad_reply, "complete": False}),
            },
            {
                "role": "user",
                "content": (
                    f"Your reply re-asked information already collected: {json.dumps(already)}. "
                    f"Rewrite ONLY a new conversational reply that asks about {label} and does NOT "
                    "ask about any already-collected field. Respond with JSON: "
                    '{"reply": "your new message"}'
                ),
            },
        ]
        content = await self._request_completion(rewrite_messages)
        parsed = _extract_json(content)
        reply = str(parsed.get("reply", "")).strip()
        if not reply:
            raise OpenAIServiceError("Model response missing reply field on rewrite")
        return reply

    async def generate_chat_response(self, messages: list[dict[str, str]]) -> ChatResponse:
        collected = collect_fields_from_messages(messages)
        api_messages = _build_api_messages(messages, collected)

        content = await self._request_completion(api_messages)
        parsed = _extract_json(content)
        reply = str(parsed.get("reply", "")).strip()
        if not reply:
            raise OpenAIServiceError("Model response missing reply field")

        raw_data = parsed.get("data") or {}
        llm_data = PropertyData.model_validate(raw_data)
        property_data = _merge_property_data(llm_data, collected)
        complete = bool(parsed.get("complete", False))

        if complete and not _all_fields_present(property_data):
            complete = False

        if _all_fields_present(property_data):
            complete = True
            if not reply:
                reply = (
                    "Thank you — I have all the details I need. "
                    "Your property summary is ready below."
                )
            return ChatResponse(reply=reply, complete=True, data=property_data)

        merged_snapshot = property_data.model_dump()
        missing = next_missing_field(merged_snapshot)
        if missing and _reply_reasks_collected_field(reply, merged_snapshot):
            reply = await self._rewrite_reply_via_llm(
                api_messages, reply, merged_snapshot, missing
            )

        return ChatResponse(reply=reply, complete=False, data=property_data)
