"use client";

import { Bot } from "lucide-react";

import { cn } from "@/lib/utils";

interface JourneyOrbProps {
  /** When true (default), rings and core pulse continuously. */
  active?: boolean;
  listening?: boolean;
  className?: string;
}

const RING_COUNT = 3;

export function JourneyOrb({
  active = true,
  listening,
  className,
}: JourneyOrbProps) {
  const pulse = active || listening;

  return (
    <div
      className={cn(
        "relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28",
        className,
      )}
      aria-hidden={!pulse}
    >
      {pulse &&
        Array.from({ length: RING_COUNT }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "absolute inset-2 rounded-full border border-[#9fca72]/50 sm:inset-0 sm:border-2",
              "journey-orb-ring",
              index === 0 && "journey-orb-ring-1",
              index === 1 && "journey-orb-ring-2",
              index === 2 && "journey-orb-ring-3",
            )}
          />
        ))}

      <div
        className={cn(
          "relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6f8f4e] to-[#4a6b35] text-white shadow-lg ring-2 ring-[#9fca72]/30 sm:h-[4.5rem] sm:w-[4.5rem]",
          pulse && "journey-orb-core",
          listening && pulse && "journey-orb-core-listening",
        )}
      >
        <Bot className="h-8 w-8 sm:h-9 sm:w-9" />
      </div>
    </div>
  );
}
