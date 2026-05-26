"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AnthropicMarkIcon } from "@/components/chat/AnthropicMarkIcon";
import { CornerAssistantIcon } from "@/components/v2/CornerAssistantIcon";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", short: "Home" },
  { href: "/survey", label: "AI Property Assessment", short: "AI Assessment" },
  { href: "/property", label: "EPC & Solar Assessment", short: "EPC & Solar" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-base)]">
      <header className="relative z-50 shrink-0 overflow-visible border-b border-[var(--border-subtle)]">
        <div className="page-x mx-auto max-w-7xl overflow-visible py-5 sm:py-4">
          <div className="flex min-h-[3.5rem] items-center justify-between gap-2 overflow-visible sm:min-h-[3.25rem] sm:gap-4">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 sm:gap-2.5"
            >
              <AnthropicMarkIcon className="h-7 w-7 shrink-0 text-[var(--accent-coral)] sm:h-8 sm:w-8" />
              <span className="truncate text-sm font-semibold leading-tight tracking-wide text-[var(--text-primary)] sm:text-base">
                <span className="sm:hidden">Ralico AI</span>
                <span className="hidden sm:inline">Ralico Property AI</span>
              </span>
              <span className="hidden shrink-0 rounded-full bg-[#6f8f4e]/20 px-2 py-0.5 text-[10px] font-medium uppercase text-[#9fca72] xs:inline">
                v2
              </span>
            </Link>

            <nav className="hidden items-center gap-4 lg:flex xl:gap-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-2 py-1.5 text-xs transition lg:text-[0.8125rem]",
                    pathname === item.href
                      ? "bg-[#6f8f4e]/20 text-[#9fca72]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 overflow-visible sm:gap-3">
              <CornerAssistantIcon />
            </div>
          </div>

          <nav className="mt-3.5 flex gap-2.5 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-lg px-1 py-2.5 text-center text-[0.6875rem] font-medium xs:text-xs",
                  pathname === item.href
                    ? "bg-[#6f8f4e]/20 text-[#9fca72]"
                    : "text-[var(--text-secondary)]",
                )}
              >
                {item.short}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-0 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[var(--mobile-page-bottom)]">
        {children}
      </main>
    </div>
  );
}
