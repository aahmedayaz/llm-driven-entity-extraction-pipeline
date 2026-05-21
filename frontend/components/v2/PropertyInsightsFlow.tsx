"use client";

import { useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SolarInsightsReport } from "@/components/v2/SolarInsightsReport";
import { RobotPeekingGuide } from "@/components/v2/RobotPeekingGuide";
import {
  fetchAddressesByPostcode,
  fetchPropertyInsights,
  savePropertyReport,
  type AddressItem,
  type PropertyInsights,
} from "@/lib/property-api";
import { cn } from "@/lib/utils";

type Step = "postcode" | "select" | "loading" | "report";

export function PropertyInsightsFlow() {
  const [step, setStep] = useState<Step>("postcode");
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selected, setSelected] = useState<AddressItem | null>(null);
  const [insights, setInsights] = useState<PropertyInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const handleSearch = async () => {
    setError(null);
    setSaveMsg(null);
    if (!postcode.trim()) {
      return;
    }
    setStep("loading");
    try {
      const result = await fetchAddressesByPostcode(postcode);
      setAddresses(result.addresses);
      setStep("select");
      if (result.addresses.length === 0) {
        setError("No addresses found for this postcode.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setStep("postcode");
    }
  };

  const handleSelect = async (address: AddressItem) => {
    setSelected(address);
    setStep("loading");
    setError(null);
    try {
      const data = await fetchPropertyInsights(address.uprn);
      setInsights(data);
      setStep("report");
      sessionStorage.setItem(
        `ralico_insights_${address.uprn}`,
        JSON.stringify({ address: address.address, postcode, data }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load insights");
      setStep("select");
    }
  };

  const handleSave = async () => {
    if (!insights || !selected) {
      return;
    }
    setSaveMsg(null);
    try {
      await savePropertyReport({
        uprn: insights.uprn,
        postcode,
        address: selected.address,
        epc: insights.epc,
        solar: insights.solar,
      });
      setSaveMsg("Saved to your account.");
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed");
    }
  };

  return (
    <>
      <RobotPeekingGuide message="Enter your UK postcode, pick your address, and we'll pull EPC + solar assessment data." />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <AnimatePresence mode="wait">
          {step === "postcode" && (
            <motion.div
              key="postcode"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-lg"
            >
              <h1 className="greeting-heading text-2xl text-[var(--text-primary)] sm:text-3xl">
                Property insights by postcode
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Works without signing in. Sign in to save reports to your account.
              </p>
              <div className="mt-6 flex gap-2">
                <div className="surface-input flex flex-1 items-center gap-2 rounded-2xl px-3 py-2">
                  <MapPin className="h-4 w-4 text-[#9fca72]" />
                  <input
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
                    placeholder="e.g. GU10 5LU"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleSearch()}
                  className="flex items-center gap-2 rounded-2xl bg-[#6f8f4e] px-4 py-2 text-sm font-medium text-white"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            </motion.div>
          )}

          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Select your address
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {addresses.length} addresses in {postcode}
              </p>
              <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
                {addresses.map((addr) => (
                  <li key={addr.uprn}>
                    <button
                      type="button"
                      onClick={() => void handleSelect(addr)}
                      className={cn(
                        "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3 text-left text-sm transition",
                        "hover:border-[#9fca72]/40 hover:bg-[#6f8f4e]/10",
                      )}
                    >
                      {addr.address}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="text-sm text-[var(--text-secondary)] underline"
                onClick={() => setStep("postcode")}
              >
                Change postcode
              </button>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="h-10 w-10 animate-spin text-[#9fca72]" />
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                Fetching EPC and solar assessment…
              </p>
            </motion.div>
          )}

          {step === "report" && insights && selected && (
            <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-sm text-[var(--text-secondary)] underline"
                  onClick={() => setStep("select")}
                >
                  ← Pick another address
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  className="rounded-full border border-[#9fca72]/30 bg-[#6f8f4e]/15 px-4 py-1.5 text-xs font-medium text-[#9fca72]"
                >
                  Save to account (sign in required)
                </button>
              </div>
              {saveMsg && (
                <p className="mb-4 text-sm text-[var(--text-secondary)]">{saveMsg}</p>
              )}
              <SolarInsightsReport insights={insights} address={selected.address} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
