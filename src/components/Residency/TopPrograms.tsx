// src/components/TopPrograms.tsx
import Link from "next/link";
import Image from "next/image";
import * as React from "react";
import { Banknote, Timer } from "lucide-react";

// --- accept all verticals without changing UI ---
import type { ProgramMeta as ResidencyProgram } from "@/lib/residency-content";
import type { ProgramMeta as CitizenshipProgram } from "@/lib/citizenship-content";
import type { ProgramMeta as SkilledProgram } from "@/lib/skilled-content";
import type { ProgramMeta as CorporateProgram } from "@/lib/corporate-content";

type AnyProgram =
  | ResidencyProgram
  | CitizenshipProgram
  | SkilledProgram
  | CorporateProgram;

/* ---------------- helpers ---------------- */

function baseFromCategory(cat?: AnyProgram["category"]) {
  switch (cat) {
    case "citizenship":
      return "/citizenship";
    case "skilled":
      return "/skilled";
    case "corporate":
      return "/corporate";
    case "residency":
    default:
      return "/residency";
  }
}

/** Build a safe href. Falls back to country page if programSlug missing. */
function safeHref(p: AnyProgram) {
  const base = baseFromCategory(p.category);
  const c = p.countrySlug || "";
  const prog = (p as any).programSlug || "";
  return prog ? `${base}/${c}/${prog}` : `${base}/${c}`;
}

/** Make image URL absolute; use fallback if missing. */
function normalizeImageSrc(src?: string, fallback = "/og.jpg") {
  const val = (src && src.trim()) || fallback;
  if (/^https?:\/\//i.test(val) || val.startsWith("/")) return val;
  return `/${val.replace(/^\/+/, "")}`;
}

function money(amount: number, currency?: string) {
  const c = (currency || "").toUpperCase();
  if (!c) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${c}`;
  }
}
function months(m?: number) {
  if (typeof m !== "number" || Number.isNaN(m)) return "Timeline varies";
  return `${m} mo${m === 1 ? "" : "s"}`;
}

/* ---------------- component ---------------- */

/**
 * TopPrograms — **sidebar/aside** horizontal cards
 * - Small thumbnail (4:3) on the left, text on the right
 * - Country badge on photo; 2 compact metric pills (investment, timeline)
 * - Calm hover (no translate) to avoid “jumping” on focus
 * - Fully responsive (wraps nicely if used outside sidebars)
 * - SEO: ItemList JSON-LD + per-card Offer microdata
 */
export default function TopPrograms({ programs }: { programs: AnyProgram[] }) {
  if (!programs?.length) return null;

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: programs.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: safeHref(p),
      name: p.title,
      description: [
        p.country,
        typeof (p as any).minInvestment === "number"
          ? money((p as any).minInvestment, (p as any).currency)
          : null,
        months(p.timelineMonths),
      ]
        .filter(Boolean)
        .join(" · "),
    })),
  };

  return (
    <section aria-labelledby="top-programs-heading" className="mt-4">
      <h2 id="top-programs-heading" className="sr-only">
        Top programs
      </h2>

      <ul className="flex flex-col gap-3">
        {programs.map((p, idx) => {
          const rawImg =
            (("image" in p) && (p as any).image) ||
            (("heroImage" in p) && (p as any).heroImage) ||
            undefined;

          const imgSrc = normalizeImageSrc(
            rawImg,
            `/images/countries/${p.countrySlug}-hero-poster.jpg`
          );

          const href = safeHref(p);
          const titleId = `tp-aside-title-${p.countrySlug}-${p.programSlug || idx}`;
          const hasInvestment = typeof (p as any).minInvestment === "number";
          const investment = hasInvestment
            ? money((p as any).minInvestment as number, (p as any).currency)
            : "Varies";
          const timeline = months(p.timelineMonths);
          const chips = Array.isArray(p.tags) ? p.tags.slice(0, 3) : [];

          return (
            <li key={`${p.countrySlug}-${p.programSlug || idx}`}>
              <Link
                href={href}
                aria-labelledby={titleId}
                className={[
                  "group relative block w-full rounded-2xl p-2.5 sm:p-3",
                  "bg-white/90 dark:bg-neutral-900/70 backdrop-blur",
                  "ring-1 ring-neutral-200/80 dark:ring-neutral-800/70",
                  "shadow-sm hover:shadow-md transition-shadow duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60",
                ].join(" ")}
              >
                <article itemScope itemType="https://schema.org/Offer" className="flex items-stretch gap-3">
                  {/* Media (fixed size to keep rows aligned) */}
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800 sm:h-24 sm:w-32">
                    {rawImg ? (
                      <Image
                        src={imgSrc}
                        alt={`${p.title} — ${p.country}`}
                        fill
                        sizes="112px" // sidebar thumb
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-[11px] text-neutral-500 dark:text-neutral-400">
                        No image
                      </div>
                    )}
                    {/* Country badge */}
                    {/* <span className="pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-neutral-900 ring-1 ring-neutral-200 dark:bg-neutral-900/70 dark:text-neutral-100 dark:ring-neutral-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
                      {p.country}
                    </span> */}
                    <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <h3
                      id={titleId}
                      className="text-[14px] sm:text-[15px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100 line-clamp-2"
                    >
                      {p.title}
                    </h3>

                    {/* Metric pills */}
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px] sm:text-[12px]">
                      <div
                        className="flex items-center gap-1.5 rounded-lg bg-black/5 px-2 py-1 ring-1 ring-neutral-200 dark:bg-white/10 dark:ring-neutral-700"
                        title={`Minimum investment: ${investment}`}
                      >
                        <Banknote className="h-3.5 w-3.5 opacity-70 text-black dark:text-white" aria-hidden />
                        <span className="font-medium tabular-nums truncate text-black dark:text-white">{investment}</span>
                      </div>
                      <div
                        className="flex items-center gap-1.5 rounded-lg bg-black/5 px-2 py-1 ring-1 ring-neutral-200 dark:bg-white/10 dark:ring-neutral-700"
                        title={`Typical timeline: ${timeline}`}
                      >
                        <Timer className="h-3.5 w-3.5 opacity-70 text-black dark:text-white" aria-hidden />
                        <span className="font-medium tabular-nums truncate text-black dark:text-white">{timeline}</span>
                      </div>
                    </div>

                    {/* Tags row (optional) */}
                    {chips.length ? (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {chips.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] ring-1 ring-neutral-200 dark:ring-neutral-700 bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 max-w-[9rem] truncate"
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <span className="mt-1.5 inline-flex items-center text-[12px] font-medium text-sky-700 dark:text-sky-300">
                      View details
                      <span
                        aria-hidden
                        className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>

                    {/* Per-card Offer microdata */}
                    {hasInvestment ? (
                      <div className="hidden" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="price" content={String((p as any).minInvestment)} />
                        {(p as any).currency ? (
                          <meta itemProp="priceCurrency" content={(p as any).currency!.toUpperCase()} />
                        ) : null}
                        <link itemProp="availability" href="https://schema.org/InStock" />
                      </div>
                    ) : null}
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* SEO: ItemList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
    </section>
  );
}
