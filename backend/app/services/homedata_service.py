import re
from typing import Any

import httpx

from app.core.config import get_settings

HOMEDATA_BASE = "https://api.homedata.co.uk"


def _normalize_postcode(postcode: str) -> str:
    cleaned = postcode.strip().upper()
    cleaned = re.sub(r"\s+", "", cleaned)
    if len(cleaned) > 3:
        return f"{cleaned[:-3]} {cleaned[-3:]}"
    return cleaned


def _postcode_path_segment(postcode: str) -> str:
    return re.sub(r"\s+", "", postcode.strip().upper())


class HomeDataServiceError(Exception):
    pass


class HomeDataService:
    def __init__(self) -> None:
        settings = get_settings()
        self._api_key = settings.homedata_api_key
        if not self._api_key:
            raise HomeDataServiceError("HomeData API key is not configured")

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Api-Key {self._api_key}"}

    async def fetch_addresses_by_postcode(self, postcode: str) -> dict[str, Any]:
        segment = _postcode_path_segment(postcode)
        url = f"{HOMEDATA_BASE}/api/address/postcode/{segment}/"
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=self._headers())
            if response.status_code == 404:
                return {"postcode": _normalize_postcode(postcode), "count": 0, "addresses": []}
            if response.status_code >= 400:
                raise HomeDataServiceError(
                    f"Address lookup failed ({response.status_code})"
                ) from None
            return response.json()

    async def fetch_epc(self, uprn: int) -> dict[str, Any]:
        url = f"{HOMEDATA_BASE}/api/epc-checker/{uprn}/"
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, headers=self._headers())
            if response.status_code >= 400:
                raise HomeDataServiceError(f"EPC lookup failed ({response.status_code})")
            return response.json()

    async def fetch_solar_assessment(self, uprn: int) -> dict[str, Any]:
        url = f"{HOMEDATA_BASE}/api/solar-assessment/{uprn}/"
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.get(url, headers=self._headers())
            if response.status_code >= 400:
                raise HomeDataServiceError(
                    f"Solar assessment failed ({response.status_code})"
                ) from None
            return response.json()

    async def fetch_property_insights(self, uprn: int) -> dict[str, Any]:
        epc, solar = await self.fetch_epc(uprn), await self.fetch_solar_assessment(uprn)
        return {"uprn": uprn, "epc": epc, "solar": solar}
