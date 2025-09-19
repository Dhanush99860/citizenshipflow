// FILE: src/components/Home/WhyChooseUs.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Scale,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";

/* ---------------------------------------------
   Content
---------------------------------------------- */
const FEATURES = [
  {
    icon: Globe2,
    title: "15+ Years, 25+ Jurisdictions",
    blurb:
      "Deep, up-to-date program knowledge across Europe, the Middle East, and Asia.",
  },
  {
    icon: Scale,
    title: "In-house Legal & Compliance",
    blurb:
      "Licensed attorneys, audited processes, and enterprise-grade documentation.",
  },
  {
    icon: Users,
    title: "360° Relocation Support",
    blurb:
      "Visas, company setup, housing, schooling—one accountable team throughout.",
  },
  {
    icon: Building2,
    title: "Trusted by Fortune 500s",
    blurb:
      "Corporate policies, reporting, and SLAs tailored for HR & Mobility leaders.",
  },
];

const HIGHLIGHTS = [
  "92% success across programs",
  "10K+ clients empowered",
  "ISO-style process discipline",
  "Transparent fees & timelines",
];

/* ---------------------------------------------
   Component
---------------------------------------------- */
export default function WhyChooseUs() {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 16, delay },
    },
  });

  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-heading"
      className="relative overflow-hidden py-16 sm:py-20 md:py-24"
    >
      {/* ======= BACKGROUND LAYER (graphics, no images) ======= */}
      {/* Mesh gradient */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_-10%,theme(colors.primary/10),transparent),radial-gradient(900px_500px_at_90%_120%,theme(colors.secondary/10),transparent)]" />
      </div>

      {/* Subtle SVG grid pattern */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full opacity-[0.08] dark:opacity-[0.12]"
      >
        <defs>
          <pattern
            id="grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M32 0H0V32"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated “orbits” (very subtle, respects reduced-motion) */}
      {!reduce && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute right-1/4 bottom-6 h-64 w-64 rounded-full bg-secondary/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        </div>
      )}

      <div className="container mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* ======= HEADER ======= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp(0)}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/60 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200">
            <Sparkles className="h-3.5 w-3.5" />
            Why choose XIPHIAS
          </span>

          <h2
            id="why-choose-heading"
            className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            A partner for <span className="text-secondary">global growth</span>
            — reliable, compliant, outcome-focused
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            We help entrepreneurs, investors, families, and enterprises navigate
            residency and citizenship pathways with clarity. No surprises—just a
            transparent process built for results.
          </p>
        </motion.div>

        {/* ======= VALUE PROPS ======= */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp(0.06 * i)}
                className="group h-full rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-300 ring-1 ring-primary/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                      {f.blurb}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* ======= TRUST STRIP ======= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp(0.15)}
          className="mt-8 sm:mt-10 rounded-2xl"
        >
          <ul
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm text-slate-700 dark:text-slate-300"
            aria-label="Highlights"
          >
            {HIGHLIGHTS.map((t) => (
              <li
                key={t}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 px-3 py-2 text-center"
              >
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* ======= CTA ROW ======= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp(0.2)}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-white font-semibold shadow hover:shadow-md hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/70 transition"
          >
            Book a Private Consultation
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/85 dark:bg-slate-900/80 px-5 py-3 text-slate-900 dark:text-white font-semibold hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 transition"
          >
            Learn more about us
          </Link>
        </motion.div>

        {/* Minimal schema to help SEO (optional; safe and generic) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "XIPHIAS Immigration",
              url: "https://www.xiphiasimmigration.com",
              description:
                "Global immigration partner for entrepreneurs, investors, families, and enterprises.",
              areaServed: "Worldwide",
              brand: "XIPHIAS Immigration",
            }),
          }}
        />
      </div>

      {/* tiny keyframes (no global CSS leakage) */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
