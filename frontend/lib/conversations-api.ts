import { buildAuthHeaders } from "@/lib/auth-headers";
import type { ChatMessage, PropertyData } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export interface ConversationSummary {
  id: string;
  status: string;
  extracted_data?: PropertyData | null;
  created_at?: string;
  updated_at?: string;
}

export async function createConversation(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    method: "POST",
    headers: await buildAuthHeaders(),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      (body as { detail?: string }).detail ?? "Could not create conversation",
    );
  }
  const data = (await response.json()) as { id: string };
  return data.id;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const response = await fetch(`${API_BASE_URL}/conversations`, {
    headers: await buildAuthHeaders(),
  });
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<ConversationSummary[]>;
}

export async function getConversation(id: string): Promise<{
  id: string;
  status: string;
  extracted_data?: PropertyData | null;
  messages: ChatMessage[];
}> {
  const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
    headers: await buildAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Conversation not found");
  }
  return response.json() as Promise<{
    id: string;
    status: string;
    extracted_data?: PropertyData | null;
    messages: ChatMessage[];
  }>;
}
