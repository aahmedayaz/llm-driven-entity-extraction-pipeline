from pydantic import BaseModel, Field


class AddressItem(BaseModel):
    model_config = {"extra": "ignore"}

    uprn: int
    address: str
    building_name: str | None = None
    building_number: str | None = None
    sub_building: str | None = None
    street: str | None = None
    town: str | None = None


class PostcodeAddressResponse(BaseModel):
    postcode: str
    count: int
    addresses: list[AddressItem]


class PropertyInsightsResponse(BaseModel):
    uprn: int
    epc: dict
    solar: dict


class SavePropertyReportRequest(BaseModel):
    uprn: int
    postcode: str
    address: str
    epc: dict
    solar: dict
