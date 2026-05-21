"use client";

import { Loader2, Mic, MicOff, Send } from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

const TEXTAREA_MAX_HEIGHT_PX = 128;

interface VoiceChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
}

export function VoiceChatInput({
  onSend,
  disabled = false,
  sending = false,
  placeholder = "Type or tap mic to speak…",
}: VoiceChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const onSendRef = useRef(onSend);
  const isBusyRef = useRef(disabled || sending);

  onSendRef.current = onSend;
  isBusyRef.current = disabled || sending;

  const isBusy = disabled || sending;
  const canSend = value.trim().length > 0 && !isBusy;

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY =
      el.scrollHeight > TEXTAREA_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  const { isListening, isSupported, interim, toggle } = useSpeechRecognition(
    (text) => {
      setValue(text);
      if (!isBusyRef.current) {
        onSendRef.current(text);
        setValue("");
      }
    },
  );

  const submitMessage = useCallback(() => {
    const el = textareaRef.current;
    const trimmed = (el?.value ?? value).trim();
    if (!trimmed || isBusyRef.current) {
      return false;
    }
    onSendRef.current(trimmed);
    setValue("");
    if (el) {
      el.style.height = "auto";
    }
    requestAnimationFrame(resizeTextarea);
    return true;
  }, [value, resizeTextarea]);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    submitMessage();
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (event.shiftKey) {
      return;
    }
    if (event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    submitMessage();
  };

  return (
    <div className="space-y-2">
      {isListening && (
        <p className="animate-pulse text-center text-xs text-[#9fca72]">
          Listening… {interim && `"${interim}"`}
        </p>
      )}
      {sending && (
        <p className="text-center text-xs text-[var(--text-secondary)]">
          Processing your answer…
        </p>
      )}
      <form
        onSubmit={handleFormSubmit}
        className="surface-input flex items-end gap-2 rounded-2xl py-2 pl-3 pr-2 focus-within:border-[#9fca72]/40"
      >
        {isSupported && (
          <button
            type="button"
            onClick={toggle}
            disabled={isBusy}
            className={cn(
              "mb-0.5 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl transition active:scale-95",
              isListening
                ? "bg-[#9fca72] text-[#141413]"
                : "bg-[#6f8f4e]/20 text-[#9fca72] hover:bg-[#6f8f4e]/35",
              "disabled:opacity-40",
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleEnterKey}
          disabled={isBusy}
          placeholder={placeholder}
          enterKeyHint="send"
          aria-label="Message"
          className="scrollbar-none min-h-[44px] max-h-32 flex-1 resize-none overflow-y-hidden bg-transparent py-2.5 pl-3 pr-2 text-sm leading-relaxed text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="mb-0.5 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-xl bg-[var(--accent-coral)] text-white transition hover:brightness-110 active:scale-95 disabled:opacity-40"
          aria-label="Send message"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
        </button>
      </form>
    </div>
  );
}
