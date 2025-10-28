// src/components/PersonalBooking/Expert/index.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { BOOKING_PAID_ROUTE } from "@/components/PersonalBooking/booking-flow";

import {
  Calendar,
  User,
  Globe,
  ShieldCheck,
  Sparkles,
  Award,
} from "lucide-react";


type Highlight = { icon: React.ReactNode; text: React.ReactNode };
type Fact = { label: string; value: string };

/* ------------------------------ Content ------------------------------ */

const NAME = "Varun Singh";
const ROLE = "Managing Director, XIPHIAS Immigration";

const PORTRAIT_SRC: string = "/images/avtar/varun-singh-md-xiphias.jpg";
/** Set to an MP4 path if you want video; keep empty string to force portrait image */
const VIDEO_SRC: string | undefined = ""; // e.g. "/videos/varun-singh.mp4"

/** SAFE narrowing: never call .trim() until we've proven it's a string */
const HAS_VIDEO: boolean =
  typeof VIDEO_SRC === "string" && VIDEO_SRC.trim().length > 0;

// Keep copy neutral (no unverified claims)
const BIO: string =
  "Varun leads the advisory practice at XIPHIAS Immigration, focusing on compliant, transparent pathways in residency and citizenship planning for entrepreneurs, professionals, and families.";

const HIGHLIGHTS: Highlight[] = [
  {
    icon: <Award className="w-5 h-5 text-primary relative z-10" />,
    text: (
      <>
        <span className="font-semibold">Leadership in immigration advisory</span>
      </>
    ),
  },
  {
    icon: <Globe className="w-5 h-5 text-primary relative z-10" />,
    text: (
      <>
        Exposure to multiple <span className="font-semibold">destination programs</span>
      </>
    ),
  },
  {
    icon: <Sparkles className="w-5 h-5 text-primary relative z-10" />,
    text: (
      <>
        <span className="font-semibold">Process-led</span> and client-first
      </>
    ),
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary relative z-10" />,
    text: (
      <>
        Strong emphasis on <span className="font-semibold">ethics & compliance</span>
      </>
    ),
  },
];

const FACTS: Fact[] = [
  { label: "Role", value: "Managing Director" },
  { label: "Approach", value: "Transparent & process-led" },
];

/* ----------------------------- Component ----------------------------- */

export default function Expert() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Respect reduced motion (no autoplay even if you add it later)
  React.useEffect(() => {
    const mq =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (!mq || !videoRef.current) return;
    if (mq.matches) videoRef.current.pause();
  }, []);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-5">
    <section
      className={[
        "relative w-full py-12 sm:py-16",
        "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        "dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        "overflow-hidden",
      ].join(" ")}
      aria-labelledby="expert-title"
    >
      {/* Background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(#64748b 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0,14px 14px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
          {/* LEFT: Content */}
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4" />
              Trusted Advisor
            </div>

            <div>
              <h2
                id="expert-title"
                className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-100"
              >
                Meet{" "}
                <span className="bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                  {NAME}
                </span>
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-700/90 dark:text-slate-300/90">
                {ROLE}
              </p>
            </div>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:mx-0">
              {BIO}
            </p>

            {/* Pill list */}
            <ul className="grid grid-cols-2 gap-3 text-sm text-slate-700 dark:text-slate-200">
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <Sparkles className="h-4 w-4 text-primary" />
                Mission-driven
              </li>
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <User className="h-4 w-4 text-primary" />
                Client-first
              </li>
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <Globe className="h-4 w-4 text-primary" />
                Global programs
              </li>
              <li className="flex items-center justify-center gap-2 md:justify-start">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Ethics & compliance
              </li>
            </ul>

            {/* Highlights */}
            <h3 className="pt-1 text-lg font-semibold text-slate-800 dark:text-slate-200 sm:text-xl">
              Focus & Impact
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {HIGHLIGHTS.map((item: Highlight, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10 shadow-inner dark:bg-primary/20">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 to-transparent opacity-70" />
                    {item.icon}
                  </div>
                  <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 sm:text-base">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Facts row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-400 md:justify-start">
              {FACTS.map((f: Fact) => (
                <span
                  key={`${f.label}-${f.value}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="font-medium">{f.label}:</span> {f.value}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row md:items-start">
            <Link
  href={BOOKING_PAID_ROUTE}
  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2"
  aria-label="Reserve your consultation"
>
  <Calendar className="h-5 w-5" />
  <span>Reserve Your Consultation</span>
</Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-slate-800 transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:border-slate-700 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15"
              >
                About XIPHIAS
              </Link>
            </div>
          </div>

          {/* RIGHT: Media (portrait if no video; landscape if video) */}
          <div
            className={[
              "relative order-first overflow-hidden rounded-3xl border border-slate-200 shadow-2xl",
              "bg-slate-100 dark:border-slate-700 dark:bg-slate-800",
              HAS_VIDEO ? "aspect-[16/9]" : "aspect-[4/5]",
              "md:order-none",
            ].join(" ")}
          >
            {/* gloss */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/40 via-white/10 to-transparent"
            />
            {HAS_VIDEO ? (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={PORTRAIT_SRC}
              >
                <source src={VIDEO_SRC} type="video/mp4" />
                Your browser does not support video.
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={PORTRAIT_SRC}
                alt={`${NAME} portrait`}
                className="absolute inset-0 h-full w-full object-cover object-[50%_20%]"
              />
            )}

            {/* badge */}
            <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs text-slate-700 shadow dark:bg-slate-900/80 dark:text-slate-200">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Verified Expert
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
