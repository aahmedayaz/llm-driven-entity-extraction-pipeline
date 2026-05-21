"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnthropicMarkIcon } from "@/components/chat/AnthropicMarkIcon";
import { CornerAssistantIcon } from "@/components/chat/ChatWindow";
import { AuthPanel } from "@/components/v2/AuthPanel";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/survey", label: "Survey" },
  { href: "/property", label: "Property insights" },
  { href: "/history", label: "History" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <header className="shrink-0 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <AnthropicMarkIcon className="h-7 w-7 text-[var(--accent-coral)]" />
            <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)] sm:text-base">
              Ralico Property AI
            </span>
            <span className="rounded-full bg-[#6f8f4e]/20 px-2 py-0.5 text-[10px] font-medium uppercase text-[#9fca72]">
              v2
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition",
                  pathname === item.href
                    ? "bg-[#6f8f4e]/20 text-[#9fca72]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <AuthPanel />
        </div>
        <nav className="mx-auto mt-2 flex max-w-6xl gap-1 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-center text-xs",
                pathname === item.href
                  ? "bg-[#6f8f4e]/20 text-[#9fca72]"
                  : "text-[var(--text-secondary)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="relative flex min-h-0 flex-1 flex-col">{children}</main>
      <CornerAssistantIcon />
    </div>
  );
}
