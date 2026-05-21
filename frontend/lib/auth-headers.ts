import { getOrCreateGuestId } from "@/lib/guest";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function buildAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Guest-Id": getOrCreateGuestId(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}
