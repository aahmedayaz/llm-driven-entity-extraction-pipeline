import { buildAuthHeaders } from "@/lib/auth-headers";
import type { ChatApiResponse, ChatMessage } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export class ChatApiError extends Error {
  readonly statusCode: number;
  readonly retryAfterSeconds?: number;

  constructor(
    message: string,
    statusCode = 500,
    retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ChatApiError";
    this.statusCode = statusCode;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

function parseErrorDetail(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }
  const detail = (body as { detail?: unknown }).detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as { msg?: string };
    return first.msg;
  }
  return undefined;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  conversationId?: string | null,
): Promise<ChatApiResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: await buildAuthHeaders(),
    body: JSON.stringify({
      messages,
      conversation_id: conversationId ?? undefined,
    }),
  });

  if (!response.ok) {
    let detail = "Failed to reach the chat service.";
    try {
      const errorBody: unknown = await response.json();
      detail = parseErrorDetail(errorBody) ?? detail;
    } catch {
      // use default message
    }

    if (response.status === 429) {
      const retryHeader = response.headers.get("Retry-After");
      const retryAfterSeconds = retryHeader
        ? Number.parseInt(retryHeader, 10)
        : undefined;
      throw new ChatApiError(detail, 429, retryAfterSeconds);
    }

    throw new ChatApiError(detail, response.status);
  }

  return response.json() as Promise<ChatApiResponse>;
}
