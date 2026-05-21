"use client";

import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface RobotPeekingGuideProps {
  message: string;
  className?: string;
}

export function RobotPeekingGuide({ message, className }: RobotPeekingGuideProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className={cn("pointer-events-none fixed bottom-6 left-4 z-30 sm:left-8", className)}>
      <motion.button
        type="button"
        className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#9fca72]/30 bg-[#6f8f4e]/20 text-[#9fca72] shadow-lg"
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        aria-label="Assistant tip"
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -8, scale: 0.95 }}
            className="pointer-events-auto absolute bottom-14 left-0 w-56 rounded-2xl border border-[#9fca72]/25 bg-[rgba(20,20,19,0.9)] px-3 py-2.5 text-xs leading-relaxed text-[var(--text-primary)] shadow-xl backdrop-blur-md sm:w-64 sm:text-sm"
          >
            <p>{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
