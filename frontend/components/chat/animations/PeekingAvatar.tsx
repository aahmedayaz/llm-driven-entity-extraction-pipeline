"use client";

import { cn } from "@/lib/utils";

interface PeekingAvatarProps {
  className?: string;
}

/** Playful mascot peeking from behind the modal corner */
export function PeekingAvatar({ className }: PeekingAvatarProps) {
  return (
    <div
      className={cn("animate-avatar-peek pointer-events-none select-none", className)}
      aria-hidden
    >
      <svg
        viewBox="0 0 160 200"
        className="h-full w-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="80" cy="175" rx="55" ry="18" fill="#0f172a" opacity="0.15" />
        <path
          d="M40 95c0-28 18-52 40-52s40 24 40 52v55H40V95z"
          fill="#2563eb"
        />
        <path
          d="M55 48c0-18 12-32 25-32s25 14 25 32v12H55V48z"
          fill="#facc15"
        />
        <rect x="52" y="38" width="56" height="14" rx="4" fill="#fde047" />
        <circle cx="68" cy="78" r="5" fill="#0f172a" />
        <circle cx="92" cy="78" r="5" fill="#0f172a" />
        <path
          d="M62 92c6 8 30 8 36 0"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M48 110h64v40H48z"
          fill="#fff"
          stroke="#0f172a"
          strokeWidth="2"
        />
        <path d="M56 118h48v4H56zM56 128h36v3H56zM56 136h42v3H56z" fill="#94a3b8" />
        <path
          d="M115 125l28 12-8 18-20-8"
          fill="#facc15"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="138" cy="118" r="10" fill="#22c55e" stroke="#0f172a" strokeWidth="2" />
        <path
          d="M133 118l4 4 8-8"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
