"use client";

import { Check, Circle } from "lucide-react";
import { motion } from "framer-motion";

import type { PropertyData } from "@/lib/types";
import { cn } from "@/lib/utils";

const FIELDS: {
  key: keyof PropertyData;
  label: string;
}[] = [
  { key: "propertyType", label: "Property type" },
  { key: "annualElectricityBill", label: "Annual electricity bill" },
  { key: "occupants", label: "Occupants" },
  { key: "heatingSystem", label: "Heating system" },
  { key: "interest", label: "Solar interest" },
];

function formatValue(key: keyof PropertyData, data: PropertyData): string | null {
  const value = data[key];
  if (value == null) {
    return null;
  }
  if (key === "annualElectricityBill") {
    return `£${value}`;
  }
  return String(value);
}

interface PropertyDossierProps {
  data: PropertyData;
  className?: string;
}

export function PropertyDossier({ data, className }: PropertyDossierProps) {
  const filled = FIELDS.filter((f) => data[f.key] != null).length;

  return (
    <aside
      className={cn(
        "surface-elevated flex flex-col rounded-2xl p-4 sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Property dossier
        </h2>
        <span className="rounded-full bg-[#6f8f4e]/20 px-2.5 py-0.5 text-xs font-medium text-[#9fca72]">
          {filled} / 5
        </span>
      </div>

      <ul className="space-y-3">
        {FIELDS.map((field, index) => {
          const value = formatValue(field.key, data);
          const done = value != null;
          const isNext =
            !done &&
            FIELDS.slice(0, index).every((f) => data[f.key] != null);

          return (
            <motion.li
              key={field.key}
              layout
              initial={false}
              animate={{
                borderColor: done
                  ? "rgba(159, 202, 114, 0.35)"
                  : "rgba(255,255,255,0.08)",
              }}
              className={cn(
                "rounded-xl border px-3 py-2.5 transition-colors",
                isNext && "ring-1 ring-[#9fca72]/40",
              )}
            >
              <div className="flex items-start gap-2">
                {done ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#9fca72]" />
                ) : (
                  <Circle
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      isNext ? "text-[#9fca72]" : "text-[var(--text-muted)]",
                    )}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[var(--text-secondary)]">{field.label}</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {value ?? (isNext ? "Up next" : "Waiting")}
                  </p>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}
