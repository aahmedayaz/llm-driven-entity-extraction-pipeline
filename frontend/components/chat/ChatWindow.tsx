"use client";

import { useEffect, useRef, useState } from "react";

import { AnthropicMarkIcon } from "@/components/chat/AnthropicMarkIcon";
import { ChatInput } from "@/components/chat/ChatInput";
import { JsonCelebrationModal } from "@/components/chat/JsonCelebrationModal";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { getTeamGreeting } from "@/lib/greeting";
import { useChat } from "@/lib/useChat";

export function ChatWindow() {
  const {
    messages,
    isLoading,
    isComplete,
    propertyData,
    error,
    retryAfterSeconds,
    hasConversation,
    sendMessage,
    retry,
  } = useChat();

  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  useEffect(() => {
    if (isComplete && propertyData) {
      setShowJsonModal(true);
    }
  }, [isComplete, propertyData]);

  useEffect(() => {
    if (!hasConversation) {
      return;
    }
    const container = messagesScrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, propertyData, error, hasConversation]);

  if (!hasConversation) {
    return (
      <>
        {propertyData && (
          <JsonCelebrationModal
            data={propertyData}
            open={showJsonModal}
            onClose={() => setShowJsonModal(false)}
          />
        )}
        <WelcomeScreen
          onSend={(text) => void sendMessage(text)}
          disabled={isLoading}
        />
        {error && (
          <p className="px-4 pb-4 text-center text-sm text-red-400">{error}</p>
        )}
      </>
    );
  }

  return (
    <>
      {propertyData && (
        <JsonCelebrationModal
          data={propertyData}
          open={showJsonModal}
          onClose={() => setShowJsonModal(false)}
        />
      )}

      <section className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
        <header className="mb-4 shrink-0 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-3">
            <AnthropicMarkIcon className="h-7 w-7 shrink-0 text-[var(--accent-coral)] sm:h-8 sm:w-8" />
            <p className="greeting-heading text-xl text-[var(--text-primary)] sm:text-2xl">
              {getTeamGreeting()}
            </p>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Property survey in progress
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div
            ref={messagesScrollRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-6"
          >
            {messages.map((message, index) => (
              <MessageBubble
                key={`${message.role}-${index}`}
                role={message.role}
                content={message.content}
              />
            ))}

            {isLoading && <TypingIndicator />}

            {error && (
              <div className="animate-fade-in rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <p>{error}</p>
                {retryAfterSeconds != null && retryAfterSeconds > 0 && (
                  <p className="mt-1 text-xs text-red-300/80">
                    You can retry in about {retryAfterSeconds} seconds.
                  </p>
                )}
                <button
                  type="button"
                  onClick={retry}
                  className="mt-2 font-medium underline underline-offset-2"
                >
                  Start over
                </button>
              </div>
            )}

            {isComplete && propertyData && !showJsonModal && (
              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="w-full animate-fade-in rounded-xl border border-dashed border-[var(--accent-coral)]/50 bg-[var(--accent-coral-soft)] py-3 text-sm font-semibold text-[var(--accent-coral)] transition hover:bg-[var(--accent-coral)]/20"
              >
                View your JSON results
              </button>
            )}
          </div>

          <div className="shrink-0 border-t border-[var(--border-subtle)] p-3 sm:p-4">
            <ChatInput
              onSend={(text) => void sendMessage(text)}
              disabled={isLoading || isComplete}
              placeholder={
                isComplete ? "Conversation complete" : "Type your answer..."
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
