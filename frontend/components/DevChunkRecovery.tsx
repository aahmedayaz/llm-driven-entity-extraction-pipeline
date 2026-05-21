"use client";

import { useEffect } from "react";

const RELOAD_KEY = "next-dev-chunk-reload";

function isChunkLoadFailure(reason: unknown, message?: string): boolean {
  const text =
    message ??
    (typeof reason === "string"
      ? reason
      : reason instanceof Error
        ? reason.message
        : String(reason ?? ""));

  return (
    text.includes("ChunkLoadError") ||
    text.includes("Loading chunk") ||
    text.includes("Failed to fetch dynamically imported module")
  );
}

export function DevChunkRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const reloadOnce = () => {
      const attempts = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
      if (attempts >= 2) {
        return;
      }
      sessionStorage.setItem(RELOAD_KEY, String(attempts + 1));
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      if (isChunkLoadFailure(event.error, event.message)) {
        reloadOnce();
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadFailure(event.reason)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    const clearTimer = window.setTimeout(() => {
      sessionStorage.removeItem(RELOAD_KEY);
    }, 8000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.clearTimeout(clearTimer);
    };
  }, []);

  return null;
}
