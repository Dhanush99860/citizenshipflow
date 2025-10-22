// ============================
// src/components/Contact/LeadTabs.tsx
// ============================
"use client";

import * as React from "react";
import SectionCard from "@/components/Contact/SectionCard";
import ContactForm from "@/components/ContactForm"; // ← assumes your ContactForm/index exports default

export default function LeadTabs({ id, emailTo, phoneFallback }: { id?: string; emailTo: string; phoneFallback?: string }) {
  const [active, setActive] = React.useState<"enquiry" | "callback" | "whatsapp">("enquiry");

  return (
    <SectionCard id={id} aria-labelledby="lead-tabs-title" className="p-0 overflow-hidden">
      <div className="px-6 pt-6">
        <h2 id="lead-tabs-title" className="text-xl font-semibold">How would you like to connect?</h2>
        <p className="mt-1 text-sm text-black/70 dark:text-white/70">Choose one. We’ll route you to the right expert.</p>

        <div role="tablist" aria-label="Lead options" className="mt-4 flex flex-wrap gap-2">
          {([
            { key: "enquiry", label: "General enquiry" },
            { key: "callback", label: "Request a callback" },
            { key: "whatsapp", label: "WhatsApp" },
          ] as const).map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={active === t.key}
              onClick={() => setActive(t.key)}
              className={[
                "rounded-full px-3 py-1.5 text-sm ring-1 transition",
                active === t.key
                  ? "bg-blue-600 text-white ring-blue-700/20"
                  : "bg-white text-blue-700 ring-blue-200 hover:bg-blue-50 dark:bg-white/5 dark:text-blue-200 dark:ring-blue-800/60",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-4 border-t border-blue-100/70 dark:border-blue-900/30">
        {active === "enquiry" && (
          <div role="tabpanel" className="px-6 py-6">
            <ContactForm />
          </div>
        )}

        {active === "callback" && (
          <div role="tabpanel" className="px-6 py-6">
            <CallbackForm emailTo={emailTo} phoneFallback={phoneFallback} />
          </div>
        )}

        {active === "whatsapp" && (
          <div role="tabpanel" className="px-6 py-6">
            <WhatsAppPanel numberHint={phoneFallback} />
          </div>
        )}
      </div>
    </SectionCard>
  );
}

/* --------------------------- lightweight forms --------------------------- */
function CallbackForm({ emailTo, phoneFallback }: { emailTo: string; phoneFallback?: string }) {
  const [sending, setSending] = React.useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    try {
      // You can wire this to your API route / server action
      const fd = new FormData(e.currentTarget);
      await fetch("/api/callback", { method: "POST", body: fd });
      alert("Thanks! We’ll call you back soon.");
      e.currentTarget.reset();
    } finally {
      setSending(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
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
          <option>09:00–12:00</option>
          <option>12:00–15:00</option>
          <option>15:00–18:00</option>
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
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-white ring-1 ring-blue-700/20 hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-60"
        >
          {sending ? "Sending…" : "Request callback"}
        </button>
      </div>
    </form>
  );
}

function WhatsAppPanel({ numberHint }: { numberHint?: string }) {
  const [msg, setMsg] = React.useState("Hello! I’d like to talk to an immigration expert.");
  const digits = (numberHint || "").replace(/[^\d+]/g, "").replace(/^\+/, "");
  const wa = `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
  return (
    <div className="grid gap-4">
      <p className="text-sm text-black/80 dark:text-white/80">Send us a WhatsApp. We usually reply within a few hours.</p>
      <div>
        <Label>Message</Label>
        <textarea className={INPUT_CLS} rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} />
      </div>
      <div>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-black ring-1 ring-black/10 hover:brightness-105"
        >
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}

const INPUT_CLS = "mt-1 w-full rounded-xl border border-blue-200/70 bg-white/80 px-3 py-2 text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-blue-900/40 dark:bg-white/5 dark:text-white";
function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={[INPUT_CLS, props.className].filter(Boolean).join(" ")} />;
}