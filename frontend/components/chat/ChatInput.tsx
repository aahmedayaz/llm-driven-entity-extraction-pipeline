"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  variant?: "default" | "hero";
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  variant = "default",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const isHero = variant === "hero";

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
    <form
      onSubmit={handleSubmit}
      className={cn(
        "surface-input flex items-end gap-2 transition focus-within:border-white/20",
        isHero ? "rounded-2xl p-3 shadow-lg" : "rounded-2xl p-2",
      )}
    >
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        id="chat-input"
        rows={isHero ? 2 : 1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "flex-1 resize-none bg-transparent text-[var(--text-primary)] focus:outline-none disabled:opacity-50",
          "placeholder:text-[var(--text-muted)]",
          isHero ? "min-h-[52px] py-2 text-base" : "max-h-32 min-h-[44px] py-2.5 text-sm",
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl transition",
          "bg-[var(--accent-coral)] text-white hover:brightness-110",
          "disabled:cursor-not-allowed disabled:opacity-40",
          isHero ? "mb-1 h-10 w-10" : "h-11 w-11",
        )}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
