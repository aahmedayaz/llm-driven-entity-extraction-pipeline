const DEFAULT_API_BASE_URL = "http://localhost:8000";

/** Ensures NEXT_PUBLIC_API_URL is absolute (Vercel often omits https://). */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    return DEFAULT_API_BASE_URL;
  }

  const withoutTrailingSlash = raw.replace(/\/$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }

  return `https://${withoutTrailingSlash}`;
}
