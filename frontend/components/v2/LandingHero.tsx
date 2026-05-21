"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Mic } from "lucide-react";

import { JourneyOrb } from "@/components/v2/JourneyOrb";
import { RobotPeekingGuide } from "@/components/v2/RobotPeekingGuide";
import { cn } from "@/lib/utils";

const LANDING_BTN =
  "box-border inline-flex h-12 min-h-12 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 text-[0.75rem] font-semibold leading-none transition active:scale-[0.98] xs:px-5 xs:text-xs sm:flex-1 sm:text-sm";

export function LandingHero() {
  return (
    <>
      <RobotPeekingGuide message="Tip: answer several details in one message on the assessment — your dossier fills automatically." />
      <div className="page-x mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-start py-8 text-center sm:justify-center sm:py-14">
      <JourneyOrb active className="mb-6 shrink-0 sm:mb-8" />

      <h1 className="max-w-[20rem] font-sans text-[1.35rem] font-semibold leading-tight tracking-tight text-[var(--text-primary)] xs:max-w-md xs:text-2xl sm:max-w-2xl sm:text-3xl md:text-4xl">
        Instant <span className="text-[#9fca72]">AI solar scan</span> for your
        home
      </h1>

      <p className="mt-4 max-w-[19rem] text-[0.6875rem] leading-relaxed text-[var(--text-secondary)] xs:max-w-md xs:text-xs sm:max-w-lg sm:text-sm">
        Answer five quick questions by voice or keyboard. Add your UK postcode
        to pull real EPC data and estimated solar savings. No account needed.
      </p>

      <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:max-w-2xl sm:flex-row sm:items-stretch">
        <Link
          href="/survey"
          className={cn(
            LANDING_BTN,
            "whitespace-nowrap border-[#6f8f4e] bg-[#6f8f4e] text-white shadow-lg hover:brightness-110",
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Mic className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">Start AI Property Assessment</span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-white/90"
            aria-hidden
          />
        </Link>
        <Link
          href="/property"
          className={cn(
            LANDING_BTN,
            "whitespace-nowrap border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[#9fca72]/40",
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0 text-[#9fca72]" aria-hidden />
            <span className="truncate">Start EPC and Solar Assessment</span>
          </span>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-[var(--text-secondary)]"
            aria-hidden
          />
        </Link>
      </div>

      <p className="mt-6 px-2 text-[0.6875rem] leading-relaxed text-[var(--text-muted)] xs:text-xs">
        Private · No login required · Smart extraction (low AI usage)
      </p>
    </div>
    </>
  );
}
