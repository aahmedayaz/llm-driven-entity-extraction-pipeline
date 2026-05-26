import { getOrCreateGuestId } from "@/lib/guest";
import { getSupabaseClient } from "@/lib/supabase/client";

const SESSION_LOOKUP_MS = 3000;

async function getSupabaseAccessToken(): Promise<string | undefined> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return undefined;
  }

  try {
    const { data } = await Promise.race([
      supabase.auth.getSession(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Supabase session lookup timed out")), SESSION_LOOKUP_MS);
      }),
    ]);
    return data.session?.access_token;
  } catch {
    return undefined;
  }
}

export async function buildAuthHeaders(): Promise<HeadersInit> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Guest-Id": getOrCreateGuestId(),
  };

  const token = await getSupabaseAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
