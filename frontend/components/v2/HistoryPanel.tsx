"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, Loader2 } from "lucide-react";

import { listConversations, type ConversationSummary } from "@/lib/conversations-api";
import { getSupabaseClient } from "@/lib/supabase/client";

export function HistoryPanel() {
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setSignedIn(false);
        setLoading(false);
        return;
      }
      setSignedIn(true);
      try {
        const list = await listConversations();
        setItems(list);
      } catch {
        setItems([]);
      }
      setLoading(false);
    };
    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void load());
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <History className="mx-auto h-10 w-10 text-[#9fca72]" />
        <h1 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
          Saved chat history
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Sign in from the header to save and view your property surveys. You can
          use the survey and postcode tools without an account.
        </p>
        <Link
          href="/survey"
          className="mt-6 inline-block text-sm text-[#9fca72] underline"
        >
          Start a survey →
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#9fca72]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
        Your saved surveys
      </h1>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          No saved conversations yet. Complete a survey while signed in.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium capitalize">{item.status}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
              {item.extracted_data?.propertyType && (
                <p className="mt-2 text-xs text-[var(--text-secondary)]">
                  {item.extracted_data.propertyType}
                  {item.extracted_data.interest
                    ? ` · ${item.extracted_data.interest}`
                    : ""}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
