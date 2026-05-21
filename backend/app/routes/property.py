from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_optional_guest_id, get_optional_user_id
from app.schemas.property_schema import (
    PostcodeAddressResponse,
    PropertyInsightsResponse,
    SavePropertyReportRequest,
)
from app.services.homedata_service import HomeDataService, HomeDataServiceError
from app.services.supabase_store import SupabaseStoreError, get_supabase_store

router = APIRouter(prefix="/property", tags=["property"])


def _get_homedata() -> HomeDataService:
    try:
        return HomeDataService()
    except HomeDataServiceError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@router.get("/postcode/{postcode}", response_model=PostcodeAddressResponse)
async def addresses_by_postcode(postcode: str) -> PostcodeAddressResponse:
    service = _get_homedata()
    try:
        raw = await service.fetch_addresses_by_postcode(postcode)
    except HomeDataServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    addresses = raw.get("addresses") or []
    return PostcodeAddressResponse(
        postcode=raw.get("postcode", postcode),
        count=int(raw.get("count", len(addresses))),
        addresses=addresses,
    )


@router.get("/insights/{uprn}", response_model=PropertyInsightsResponse)
async def property_insights(uprn: int) -> PropertyInsightsResponse:
    service = _get_homedata()
    try:
        payload = await service.fetch_property_insights(uprn)
    except HomeDataServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return PropertyInsightsResponse(
        uprn=uprn,
        epc=payload["epc"],
        solar=payload["solar"],
    )


@router.post("/reports/save")
async def save_property_report(
    body: SavePropertyReportRequest,
    user_id: str | None = Depends(get_optional_user_id),
    guest_id: str | None = Depends(get_optional_guest_id),
) -> dict[str, str]:
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Sign in to save property reports to your account.",
        )

    store = get_supabase_store()
    if not store:
        raise HTTPException(status_code=503, detail="Database is not configured")

    try:
        row = await store.save_property_report(
            user_id=user_id,
            guest_id=guest_id,
            uprn=body.uprn,
            postcode=body.postcode,
            address=body.address,
            epc_data=body.epc,
            solar_data=body.solar,
        )
    except SupabaseStoreError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return {"id": row.get("id", ""), "status": "saved"}
