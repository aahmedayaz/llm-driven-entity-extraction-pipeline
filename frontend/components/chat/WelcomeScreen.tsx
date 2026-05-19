"use client";

import { Building2, Home, Layers, Sparkles } from "lucide-react";

import { AnthropicMarkIcon } from "@/components/chat/AnthropicMarkIcon";
import { ChatInput } from "@/components/chat/ChatInput";
import { INITIAL_ASSISTANT_GREETING, QUICK_PROMPTS } from "@/lib/constants";
import { getTeamGreeting } from "@/lib/greeting";
import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const PROMPT_ICONS = [Home, Building2, Layers, Building2, Sparkles] as const;

export function WelcomeScreen({ onSend, disabled = false }: WelcomeScreenProps) {
  const greeting = getTeamGreeting();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-8 flex items-center justify-center gap-4 sm:mb-10 sm:gap-5">
          <AnthropicMarkIcon className="h-9 w-9 shrink-0 text-[var(--accent-coral)] sm:h-10 sm:w-10" />
          <h1 className="greeting-heading text-center text-3xl text-[var(--text-primary)] sm:text-4xl md:text-[2.75rem]">
            {greeting}
          </h1>
        </div>

        <div className="surface-elevated mb-6 rounded-2xl rounded-bl-md px-5 py-4 sm:mb-8">
          <p className="text-sm leading-relaxed text-[var(--text-primary)] sm:text-base">
            {INITIAL_ASSISTANT_GREETING}
          </p>
        </div>

        <ChatInput
          variant="hero"
          onSend={onSend}
          disabled={disabled}
          placeholder="e.g. detached, semi-detached, terraced, or flat"
        />

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:mt-6">
          {QUICK_PROMPTS.map((prompt, index) => {
            const Icon = PROMPT_ICONS[index] ?? Home;
            return (
              <button
                key={prompt.label}
                type="button"
                disabled={disabled}
                onClick={() => onSend(prompt.message)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                  "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]",
                  "hover:border-white/20 hover:text-[var(--text-primary)] disabled:opacity-50",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                {prompt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
