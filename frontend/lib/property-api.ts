import { buildAuthHeaders } from "@/lib/auth-headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export interface AddressItem {
  uprn: number;
  address: string;
  building_name?: string | null;
  building_number?: string | null;
  sub_building?: string | null;
  street?: string | null;
  town?: string | null;
}

export interface PostcodeResponse {
  postcode: string;
  count: number;
  addresses: AddressItem[];
}

export interface PropertyInsights {
  uprn: number;
  epc: {
    current_energy_efficiency?: number;
    potential_energy_efficiency?: number;
    last_epc_date?: string;
    epc_floor_area?: number;
    construction_age_band?: string;
    epc_id?: string;
  };
  solar: Record<string, unknown>;
}

export async function fetchAddressesByPostcode(
  postcode: string,
): Promise<PostcodeResponse> {
  const encoded = encodeURIComponent(postcode.trim());
  const response = await fetch(`${API_BASE_URL}/property/postcode/${encoded}`, {
    headers: await buildAuthHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { detail?: string }).detail ?? "Failed to load addresses",
    );
  }
  return response.json() as Promise<PostcodeResponse>;
}

export async function fetchPropertyInsights(uprn: number): Promise<PropertyInsights> {
  const response = await fetch(`${API_BASE_URL}/property/insights/${uprn}`, {
    headers: await buildAuthHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { detail?: string }).detail ?? "Failed to load property insights",
    );
  }
  return response.json() as Promise<PropertyInsights>;
}

export async function savePropertyReport(payload: {
  uprn: number;
  postcode: string;
  address: string;
  epc: PropertyInsights["epc"];
  solar: PropertyInsights["solar"];
}): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/property/reports/save`, {
    method: "POST",
    headers: await buildAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { detail?: string }).detail ?? "Sign in to save this report",
    );
  }
}
