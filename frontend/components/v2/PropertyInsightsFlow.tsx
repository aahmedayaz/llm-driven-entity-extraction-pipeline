"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AddressListSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { SolarInsightsReport } from "@/components/v2/SolarInsightsReport";
import {
  fetchAddressesByPostcode,
  fetchPropertyInsights,
  type AddressItem,
  type PropertyInsights,
} from "@/lib/property-api";
type Step = "postcode" | "select" | "report";

export function PropertyInsightsFlow() {
  const toast = useToast();
  const [step, setStep] = useState<Step>("postcode");
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [selected, setSelected] = useState<AddressItem | null>(null);
  const [insights, setInsights] = useState<PropertyInsights | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingUprn, setLoadingUprn] = useState<number | null>(null);

  const handleSearch = async () => {
    setError(null);
    const trimmed = postcode.trim();
    if (!trimmed) {
      toast.error("Enter a UK postcode to search.");
      return;
    }
    setIsSearching(true);
    try {
      const result = await fetchAddressesByPostcode(trimmed);
      setAddresses(result.addresses);
      setPostcode(trimmed);
      if (result.addresses.length === 0) {
        setError("No addresses found for this postcode.");
        toast.error("No addresses found for this postcode.");
        setStep("postcode");
      } else {
        setStep("select");
        toast.success(`Found ${result.addresses.length} address(es).`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Postcode search failed";
      setError(message);
      toast.error(message);
      setStep("postcode");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = async (address: AddressItem) => {
    setSelected(address);
    setLoadingUprn(address.uprn);
    setError(null);
    try {
      const data = await fetchPropertyInsights(address.uprn);
      setInsights(data);
      setStep("report");
      sessionStorage.setItem(
        `ralico_insights_${address.uprn}`,
        JSON.stringify({ address: address.address, postcode, data }),
      );
      toast.success("EPC and solar assessment loaded.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not load property insights";
      setError(message);
      toast.error(message);
      setStep("select");
    } finally {
      setLoadingUprn(null);
    }
  };

  return (
    <>
      <div className="page-x mx-auto w-full max-w-4xl flex-1 py-6 sm:py-8">
        {step === "postcode" && (
          <div className="mx-auto max-w-lg">
            <h1 className="greeting-heading text-2xl text-[var(--text-primary)] sm:text-3xl">
              EPC & solar assessment
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Enter your UK postcode to find your address and view EPC plus
              solar savings data. No account required.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <div className="surface-input flex min-h-[44px] flex-1 items-center gap-2 rounded-2xl px-3 py-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#9fca72]" />
                <input
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleSearch()}
                  placeholder="e.g. GU10 5LU"
                  disabled={isSearching}
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] focus:outline-none disabled:opacity-50"
                  autoComplete="postal-code"
                />
              </div>
              <Button
                type="button"
                loading={isSearching}
                onClick={() => void handleSearch()}
                className="shrink-0 sm:min-w-[7.5rem]"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          </div>
        )}

        {step === "select" && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Select your address
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {isSearching
                ? "Searching…"
                : `${addresses.length} addresses in ${postcode}`}
            </p>

            {isSearching ? (
              <AddressListSkeleton count={5} />
            ) : (
              <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
                {addresses.map((addr) => (
                  <li key={addr.uprn}>
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      loading={loadingUprn === addr.uprn}
                      disabled={loadingUprn !== null && loadingUprn !== addr.uprn}
                      onClick={() => void handleSelect(addr)}
                      className="h-auto min-h-[52px] justify-start rounded-xl py-3 text-left text-sm font-normal"
                    >
                      {addr.address}
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <Button
              variant="ghost"
              onClick={() => {
                setStep("postcode");
                setError(null);
                setAddresses([]);
              }}
              disabled={loadingUprn !== null}
            >
              Change postcode
            </Button>
          </div>
        )}

        {step === "report" && insights && selected && (
          <div>
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("select");
                  setInsights(null);
                }}
              >
                ← Pick another address
              </Button>
            </div>
            <SolarInsightsReport
              insights={insights}
              address={selected.address}
            />
          </div>
        )}

        {loadingUprn !== null && step === "select" && (
          <div className="mt-6 space-y-3 rounded-2xl border border-[var(--border-subtle)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Fetching EPC and solar assessment…
            </p>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </div>
    </>
  );
}
