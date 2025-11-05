"use client";

// ============================
// src/components/Contact/LeadTabs.tsx
// ============================

import * as React from "react";
import SectionCard from "@/components/Contact/SectionCard";
import ContactForm from "@/components/ContactForm";

type LeadTabsKey = "enquiry" | "callback" | "whatsapp";

export default function LeadTabs({
  id,
  emailTo,
  phoneFallback,
}: {
  id?: string;
  emailTo: string;
  phoneFallback?: string;
}) {
  const tabs: { key: LeadTabsKey; label: string }[] = [
    { key: "enquiry", label: "General enquiry" },
    { key: "callback", label: "Request a callback" },
    { key: "whatsapp", label: "WhatsApp" },
  ];

  const [active, setActive] = React.useState<LeadTabsKey>("enquiry");

  return (
    <SectionCard id={id} aria-labelledby="lead-tabs-title" className="p-0 overflow-hidden">
      {/* Header: compact on mobile, a bit looser from md */}
      <div className="px-4 pt-4 md:px-6 md:pt-5">
        <h2 id="lead-tabs-title" className="text-base md:text-lg font-semibold">
          How would you like to connect?
        </h2>
        <p className="mt-0.5 text-xs md:text-sm text-black/70 dark:text-white/70">
          Choose one. Weâ€™ll route you to the right expert.
        </p>

        {/* Tabs: dense chips; no extra margins */}
        <div role="tablist" aria-label="Lead options" className="mt-3 flex flex-wrap gap-1.5">
          {tabs.map((t) => {
            const selected = active === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.key}`}
                id={`tab-${t.key}`}
                onClick={() => setActive(t.key)}
                className={[
                  "rounded-full px-3 py-1 text-xs md:text-sm ring-1 transition",
                  selected
                    ? "bg-blue-600 text-white ring-blue-700/30"
                    : "bg-white text-blue-700 ring-blue-200 hover:bg-blue-50 dark:bg-white/5 dark:text-blue-200 dark:ring-blue-800/60",
                ].join(" ")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels: compact padding, subtle divider */}
      <div className="mt-3 border-t border-blue-100/70 dark:border-blue-900/30">
        {active === "enquiry" && (
          <div
            role="tabpanel"
            id="panel-enquiry"
            aria-labelledby="tab-enquiry"
            className="px-4 py-4 md:px-6 md:py-5"
          >
            <ContactForm />
          </div>
        )}

        {active === "callback" && (
          <div
            role="tabpanel"
            id="panel-callback"
            aria-labelledby="tab-callback"
            className="px-4 py-4 md:px-6 md:py-5"
          >
            <CallbackForm emailTo={emailTo} phoneFallback={phoneFallback} />
          </div>
        )}

        {active === "whatsapp" && (
          <div
            role="tabpanel"
            id="panel-whatsapp"
            aria-labelledby="tab-whatsapp"
            className="px-4 py-4 md:px-6 md:py-5"
          >
            <WhatsAppPanel numberHint={phoneFallback} />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* --------------------------- compact, responsive forms --------------------------- */

function CallbackForm({ emailTo, phoneFallback }: { emailTo: string; phoneFallback?: string }) {
  const [sending, setSending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      const fd = new FormData(e.currentTarget);
      await fetch("/api/callback", { method: "POST", body: fd });
      alert("Thanks! Weâ€™ll call you back soon.");
      e.currentTarget.reset();
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <Label>Name</Label>
        <Input name="name" required autoComplete="name" />
      </div>
      <div className="sm:col-span-1">
        <Label>Phone</Label>
        <Input name="phone" type="tel" required autoComplete="tel" placeholder={phoneFallback} />
      </div>
      <div className="sm:col-span-2">
        <Label>Best time to call</Label>
        <select name="time" className={INPUT_CLS} defaultValue="">
          <option value="" disabled>
            Select a slot (IST)
          </option>
          <option>09:00â€“12:00</option>
          <option>12:00â€“15:00</option>
          <option>15:00â€“18:00</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <Label>Notes (optional)</Label>
        <textarea name="notes" className={INPUT_CLS} rows={3} />
      </div>
      <input type="hidden" name="emailTo" value={emailTo} />
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white ring-1 ring-blue-700/20 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
        >
          {sending ? "Sendingâ€¦" : "Request callback"}
        </button>
      </div>
    </form>
  );
}

function WhatsAppPanel({ numberHint }: { numberHint?: string }) {
  const [msg, setMsg] = React.useState("Hello! Iâ€™d like to talk to an immigration expert.");
  const digits = (numberHint || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const canOpen = digits.length >= 8;
  const wa = canOpen ? `https://wa.me/${digits}?text=${encodeURIComponent(msg)}` : undefined;

  return (
    <div className="grid gap-3">
      <p className="text-xs md:text-sm text-black/80 dark:text-white/80">
        Send us a WhatsApp. We usually reply within a few hours.
      </p>
      <div>
        <Label>Message</Label>
        <textarea className={INPUT_CLS} rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!canOpen}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm ring-1",
            canOpen
              ? "bg-[#25D366] text-black ring-black/10 hover:brightness-105"
              : "pointer-events-none bg-black/5 text-black/40 ring-black/10 dark:bg-white/5 dark:text-white/40",
          ].join(" ")}
        >
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}

/* --------------------------- shared compact inputs --------------------------- */

const INPUT_CLS =
  "mt-1 w-full rounded-lg border border-blue-200/70 bg-white/80 px-3 py-2 text-sm text-black placeholder:text-black/50 " +
  "focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-blue-900/40 dark:bg-white/5 dark:text-white";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs md:text-sm font-medium">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[INPUT_CLS, props.className].filter(Boolean).join(" ")} />;
}

