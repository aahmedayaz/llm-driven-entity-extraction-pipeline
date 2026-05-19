"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { useState } from "react";

import type { PropertyData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FinalJsonCardProps {
  data: PropertyData;
}

export function FinalJsonCard({ data }: FinalJsonCardProps) {
  const [copied, setCopied] = useState(false);
  const formattedJson = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-slide-up rounded-2xl border border-teal-200/60 bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-600" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-800">
            Property details complete
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            "border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          <Copy className="h-3.5 w-3.5" aria-hidden />
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-300 sm:text-sm">
        {formattedJson}
      </pre>
    </div>
  );
}
