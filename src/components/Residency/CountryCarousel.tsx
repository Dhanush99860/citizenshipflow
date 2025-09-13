"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

// ---- Accept ALL verticals + the old "items" prop ----
import type { CountryMeta as ResidencyCountry } from "@/lib/residency-content";
import type { CountryMeta as CitizenshipCountry } from "@/lib/citizenship-content";
import type { CountryMeta as SkilledCountry } from "@/lib/skilled-content";
import type { CountryMeta as CorporateCountry } from "@/lib/corporate-content";

type AnyCountry =
  | ResidencyCountry
  | CitizenshipCountry
  | SkilledCountry
  | CorporateCountry;

type OldItem = {
  country: string;
  countrySlug: string;
  heroImage?: string;
  summary?: string;
  introPoints?: string[];
};

// ---- helpers ----
function baseFromCategory(cat?: AnyCountry["category"]) {
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

function nounFromCategory(cat?: AnyCountry["category"]) {
  switch (cat) {
    case "citizenship":
      return "Citizenship";
    case "skilled":
      return "Skilled";
    case "corporate":
      return "Residency";
    case "residency":
    default:
      return "Residency";
  }
}

function truncateWords(text = "", maxWords = 15) {
  const words = (text || "").trim().split(/\s+/);
  return words.length <= maxWords
    ? (text || "").trim()
    : words.slice(0, maxWords).join(" ") + "…";
}

function normalizeImageSrc(src?: string, fallback = "/og.jpg") {
  const val = (src && src.trim()) || fallback;
  if (/^https?:\/\//i.test(val) || val.startsWith("/")) return val;
  return `/${val.replace(/^\/+/, "")}`;
}

// ---- Component ----
export default function CountryCarousel({
  /** New generic prop (recommended) */
  countries,
  /** Back-compat with your old usage */
  items,
  /** Header bits (old UI) */
  title = "Residency by Country",
  description = "Discover trusted residency pathways across popular countries.",
  ctaText = "View all countries",
  ctaHref,
  /** NEW: size presets restored */
  variant = "standard",
}: {
  countries?: (AnyCountry | null | undefined)[];
  items?: OldItem[]; // legacy
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: "compact" | "standard" | "plush";
}) {
  const railRef = useRef<HTMLDivElement>(null);

  // Normalize both shapes into one list the card can render
  const list = (
    (countries && countries.filter(Boolean)) ||
    (items && items.filter(Boolean)) ||
    []
  ) as (AnyCountry | OldItem)[];

  if (!list.length) return null;

  // If no ctaHref passed, derive from the first item's category (default to residency)
  const derivedBase =
    "category" in (list[0] as any)
      ? baseFromCategory((list[0] as any).category)
      : "/residency";
  const viewAllHref = ctaHref || derivedBase;

  // preset sizes per variant (image height only; cards equalize via layout below)
  const imgHeight =
    variant === "compact" ? "h-40 sm:h-44" : variant === "plush" ? "h-56 sm:h-60" : "h-48 sm:h-52";

  const scrollOne = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("div[data-card]") as HTMLElement | null;
    if (!card) return;
    const unit = card.getBoundingClientRect().width + 24; // 24px gap
    rail.scrollBy({ left: dir * unit, behavior: "smooth" });
  };

  return (
    <section className="max-w-screen-xl mx-auto py-6 px-4">
      {/* Header with arrows */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight text-light_text dark:text-dark_text">
            {title}
          </h2>
          <p className="text-base md:text-lg text-section dark:text-dark_border mb-6 leading-relaxed">
            {description}
          </p>
          <Link
            href={viewAllHref}
            className="inline-block px-6 py-2.5 rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg hover:bg-primary hover:text-white transition text-sm md:text-base font-medium text-light_text dark:text-dark_text shadow-sm"
          >
            {ctaText}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => scrollOne(-1)}
            aria-label="Scroll countries left"
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft size={22} className="text-black dark:text-white" />
          </button>
          <button
            onClick={() => scrollOne(1)}
            aria-label="Scroll countries right"
            className="w-12 h-12 flex items-center justify-center rounded-full shadow-md 
              bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ChevronRight size={22} className="text-black dark:text-white" />
          </button>
        </div>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        className="flex flex-nowrap items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pe-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((raw, idx) => {
          // unify fields whether it's AnyCountry or OldItem
          const isNew = "category" in (raw as any);
          const country = (raw as any).country || (raw as any).title || "Country";
          const countrySlug = (raw as any).countrySlug || "country";
          const heroImage =
            (raw as any).heroImage ||
            `/images/countries/${countrySlug}-hero-poster.jpg`;
          const summary = (raw as any).summary;
          const introPoints = (raw as any).introPoints || [];

          const base = isNew
            ? baseFromCategory((raw as any).category)
            : derivedBase;

          const href = `${base}/${countrySlug}`;
          const chips = (introPoints as string[]).slice(0, 2);
          const ctaNoun = isNew ? nounFromCategory((raw as any).category) : "Residency";

          return (
            <div
              key={`${countrySlug}-${idx}`}
              data-card
              className="flex-none snap-start basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <article className="h-full flex flex-col rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg shadow-sm hover:shadow-md transition">
                {/* Image (fixed height per variant) */}
                <Link href={href} aria-label={`${country} ${ctaNoun}`}>
                  <div className={`relative ${imgHeight} rounded-t-2xl overflow-hidden`}>
                    <Image
                      src={normalizeImageSrc(heroImage, `/images/${countrySlug}.jpg`)}
                      alt={`${country} image`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      unoptimized
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                </Link>

                {/* Content (equal-height section) */}
                <div className="flex flex-1 flex-col px-4 py-3">
                  <h3 className="text-base sm:text-lg font-semibold leading-tight text-light_text dark:text-dark_text">
                    <Link
                      href={href}
                      className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                    >
                      {country}
                    </Link>
                  </h3>

                  {/* Summary: clamp to 2 lines, reserve height */}
                  <p className="mt-1 text-sm text-light_grey dark:text-dark_border leading-6 line-clamp-2 min-h-[44px]">
                    {truncateWords(
                      summary || `${ctaNoun} pathways in ${country}.`,
                      20
                    )}
                  </p>

                  {/* Chips: reserve vertical space even if empty */}
                  <div className="mt-2 min-h-[28px]">
                    {!!chips.length && (
                      <div className="flex flex-wrap gap-2">
                        {chips.map((t, i) => (
                          <span
                            key={i}
                            className="rounded-full bg-neutral-50 dark:bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA (push to bottom) */}
                  <div className="pt-4 mt-auto w-full border-t">
                    <Link
                      href={href}
                      className="group w-full flex items-center text-base font-bold tracking-wide 
                      text-primary dark:text-neutral-100 transition-all duration-300"
                    >
                      <span>Explore {country} {ctaNoun}</span>
                      <span className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
        <div className="flex-none w-1" />
      </div>
    </section>
  );
}
