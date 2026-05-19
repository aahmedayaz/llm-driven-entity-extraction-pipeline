"use client";

import { useCallback, useState } from "react";

import { sendChatMessage, ChatApiError } from "@/lib/api";
import { INITIAL_ASSISTANT_GREETING } from "@/lib/constants";
import type { ChatApiResponse, ChatMessage, PropertyData } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isComplete: boolean;
  propertyData: PropertyData | null;
  error: string | null;
  retryAfterSeconds: number | null;
}

function createInitialState(): ChatState {
  return {
    messages: [{ role: "assistant", content: INITIAL_ASSISTANT_GREETING }],
    isLoading: false,
    isComplete: false,
    propertyData: null,
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
    error: null,
    retryAfterSeconds: null,
  };
}

export function useChat() {
  const [state, setState] = useState<ChatState>(createInitialState);

  const hasConversation = state.messages.some((message) => message.role === "user");

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
        const response = await sendChatMessage(nextMessages);
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
    [state.isComplete, state.isLoading, state.messages],
  );

  const retry = useCallback(() => {
    setState(createInitialState());
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    isComplete: state.isComplete,
    propertyData: state.propertyData,
    error: state.error,
    retryAfterSeconds: state.retryAfterSeconds,
    hasConversation,
    sendMessage,
    retry,
  };
}
