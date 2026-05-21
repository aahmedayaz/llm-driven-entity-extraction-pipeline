"use client";

import { useCallback, useEffect, useState } from "react";

import { JsonCelebrationModal } from "@/components/chat/JsonCelebrationModal";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { VoiceChatInput } from "@/components/v2/VoiceChatInput";
import { JourneyOrb } from "@/components/v2/JourneyOrb";
import { INITIAL_ASSISTANT_GREETING } from "@/lib/constants";
import { useChat } from "@/lib/useChat";

export function SurveyExperience() {
  const toast = useToast();
  const {
    messages,
    isLoading,
    isComplete,
    propertyData,
    error,
    hasConversation,
    sendMessage,
    retry,
  } = useChat();

  const [showJsonModal, setShowJsonModal] = useState(false);

  useEffect(() => {
    if (isComplete && propertyData) {
      setShowJsonModal(true);
      toast.success("Property assessment complete!");
    }
  }, [propertyData, isComplete, toast]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  const onSend = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage],
  );

  return (
    <>
      <div className="page-x mx-auto flex h-full w-full max-w-3xl flex-1 flex-col gap-4 py-4 lg:py-6">
        <div className="flex min-h-0 flex-1 flex-col">
          {!hasConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <JourneyOrb active className="mb-6" />
              <p className="max-w-md text-sm leading-relaxed text-[var(--text-primary)] sm:text-base">
                {INITIAL_ASSISTANT_GREETING}
              </p>
              <div className="mt-6 w-full max-w-lg">
                <VoiceChatInput onSend={onSend} sending={isLoading} />
              </div>
            </div>
          ) : (
            <div className="surface-elevated flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                {messages.map((m, i) => (
                  <MessageBubble
                    key={`${m.role}-${i}`}
                    role={m.role}
                    content={m.content}
                  />
                ))}
                {isLoading && <TypingIndicator />}
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <p>{error}</p>
                    <Button
                      variant="ghost"
                      className="mt-2 h-auto min-h-0 p-0 text-red-300"
                      onClick={retry}
                    >
                      Start over
                    </Button>
                  </div>
                )}
              </div>
              <div className="shrink-0 border-t border-[var(--border-subtle)] p-3 sm:p-4">
                <VoiceChatInput
                  onSend={onSend}
                  disabled={isLoading || isComplete}
                  sending={isLoading}
                  placeholder={
                    isComplete ? "Survey complete" : "Type or speak your answer…"
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {propertyData && (
        <JsonCelebrationModal
          data={propertyData}
          open={showJsonModal}
          onClose={() => setShowJsonModal(false)}
        />
      )}
    </>
  );
}
