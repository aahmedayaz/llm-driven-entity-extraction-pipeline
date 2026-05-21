"use client";

import Link from "next/link";
import { ArrowRight, MapPin, MessageSquare, Mic } from "lucide-react";
import { motion } from "framer-motion";

import { JourneyOrb } from "@/components/v2/JourneyOrb";

export function LandingHero() {
  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:py-16">
      <JourneyOrb active className="mb-8" />
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="greeting-heading max-w-2xl text-3xl text-[var(--text-primary)] sm:text-4xl md:text-5xl"
      >
        Is solar right for{" "}
        <span className="text-[#9fca72]">your home</span>?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base"
      >
        A quick property survey and real UK address insights — no account needed.
        Sign in only if you want to save your history.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Link
          href="/survey"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6f8f4e] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          <Mic className="h-4 w-4" />
          Start property survey
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/property"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-6 py-3.5 text-sm font-medium text-[var(--text-primary)] transition hover:border-[#9fca72]/40"
        >
          <MapPin className="h-4 w-4 text-[#9fca72]" />
          Postcode solar check
        </Link>
      </motion.div>

      <p className="mt-6 text-xs text-[var(--text-muted)]">
        Private · No login required · Deterministic extraction (minimal AI cost)
      </p>
    </div>
  );
}
