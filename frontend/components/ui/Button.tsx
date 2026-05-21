"use client";

import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[#6f8f4e] text-white shadow-lg hover:brightness-110 disabled:hover:brightness-100",
  secondary:
    "border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:border-[#9fca72]/40",
  ghost:
    "text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--text-primary)] hover:underline",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      loading = false,
      variant = "primary",
      fullWidth = false,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) {
    const isGhost = variant === "ghost";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "inline-flex min-h-[44px] touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
          !isGhost && "px-4",
          isGhost && "min-h-0 rounded-none px-0 py-1 active:scale-100",
          VARIANTS[variant],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
        )}
        {children}
      </button>
    );
  },
);
