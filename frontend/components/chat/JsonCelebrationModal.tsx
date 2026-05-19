"use client";

import { CheckCircle2, Copy, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GraffitiCelebration } from "@/components/chat/animations/GraffitiCelebration";
import { PeekingAvatar } from "@/components/chat/animations/PeekingAvatar";
import type { PropertyData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface JsonCelebrationModalProps {
  data: PropertyData;
  open: boolean;
  onClose: () => void;
}

export function JsonCelebrationModal({
  data,
  open,
  onClose,
}: JsonCelebrationModalProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formattedJson = JSON.stringify(data, null, 2);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formattedJson]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className="animate-backdrop-in fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="json-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <GraffitiCelebration />

      <div className="relative z-[102] w-full max-w-lg overflow-visible">
        <PeekingAvatar className="absolute -bottom-6 -right-8 z-[101] h-40 w-32 sm:-right-10 sm:h-48 sm:w-36" />

        <div className="animate-modal-pop relative z-[102] overflow-hidden rounded-3xl border-4 border-slate-900 bg-[#fffdf5] shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-yellow-300" aria-hidden />
                <div>
                  <h2
                    id="json-modal-title"
                    className="text-lg font-bold text-white sm:text-xl"
                  >
                    Property survey complete
                  </h2>
                  <p className="text-xs text-blue-100 sm:text-sm">
                    Your structured JSON is ready
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/20 p-1.5 text-white transition hover:bg-white/30"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                All fields captured
              </span>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-900 px-3 py-2 text-xs font-semibold transition",
                  "bg-white text-slate-900 hover:bg-yellow-50 hover:text-slate-950",
                )}
              >
                <Copy className="h-3.5 w-3.5" aria-hidden />
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>

            <pre className="max-h-[min(50vh,320px)] overflow-auto rounded-2xl border-2 border-slate-900 bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300 sm:text-sm">
              {formattedJson}
            </pre>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
