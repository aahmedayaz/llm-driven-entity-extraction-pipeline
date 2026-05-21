from typing import Annotated

import httpx
from fastapi import Header, HTTPException

from app.core.config import get_settings


async def get_optional_user_id(
    authorization: Annotated[str | None, Header()] = None,
) -> str | None:
    if not authorization or not authorization.lower().startswith("bearer "):
        return None

    token = authorization[7:].strip()
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_anon_key:
        return None

    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "apikey": settings.supabase_anon_key,
            },
        )
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        payload = response.json()
        return payload.get("id")


def get_optional_guest_id(
    x_guest_id: Annotated[str | None, Header()] = None,
) -> str | None:
    if x_guest_id and len(x_guest_id) <= 64:
        return x_guest_id.strip()
    return None
