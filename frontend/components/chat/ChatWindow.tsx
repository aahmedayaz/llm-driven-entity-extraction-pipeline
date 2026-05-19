"use client";

import { Github, Linkedin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AnthropicMarkIcon } from "@/components/chat/AnthropicMarkIcon";
import { ChatInput } from "@/components/chat/ChatInput";
import { JsonCelebrationModal } from "@/components/chat/JsonCelebrationModal";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { getTeamGreeting } from "@/lib/greeting";
import { useChat } from "@/lib/useChat";
import { cn } from "@/lib/utils";

function CornerAssistantIcon() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openCard = () => {
    clearCloseTimeout();
    setIsCardOpen(true);
  };

  const closeCardAfterDelay = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsCardOpen(false);
      closeTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => clearCloseTimeout, []);

  return (
    <div
      className="group fixed right-4 top-4 z-20 cursor-pointer sm:right-6 sm:top-6"
      aria-label="About Ayaz"
      onMouseEnter={openCard}
      onMouseLeave={closeCardAfterDelay}
      onFocus={openCard}
      onBlur={closeCardAfterDelay}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9fca72]/25 bg-[#6f8f4e]/15 text-[#9fca72] shadow-lg backdrop-blur transition hover:border-[#9fca72]/50 hover:bg-[#6f8f4e]/25"
        aria-hidden
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="corner-assistant-icon shrink-0"
        >
          <g className="assistant-icon-eyes">
            <path d="M6.99951 8.66672C7.5518 8.66672 7.99951 9.11443 7.99951 9.66672C7.9993 10.2188 7.55166 10.6667 6.99951 10.6667C6.44736 10.6667 5.99973 10.2188 5.99951 9.66672C5.99951 9.11443 6.44723 8.66672 6.99951 8.66672Z" />
            <path d="M12.9995 8.66672C13.5518 8.66672 13.9995 9.11443 13.9995 9.66672C13.9993 10.2188 13.5517 10.6667 12.9995 10.6667C12.4474 10.6667 11.9997 10.2188 11.9995 9.66672C11.9995 9.11443 12.4472 8.66672 12.9995 8.66672Z" />
          </g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10 2C14.326 2.00018 17.9998 5.67403 18 10V17.3123C17.9997 17.5427 17.8411 17.8079 17.6172 17.8623C17.3932 17.9165 17.1614 17.7456 17.0557 17.5408C16.7805 17.007 16.3658 16.5937 16.062 16.2878C15.7793 16.0034 15.4503 15.8338 14.9771 15.8337C14.2092 15.8339 13.4371 16.3862 12.9487 17.53C12.8701 17.7138 12.6887 17.8621 12.4888 17.8623C12.2888 17.8623 12.1076 17.7138 12.0288 17.53C11.5404 16.386 10.7674 15.8339 9.99951 15.8337C9.23161 15.8339 8.45959 16.386 7.97119 17.53C7.89253 17.7138 7.71118 17.8621 7.51123 17.8623C7.31122 17.8623 7.13006 17.7138 7.05127 17.53C6.56296 16.3862 5.78982 15.834 5.02197 15.8337C4.54861 15.8338 4.21974 16.0032 3.93701 16.2878C3.63309 16.5937 3.21952 17.0715 2.94434 17.6055C2.83865 17.8103 2.60589 17.9165 2.38184 17.8623C2.15801 17.8079 2.00033 17.6073 2 17.377V10C2.00018 5.67403 5.67403 2.00018 10 2ZM10 3C6.22631 3.00018 3.00018 6.22631 3 10V15.8633C3.0205 15.8414 3.20696 15.6049 3.22803 15.5837C3.67524 15.1336 4.251 14.8338 5.02197 14.8337C6.03838 14.8341 6.90232 15.4025 7.51025 16.2937C8.11828 15.4018 8.9824 14.8338 9.99951 14.8337C11.0163 14.8338 11.8798 15.4022 12.4878 16.2937C13.0959 15.4018 13.9601 14.8339 14.9771 14.8337C15.7481 14.8338 16.3247 15.1336 16.772 15.5837C16.772 15.5837 16.9796 15.812 17 15.8337V10C16.9998 6.22631 13.7737 3.00018 10 3Z"
          />
          <style>{`
            .group:hover .assistant-icon-eyes {
              animation: look-around 2.4s ease-in-out infinite;
            }

            .group:active .assistant-icon-eyes {
              animation: none;
            }

            @keyframes look-around {
              0%, 16.6%, 100% {
                transform: translateX(-1.5px) translateY(0);
              }
              25%, 41.6% {
                transform: translateX(1.5px) translateY(0);
              }
              50%, 66.6% {
                transform: translateX(0) translateY(-1.5px);
              }
              75%, 91.6% {
                transform: translateX(0) translateY(0);
              }
            }
          `}</style>
        </svg>
      </div>

      <div
        className={cn(
          "absolute right-0 top-12 w-64 rounded-2xl border border-[#9fca72]/20 bg-[rgba(20,20,19,0.72)] p-4 text-[var(--text-primary)] shadow-[var(--shadow-card)] backdrop-blur-xl transition duration-200",
          isCardOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <p className="text-sm font-semibold">Ahmed Ayaz</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
          Full-stack developer building AI-powered web experiences.
        </p>

        <div className="mt-4 space-y-2">
          <a
            href="https://github.com/aahmedayaz"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-[#9fca72]/30 hover:text-[var(--text-primary)]"
          >
            <Github className="h-4 w-4 text-[#9fca72]" aria-hidden />
            github.com/aahmedayaz
          </a>
          <a
            href="https://www.linkedin.com/in/aahmedayaz"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--text-secondary)] transition hover:border-[#9fca72]/30 hover:text-[var(--text-primary)]"
          >
            <Linkedin className="h-4 w-4 text-[#9fca72]" aria-hidden />
            linkedin.com/in/aahmedayaz
          </a>
        </div>
      </div>
    </div>
  );
}

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
        <CornerAssistantIcon />
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
      <CornerAssistantIcon />
      {propertyData && (
        <JsonCelebrationModal
          data={propertyData}
          open={showJsonModal}
          onClose={() => setShowJsonModal(false)}
        />
      )}

      <section className="mx-auto flex h-full w-full max-w-3xl min-h-0 flex-1 flex-col px-4 pb-4 pt-16 sm:px-6 sm:py-4">
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
