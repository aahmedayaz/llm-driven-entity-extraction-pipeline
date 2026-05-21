"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AuthPanelProps {
  onAuthChange?: () => void;
  className?: string;
}

export function AuthPanel({ onAuthChange, className }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const supabase = isSupabaseConfigured() ? getSupabaseClient() : null;

  const refreshUser = async () => {
    if (!supabase) {
      return;
    }
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
    onAuthChange?.();
  };

  useEffect(() => {
    void refreshUser();
    if (!supabase) {
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refreshUser();
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!supabase) {
    return (
      <p className={cn("text-xs text-[var(--text-muted)]", className)}>
        Sign-in unavailable (Supabase not configured).
      </p>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error: authError } = await action;
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    await refreshUser();
    setExpanded(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    onAuthChange?.();
  };

  if (userEmail) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <span className="hidden text-xs text-[var(--text-secondary)] sm:inline">
          {userEmail}
        </span>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#9fca72]/30 bg-[#6f8f4e]/15 px-3 py-1.5 text-xs font-medium text-[#9fca72]"
      >
        <User className="h-3.5 w-3.5" />
        Save history — sign in
      </button>

      {expanded && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-xl">
          <p className="mb-3 text-xs text-[var(--text-secondary)]">
            Use the app without signing in. Sign in only to save surveys and
            property reports.
          </p>
          <div className="mb-2 flex gap-2 text-xs">
            <button
              type="button"
              className={cn(mode === "signin" && "text-[#9fca72]")}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={cn(mode === "signup" && "text-[#9fca72]")}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-input)] px-3 py-2 text-sm"
          />
          {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleSubmit()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6f8f4e] py-2 text-sm font-medium text-white"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </div>
      )}
    </div>
  );
}
