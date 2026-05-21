"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

import { cn } from "@/lib/utils";

interface JourneyOrbProps {
  active?: boolean;
  listening?: boolean;
  className?: string;
}

export function JourneyOrb({ active, listening, className }: JourneyOrbProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.div
        className="absolute h-28 w-28 rounded-full bg-[#6f8f4e]/15 sm:h-36 sm:w-36"
        animate={{
          scale: listening ? [1, 1.15, 1] : active ? [1, 1.08, 1] : 1,
          opacity: listening ? [0.4, 0.7, 0.4] : 0.35,
        }}
        transition={{ duration: listening ? 1.2 : 2.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute h-20 w-20 rounded-full border border-[#9fca72]/20 sm:h-24 sm:w-24"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6f8f4e] to-[#4a6b35] text-white shadow-lg sm:h-20 sm:w-20">
        <Bot className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
    </div>
  );
}
