"use client";

import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Track, Result, AnswerMap } from "@/lib/eligibility/types";
import { trackEvent } from "@/lib/eligibility/analytics";

type Props = {
  track: Track;
  result: Result;
  name: string;
  answers: AnswerMap;
  /** Server-Action-safe handler to satisfy Next rule */
  onBackAction?: () => void | Promise<void>;
};

const SPRING = { type: "spring", stiffness: 340, damping: 32, mass: 0.72 };

export function ResultCard({ track, result, name, answers, onBackAction }: Props) {
  const reduceMotion = useReducedMotion();
  const [downloading, setDownloading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const whatsappLink = useMemo(() => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "");
    if (!num) return null;
    const text = encodeURIComponent(
      `Hi! I just checked my ${track} eligibility. Name: ${name || "-"}`
    );
    return `https://wa.me/${num}?text=${text}`;
  }, [track, name]);

  const handleDownload = async () => {
    try {
      setStatus("Preparing your PDF…");
      setDownloading(true);
      const res = await fetch("/api/eligibility/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, track, answers }),
      });
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Eligibility_${track}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      trackEvent("pdf_download", { track });
      setStatus("Download started.");
    } catch (e) {
      setStatus("Sorry — couldn’t generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  const programs = result.programs ?? [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : SPRING}
      className={[
        "rounded-2xl",
        "bg-white text-black dark:bg-black dark:text-white",
        "ring-1 ring-black/10 dark:ring-white/10",
        "p-4 sm:p-5 md:p-6",
      ].join(" ")}
      aria-labelledby="result-title"
    >
      {/* Top bar */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 id="result-title" className="text-lg sm:text-xl md:text-2xl font-semibold">
          Your Eligibility Results
        </h3>
        {onBackAction ? (
          <button
            type="button"
            onClick={onBackAction}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ring-1 ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Go back"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M7.5 2.5L4 6l3.5 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        ) : null}
      </div>

      {/* Summary stripe */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs ring-1 ring-black/10 dark:ring-white/15">
          <BadgeDot /> {capitalize(track)}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-2 py-1 text-xs ring-1 ring-black/10 dark:bg-white/10 dark:ring-white/15">
          Tier: <strong className="font-semibold">{result.tier}</strong>
        </span>
      </div>

      <p className="mt-2 text-sm sm:text-base">
        <span className="font-semibold">{result.tier}</span> — {result.summary}
      </p>

      {/* Programs */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {programs.length > 0 ? (
          programs.map((p) => (
            <article
              key={p.name}
              className={[
                "rounded-xl p-4 sm:p-5",
                "ring-1 ring-black/10 dark:ring-white/10",
                "bg-white dark:bg-black",
                "hover:shadow-sm transition",
              ].join(" ")}
            >
              <h4 className="text-sm font-medium">{p.name}</h4>
              <p className="mt-1 text-xs text-black/70 dark:text-white/70">{p.why}</p>
            </article>
          ))
        ) : (
          <div className="rounded-xl ring-1 ring-black/10 dark:ring-white/10 p-4 text-sm">
            We didn’t detect a clear recommended program from your answers. You can still download the PDF or talk to an expert.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white ring-1 ring-blue-700/20 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 active:bg-blue-800 transition"
          onClick={() => trackEvent("consult_cta_click", { track })}
        >
          Book Free Consultation
          <ArrowRightIcon />
        </Link>

        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click", { track })}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 ring-1 ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25"
          >
            Chat on WhatsApp
            <WhatsappIcon />
          </a>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={[
            "inline-flex items-center gap-2 rounded-lg px-4 py-2.5",
            "ring-1 ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
            "transition",
          ].join(" ")}
          aria-live="polite"
        >
          {downloading ? (
            <>
              <Spinner /> Preparing PDF…
            </>
          ) : (
            <>
              Download PDF
              <DownloadIcon />
            </>
          )}
        </button>

        <Link
          href="/eligibility"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 ring-1 ring-black/10 hover:ring-black/20 dark:ring-white/15 dark:hover:ring-white/25 transition"
        >
          Assess another pathway
          <OpenIcon />
        </Link>
      </div>

      {/* live status message for screen readers + subtle UI */}
      {status ? (
        <p className="mt-2 text-xs text-black/70 dark:text-white/70" aria-live="polite">
          {status}
        </p>
      ) : null}
    </motion.section>
  );
}

/* ------------------ tiny inline icons & helpers ------------------ */

function BadgeDot() {
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/70 dark:bg-white/70" />;
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M5 12.75h11.19l-3.72 3.72a.75.75 0 1 0 1.06 1.06l5.25-5.25a.75.75 0 0 0 0-1.06L13.53 5.97a.75.75 0 1 0-1.06 1.06l3.72 3.72H5a.75.75 0 0 0 0 1.5z"
      />
    </svg>
  );
}
function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4.9A10 10 0 0 0 3.6 19.7L3 22l2.4-.6A10 10 0 1 0 20 4.9ZM6.2 18.4l-.2.1-.3.1.1-.3.6-2a8 8 0 1 1 2.5 2.3l-2 .8Zm10.4-5.4c-.1-.1-.7-.4-1.1-.5s-.3-.1-.5.2-.6.7-.7.8-.2.1-.4 0a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.3-.4c.1-.2.2-.3.2-.5a.5.5 0 0 0 0-.4c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.4a.8.8 0 0 0-.5.2 2 2 0 0 0-.7 1.4 3.6 3.6 0 0 0 .8 1.9 8.2 8.2 0 0 0 3.1 3 9.2 9.2 0 0 0 1.7.7 1.7 1.7 0 0 0 1.5-.9c.2-.3.2-.7.1-.8Z"
      />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.75a.75.75 0 0 1 .75.75v8.19l2.72-2.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L6.97 11.03a.75.75 0 0 1 1.06-1.06l2.72 2.72V4.5A.75.75 0 0 1 12 3.75zM4.5 18a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2a.75.75 0 0 1 1.5 0v2A3 3 0 0 1 18 21H6a3 3 0 0 1-3-3v-2a.75.75 0 0 1 1.5 0v2z"
      />
    </svg>
  );
}
function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 3a1 1 0 0 0 0 2h3.586l-7.293 7.293a1 1 0 0 0 1.414 1.414L19 6.414V10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-6z"
      />
      <path
        fill="currentColor"
        d="M5 6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4a1 1 0 1 0-2 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4a1 1 0 1 0 0-2H5z"
      />
    </svg>
  );
}
function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="10" className="fill-none stroke-current" strokeWidth="3" opacity="0.25" />
      <path className="fill-current" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z" />
    </svg>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
