import re

from app.schemas.chat_schema import ChatResponse, PropertyData

FIELD_ORDER = (
    "propertyType",
    "annualElectricityBill",
    "occupants",
    "heatingSystem",
    "interest",
)

QUESTIONS: dict[str, str] = {
    "propertyType": (
        "What type of property do you have — detached, semi-detached, terraced, or flat?"
    ),
    "annualElectricityBill": (
        "Thanks! Roughly what is your approximate annual electricity bill in pounds?"
    ),
    "occupants": "How many people live in the property?",
    "heatingSystem": (
        "What heating system do you use — gas boiler, oil, LPG, electric, or other?"
    ),
    "interest": "Are you interested in solar only, or solar plus battery storage?",
}

CLARIFY: dict[str, str] = {
    "propertyType": (
        "I didn't catch the property type. Please choose one: detached, semi-detached, "
        "terraced, or flat."
    ),
    "annualElectricityBill": (
        "Please share your approximate annual electricity bill as a number in pounds "
        "(for example, 1200)."
    ),
    "occupants": "Please enter how many people live in the property (a whole number).",
    "heatingSystem": (
        "Please choose your heating system: gas boiler, oil, LPG, electric, or other."
    ),
    "interest": "Please choose either solar only or solar + battery storage.",
}


def _user_messages(messages: list[dict[str, str]]) -> list[str]:
    return [message["content"] for message in messages if message["role"] == "user"]


def _extract_property_type(text: str) -> str | None:
    lowered = text.lower()
    if "semi-detached" in lowered or "semi detached" in lowered:
        return "semi-detached"
    if re.search(r"\bdetached\b", lowered) and "semi" not in lowered:
        return "detached"
    if "terraced" in lowered or re.search(r"\bterrace\b", lowered):
        return "terraced"
    if re.search(r"\bflat\b", lowered) or "apartment" in lowered:
        return "flat"
    return None


def _extract_bill(text: str) -> float | None:
    lowered = text.lower()
    k_match = re.search(r"([\d][\d,]*(?:\.\d+)?)\s*k(?:\s|$|[^a-z])", lowered)
    if k_match:
        value = float(k_match.group(1).replace(",", "")) * 1000
        if 50 <= value <= 50_000:
            return value

    for match in re.finditer(r"£?\s*([\d][\d,]*(?:\.\d+)?)", text):
        value = float(match.group(1).replace(",", ""))
        if 50 <= value <= 50_000:
            return value
    return None


def _extract_occupants(text: str) -> int | None:
    lowered = text.lower().strip()
    word_map = {
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
    }
    for word, count in word_map.items():
        if re.search(rf"\b{word}\b", lowered):
            return count

    match = re.search(r"\b(\d{1,2})\b", lowered)
    if match:
        count = int(match.group(1))
        if 1 <= count <= 30:
            return count
    return None


def _extract_heating(text: str) -> str | None:
    lowered = text.lower()
    has_lpg = bool(re.search(r"\blpg\b", lowered))
    has_oil = bool(re.search(r"\boil\b", lowered))
    if has_lpg and has_oil:
        return None

    if "gas" in lowered and "boiler" in lowered:
        return "gas boiler"
    if re.search(r"\bgas\b", lowered):
        return "gas boiler"
    if has_oil:
        return "oil"
    if has_lpg:
        return "LPG"
    if "electric" in lowered:
        return "electric"
    if re.search(r"\bother\b", lowered):
        return "other"
    return None


def _extract_interest(text: str) -> str | None:
    lowered = text.lower()
    rejects_battery = bool(
        re.search(
            r"(not|no|without|only)\s+.*(battery|solar\s*\+\s*battery)|not\s+solar\s*\+\s*battery",
            lowered,
        )
    )
    wants_battery = bool(
        re.search(r"solar\s*\+\s*battery|battery\s+storage|solar\s+and\s+battery", lowered)
    ) and not rejects_battery

    if wants_battery:
        return "solar + battery storage"
    if "solar only" in lowered or (
        "solar" in lowered and (rejects_battery or "only solar" in lowered)
    ):
        return "solar only"
    if "solar" in lowered and not rejects_battery and "battery" not in lowered:
        return "solar only"
    return None


def _extract_field(field: str, text: str) -> str | float | int | None:
    if field == "propertyType":
        return _extract_property_type(text)
    if field == "annualElectricityBill":
        return _extract_bill(text)
    if field == "occupants":
        return _extract_occupants(text)
    if field == "heatingSystem":
        return _extract_heating(text)
    if field == "interest":
        return _extract_interest(text)
    return None


def collect_fields_from_messages(
    messages: list[dict[str, str]],
) -> dict[str, str | float | int | None]:
    """Scan all user messages; later messages override earlier values for the same field."""
    return _collect_fields(messages)


def next_missing_field(collected: dict[str, str | float | int | None]) -> str | None:
    return _next_missing_field(collected)


def survey_prompt_for_field(
    messages: list[dict[str, str]],
    field: str,
) -> str:
    """Canonical question for the next empty field (matches deterministic survey flow)."""
    collected = _collect_fields(messages)
    last_text = _last_user_text(messages)
    if last_text and _extract_field(field, last_text) is None and any(
        collected[f] is not None for f in FIELD_ORDER
    ):
        return CLARIFY[field]
    return QUESTIONS[field]


def _collect_fields(messages: list[dict[str, str]]) -> dict[str, str | float | int | None]:
    collected: dict[str, str | float | int | None] = {field: None for field in FIELD_ORDER}
    user_texts = _user_messages(messages)

    for field in FIELD_ORDER:
        for text in user_texts:
            value = _extract_field(field, text)
            if value is not None:
                collected[field] = value

    return collected


def _build_property_data(collected: dict[str, str | float | int | None]) -> PropertyData:
    return PropertyData(
        propertyType=collected["propertyType"],  # type: ignore[arg-type]
        annualElectricityBill=collected["annualElectricityBill"],  # type: ignore[arg-type]
        occupants=collected["occupants"],  # type: ignore[arg-type]
        heatingSystem=collected["heatingSystem"],  # type: ignore[arg-type]
        interest=collected["interest"],  # type: ignore[arg-type]
    )


def _next_missing_field(collected: dict[str, str | float | int | None]) -> str | None:
    for field in FIELD_ORDER:
        if collected[field] is None:
            return field
    return None


def _last_user_text(messages: list[dict[str, str]]) -> str | None:
    user_texts = _user_messages(messages)
    return user_texts[-1] if user_texts else None


def generate_fallback_response(messages: list[dict[str, str]]) -> ChatResponse:
    collected = _collect_fields(messages)
    property_data = _build_property_data(collected)
    missing = _next_missing_field(collected)

    if missing is None:
        return ChatResponse(
            reply=(
                "Thank you — I have all the details I need. "
                "Your property summary is ready below."
            ),
            complete=True,
            data=property_data,
        )

    last_text = _last_user_text(messages)
    if last_text and _extract_field(missing, last_text) is None and any(
        collected[field] is not None for field in FIELD_ORDER
    ):
        reply = CLARIFY[missing]
    else:
        reply = QUESTIONS[missing]

    return ChatResponse(
        reply=reply,
        complete=False,
        data=property_data,
    )
