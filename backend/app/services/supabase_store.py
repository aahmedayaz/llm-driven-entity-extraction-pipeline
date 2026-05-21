from datetime import datetime, timezone
from typing import Any
from uuid import UUID

import httpx

from app.core.config import get_settings


class SupabaseStoreError(Exception):
    pass


class SupabaseStore:
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_role_key:
            raise SupabaseStoreError("Supabase is not configured")
        self._base = settings.supabase_url.rstrip("/") + "/rest/v1"
        self._headers = {
            "apikey": settings.supabase_service_role_key,
            "Authorization": f"Bearer {settings.supabase_service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def _request(
        self,
        method: str,
        table: str,
        *,
        params: dict[str, str] | None = None,
        json_body: Any = None,
    ) -> Any:
        url = f"{self._base}/{table}"
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.request(
                method,
                url,
                headers=self._headers,
                params=params,
                json=json_body,
            )
            if response.status_code >= 400:
                raise SupabaseStoreError(
                    f"Supabase {table} error: {response.status_code} {response.text}"
                )
            if response.status_code == 204 or not response.content:
                return None
            return response.json()

    async def create_conversation(
        self,
        *,
        user_id: str | None,
        guest_id: str | None,
    ) -> dict[str, Any]:
        rows = await self._request(
            "POST",
            "conversations",
            json_body={
                "user_id": user_id,
                "guest_id": guest_id,
                "status": "in_progress",
            },
        )
        return rows[0] if isinstance(rows, list) else rows

    async def update_conversation(
        self,
        conversation_id: str,
        *,
        status: str | None = None,
        extracted_data: dict[str, Any] | None = None,
    ) -> None:
        body: dict[str, Any] = {
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        if status:
            body["status"] = status
        if extracted_data is not None:
            body["extracted_data"] = extracted_data
        await self._request(
            "PATCH",
            "conversations",
            params={"id": f"eq.{conversation_id}"},
            json_body=body,
        )

    async def insert_message(
        self,
        conversation_id: str,
        role: str,
        content: str,
    ) -> None:
        await self._request(
            "POST",
            "messages",
            json_body={
                "conversation_id": conversation_id,
                "role": role,
                "content": content,
            },
        )

    async def list_conversations_for_user(self, user_id: str) -> list[dict[str, Any]]:
        rows = await self._request(
            "GET",
            "conversations",
            params={
                "user_id": f"eq.{user_id}",
                "order": "updated_at.desc",
                "select": "id,status,extracted_data,created_at,updated_at",
            },
        )
        return rows if isinstance(rows, list) else []

    async def get_conversation_for_user(
        self,
        conversation_id: str,
        user_id: str,
    ) -> dict[str, Any] | None:
        rows = await self._request(
            "GET",
            "conversations",
            params={
                "id": f"eq.{conversation_id}",
                "user_id": f"eq.{user_id}",
                "select": "id,status,extracted_data",
            },
        )
        if not rows:
            return None
        return rows[0] if isinstance(rows, list) else rows

    async def get_messages(self, conversation_id: str) -> list[dict[str, Any]]:
        rows = await self._request(
            "GET",
            "messages",
            params={
                "conversation_id": f"eq.{conversation_id}",
                "order": "created_at.asc",
                "select": "role,content,created_at",
            },
        )
        return rows if isinstance(rows, list) else []

    async def save_property_report(
        self,
        *,
        user_id: str | None,
        guest_id: str | None,
        uprn: int,
        postcode: str,
        address: str,
        epc_data: dict[str, Any],
        solar_data: dict[str, Any],
    ) -> dict[str, Any]:
        rows = await self._request(
            "POST",
            "property_reports",
            json_body={
                "user_id": user_id,
                "guest_id": guest_id,
                "uprn": uprn,
                "postcode": postcode,
                "address": address,
                "epc_data": epc_data,
                "solar_data": solar_data,
            },
        )
        return rows[0] if isinstance(rows, list) else rows


def get_supabase_store() -> SupabaseStore | None:
    try:
        return SupabaseStore()
    except SupabaseStoreError:
        return None
