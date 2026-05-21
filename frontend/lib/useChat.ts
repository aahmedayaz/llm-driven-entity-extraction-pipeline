"use client";

import { useCallback, useState } from "react";

import { sendChatMessage, ChatApiError } from "@/lib/api";
import { createConversation } from "@/lib/conversations-api";
import { INITIAL_ASSISTANT_GREETING } from "@/lib/constants";
import type { ChatApiResponse, ChatMessage, PropertyData } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isComplete: boolean;
  propertyData: PropertyData | null;
  partialData: PropertyData | null;
  error: string | null;
  retryAfterSeconds: number | null;
}

function createInitialState(): ChatState {
  return {
    messages: [{ role: "assistant", content: INITIAL_ASSISTANT_GREETING }],
    isLoading: false,
    isComplete: false,
    propertyData: null,
    partialData: null,
    error: null,
    retryAfterSeconds: null,
  };
}

function buildStateFromResponse(
  messages: ChatMessage[],
  response: ChatApiResponse,
): ChatState {
  const assistantMessage: ChatMessage = {
    role: "assistant",
    content: response.reply,
  };

  return {
    messages: [...messages, assistantMessage],
    isLoading: false,
    isComplete: response.complete,
    propertyData: response.complete ? (response.data ?? null) : null,
    partialData: response.data ?? null,
    error: null,
    retryAfterSeconds: null,
  };
}

interface UseChatOptions {
  persist?: boolean;
}

export function useChat(options: UseChatOptions = {}) {
  const [state, setState] = useState<ChatState>(createInitialState);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const hasConversation = state.messages.some((message) => message.role === "user");

  const enablePersistence = useCallback(async () => {
    if (!options.persist || conversationId) {
      return;
    }
    try {
      const id = await createConversation();
      setConversationId(id);
    } catch {
      // User not signed in — guest mode only
    }
  }, [options.persist, conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (state.isComplete || state.isLoading) {
        return;
      }

      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      const userMessage: ChatMessage = { role: "user", content: trimmed };
      const nextMessages = [...state.messages, userMessage];

      setState((prev) => ({
        ...prev,
        messages: nextMessages,
        isLoading: true,
        error: null,
        retryAfterSeconds: null,
      }));

      try {
        const response = await sendChatMessage(nextMessages, conversationId);
        setState(buildStateFromResponse(nextMessages, response));
      } catch (error) {
        const message =
          error instanceof ChatApiError
            ? error.message
            : "Something went wrong. Please try again.";
        const retryAfterSeconds =
          error instanceof ChatApiError ? error.retryAfterSeconds ?? null : null;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
          retryAfterSeconds,
        }));
      }
    },
    [state.isComplete, state.isLoading, state.messages, conversationId],
  );

  const retry = useCallback(() => {
    setState(createInitialState());
    setConversationId(null);
  }, []);

  const dossierData: PropertyData =
    state.propertyData ??
    state.partialData ?? {
      propertyType: undefined,
      annualElectricityBill: undefined,
      occupants: undefined,
      heatingSystem: undefined,
      interest: undefined,
    };

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isComplete: state.isComplete,
    propertyData: state.propertyData,
    dossierData,
    error: state.error,
    retryAfterSeconds: state.retryAfterSeconds,
    hasConversation,
    sendMessage,
    retry,
    conversationId,
    enablePersistence,
  };
}
