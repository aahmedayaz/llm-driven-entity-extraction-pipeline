"use client";

import Link from "next/link";
import { History } from "lucide-react";

export function HistoryPanel() {
  return (
    <div className="page-x mx-auto max-w-lg py-16 text-center">
      <History className="mx-auto h-10 w-10 text-[#9fca72]" />
      <h1 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
        History
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
        Saved surveys and reports will appear here in a future update. For now,
        use the assessment tools — your session data stays on this device.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/survey"
          className="inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-2xl bg-[#6f8f4e] px-6 py-2.5 text-sm font-medium text-white shadow-lg transition hover:brightness-110 active:scale-[0.98] sm:min-w-[12rem]"
        >
          Property assessment
        </Link>
        <Link
          href="/property"
          className="inline-flex min-h-[44px] touch-manipulation items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[#9fca72]/40 active:scale-[0.98] sm:min-w-[12rem]"
        >
          EPC & solar
        </Link>
      </div>
    </div>
  );
}
