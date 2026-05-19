"use client";

import { Bot, Building2, Home, Layers, Sparkles } from "lucide-react";

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
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-6 pt-16 sm:px-6 sm:py-6">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="mb-5 text-center sm:mb-7">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
            <AnthropicMarkIcon className="h-8 w-8 shrink-0 text-[var(--accent-coral)] sm:h-10 sm:w-10" />
            <h1 className="greeting-heading max-w-xs text-3xl text-[var(--text-primary)] sm:max-w-none sm:text-4xl md:text-[2.75rem]">
              {greeting}
            </h1>
          </div>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[var(--text-secondary)] sm:max-w-none sm:text-base">
            Your AI property survey assistant is ready to collect the details.
          </p>
        </div>

        <div className="surface-elevated flex min-h-[500px] flex-col overflow-hidden rounded-3xl shadow-[var(--shadow-card)] sm:min-h-[500px]">
          <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6f8f4e]/20 text-[#9fca72] ring-1 ring-[#9fca72]/25">
                <Bot className="h-5 w-5" aria-hidden />
              </div>

              <section
                aria-label="First property question"
                className="w-full rounded-3xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[var(--text-primary)] shadow-sm sm:max-w-[34rem] sm:px-5"
              >
                <p className="text-sm leading-relaxed sm:text-base">
                  {INITIAL_ASSISTANT_GREETING}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {QUICK_PROMPTS.map((prompt, index) => {
                    const Icon = PROMPT_ICONS[index] ?? Home;
                    return (
                      <button
                        key={prompt.label}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSend(prompt.message)}
                        className={cn(
                          "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-2 text-[11px] font-medium transition sm:gap-2 sm:px-3.5 sm:text-sm",
                          "border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)]",
                          "hover:border-[var(--accent-coral)]/50 hover:text-[var(--text-primary)] disabled:opacity-50",
                          index === QUICK_PROMPTS.length - 1 && "col-span-2 sm:col-span-1",
                        )}
                      >
                        <Icon className="h-3 w-3 shrink-0 opacity-70 sm:h-3.5 sm:w-3.5" aria-hidden />
                        {prompt.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] bg-[rgba(0,0,0,0.12)] p-4 sm:p-5">
            <ChatInput
              variant="hero"
              onSend={onSend}
              disabled={disabled}
              placeholder="Type your answer..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
