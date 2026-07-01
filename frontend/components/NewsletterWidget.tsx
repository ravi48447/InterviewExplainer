"use client";

import { useState } from "react";
import { Mail, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface NewsletterWidgetProps {
  heading?: string;
  subheading?: string;
  compact?: boolean;
}

export function NewsletterWidget({
  heading = "Stay ahead of the curve",
  subheading = "Get notified when we add new domains, content updates, and features.",
  compact = false,
}: NewsletterWidgetProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex flex-col items-center gap-3 text-center ${compact ? "py-4" : "py-8"}`}>
        <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" />
        <p className="font-semibold text-foreground">You are on the list!</p>
        <p className="text-sm text-muted-foreground">We will reach out when new content drops.</p>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "py-4"}>
      {!compact && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">{heading}</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{subheading}</p>
        </>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 input-field"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              {compact ? <ArrowRight className="w-4 h-4" /> : "Subscribe"}
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-xs text-destructive">{errorMsg}</p>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground/70">
        No spam. Unsubscribe at any time.
      </p>
    </div>
  );
}
