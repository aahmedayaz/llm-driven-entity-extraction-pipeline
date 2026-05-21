"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { JsonCelebrationModal } from "@/components/chat/JsonCelebrationModal";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { PropertyDossier } from "@/components/v2/PropertyDossier";
import { RobotPeekingGuide } from "@/components/v2/RobotPeekingGuide";
import { VoiceChatInput } from "@/components/v2/VoiceChatInput";
import { JourneyOrb } from "@/components/v2/JourneyOrb";
import { INITIAL_ASSISTANT_GREETING } from "@/lib/constants";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useChat } from "@/lib/useChat";

export function SurveyExperience() {
  const {
    messages,
    isLoading,
    isComplete,
    propertyData,
    dossierData,
    error,
    hasConversation,
    sendMessage,
    retry,
    enablePersistence,
  } = useChat({ persist: true });

  const [showJsonModal, setShowJsonModal] = useState(false);

  useEffect(() => {
    if (isComplete && propertyData) {
      setShowJsonModal(true);
    }
  }, [propertyData, isComplete]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }
    const tryPersist = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await enablePersistence();
      }
    };
    void tryPersist();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        void enablePersistence();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [enablePersistence]);

  const onSend = useCallback(
    (text: string) => {
      void sendMessage(text);
    },
    [sendMessage],
  );

  return (
    <>
      <RobotPeekingGuide message="Tip: you can answer several details in one message — I'll fill your dossier automatically." />

      <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:py-6">
        <div className="flex min-h-0 flex-1 flex-col">
          {!hasConversation ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <JourneyOrb active className="mb-6" />
              <p className="max-w-md text-sm leading-relaxed text-[var(--text-primary)] sm:text-base">
                {INITIAL_ASSISTANT_GREETING}
              </p>
              <div className="mt-6 w-full max-w-lg">
                <VoiceChatInput onSend={onSend} disabled={isLoading} />
              </div>
            </div>
          ) : (
            <div className="surface-elevated flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                {messages.map((m, i) => (
                  <MessageBubble key={`${m.role}-${i}`} role={m.role} content={m.content} />
                ))}
                {isLoading && <TypingIndicator />}
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    <p>{error}</p>
                    <button type="button" onClick={retry} className="mt-2 underline">
                      Start over
                    </button>
                  </div>
                )}
              </div>
              <div className="shrink-0 border-t border-[var(--border-subtle)] p-3 sm:p-4">
                <VoiceChatInput
                  onSend={onSend}
                  disabled={isLoading || isComplete}
                  placeholder={isComplete ? "Survey complete" : "Type or speak your answer…"}
                />
              </div>
            </div>
          )}
        </div>

        <PropertyDossier data={dossierData} className="w-full shrink-0 lg:w-80" />
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
