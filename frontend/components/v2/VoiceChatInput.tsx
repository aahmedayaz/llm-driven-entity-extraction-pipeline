"use client";

import { Mic, MicOff, Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface VoiceChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function VoiceChatInput({
  onSend,
  disabled = false,
  placeholder = "Type or tap mic to speak…",
}: VoiceChatInputProps) {
  const [value, setValue] = useState("");

  const { isListening, isSupported, interim, toggle } = useSpeechRecognition(
    (text) => {
      setValue(text);
      if (!disabled) {
        onSend(text);
        setValue("");
      }
    },
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="space-y-2">
      {isListening && (
        <p className="text-center text-xs text-[#9fca72] animate-pulse">
          Listening… {interim && `"${interim}"`}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className="surface-input flex items-end gap-2 rounded-2xl p-2 focus-within:border-[#9fca72]/40"
      >
        {isSupported && (
          <button
            type="button"
            onClick={toggle}
            disabled={disabled}
            className={cn(
              "mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition",
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
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-sm text-[var(--text-primary)] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-coral)] text-white transition hover:brightness-110 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
