// src/components/Residency/CountryCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";

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
  region?: string; // optional (for filter)
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

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

// ---- Component ----
export default function CountryCarousel({
  /** New generic prop (recommended) */
  countries,
  /** Back-compat with your old usage */
  items,
  /** Header bits */
  title = "Residency by Country",
  description = "Discover trusted residency pathways across popular countries.",
  ctaText = "Browse all countries",
  ctaHref,
  /** Image size presets for cards */
  variant = "standard",
  /** Layouts: 'carousel' (old) or 'featureList' (custom 3+5 layout) */
  layout = "carousel",

  /** ===== FeatureList UX controls ===== */
  showSearch = true,
  showRegionFilter = true,
  /** right-side initial list size (mobile/desktop) and reveal step */
  rightInitialMobile = 5,
  rightInitialDesktop = 10,
  rightRevealStep = 10,
  /** Optional JSON-LD ItemList */
  seoItemListJsonLd = false,
}: {
  countries?: (AnyCountry | null | undefined)[]; // preferred
  items?: OldItem[]; // legacy shape
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  variant?: "compact" | "standard" | "plush";
  layout?: "carousel" | "featureList";

  // FeatureList extras
  showSearch?: boolean;
  showRegionFilter?: boolean;
  rightInitialMobile?: number;
  rightInitialDesktop?: number;
  rightRevealStep?: number;
  seoItemListJsonLd?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  // Normalize both shapes into one list the card can render
  const list = ((countries && countries.filter(Boolean)) ||
    (items && items.filter(Boolean)) ||
    []) as (AnyCountry | OldItem)[];

  if (!list.length) return null;

  // If no ctaHref passed, derive from the first item's category (default to residency)
  const derivedBase =
    "category" in (list[0] as any)
      ? baseFromCategory((list[0] as any).category)
      : "/residency";
  const viewAllHref = ctaHref || derivedBase;

  // preset sizes per variant (image height only)
  const imgHeight =
    variant === "compact"
      ? "h-40 sm:h-44"
      : variant === "plush"
      ? "h-56 sm:h-60"
      : "h-48 sm:h-52";

  const scrollOne = (dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("div[data-card]") as HTMLElement | null;
    if (!card) return;
    const unit = card.getBoundingClientRect().width + 24; // 24px gap
    rail.scrollBy({ left: dir * unit, behavior: "smooth" });
  };

  // ===== FEATURE LIST LAYOUT (custom: left 3, right 5) =====
  if (layout === "featureList") {
    // split: left shows 3 -> 1 hero + 2 small
    const [first, second, third, ...restAll] = list;

    // unify fields for hero
    const isNew = first && "category" in (first as any);
    const country = (first as any)?.country || (first as any)?.title || "Country";
    const countrySlug = (first as any)?.countrySlug || "country";
    const heroImage =
      (first as any)?.heroImage || `/images/countries/${countrySlug}-hero-poster.jpg`;
    const summary = (first as any)?.summary;
    const introPoints = ((first as any)?.introPoints || []).slice(0, 3) as string[];

    const base = isNew ? baseFromCategory((first as any).category) : derivedBase;
    const href = `${base}/${countrySlug}`;
    const ctaNoun = isNew ? nounFromCategory((first as any).category) : "Residency";

    // right column state
    const [query, setQuery] = useState("");
    const allRegions = useMemo(
      () =>
        ["All"].concat(
          uniq(
            restAll
              .map((r: any) => (r?.region || "").trim())
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b)),
          ),
        ),
      [restAll],
    );
    const [region, setRegion] = useState<string>(allRegions[0] || "All");
    const [visible, setVisible] = useState(rightInitialMobile);

    // responsive initial visible count
    useEffect(() => {
      const m = window.matchMedia("(min-width: 768px)");
      const apply = () =>
        setVisible(m.matches ? rightInitialDesktop : rightInitialMobile);
      apply();
      m.addEventListener("change", apply);
      return () => m.removeEventListener("change", apply);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rightInitialDesktop, rightInitialMobile]);

    // filter list for the right side (starts after the first 3)
    const filtered = useMemo(() => {
      const q = query.trim().toLowerCase();
      return restAll.filter((raw: any) => {
        const name = (raw?.country || raw?.title || "").toLowerCase();
        const slug = (raw?.countrySlug || "").toLowerCase();
        const reg = (raw?.region || "All").toLowerCase();
        const passRegion = region === "All" || reg === region.toLowerCase();
        const passText = !q || name.includes(q) || slug.includes(q);
        return passRegion && passText;
      });
    }, [restAll, query, region]);

    // reset visible when filters change
    useEffect(() => {
      setVisible((v) =>
        Math.max(v, Math.min(rightInitialMobile, filtered.length)),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, region]);

    const canShowMore = visible < filtered.length;

    // small-card builder (second & third)
    function SmallCard({ raw }: { raw: any }) {
      const isN = "category" in (raw as any);
      const ctry = raw?.country || raw?.title || "Country";
      const slug = raw?.countrySlug || "country";
      const img =
        raw?.heroImage || `/images/countries/${slug}-hero-poster.jpg`;
      const sum = raw?.summary;
      const base2 = isN ? baseFromCategory(raw.category) : derivedBase;
      const href2 = `${base2}/${slug}`;
      const noun = isN ? nounFromCategory(raw.category) : "Residency";

      return (
        <article className="h-full flex flex-col rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg shadow-sm hover:shadow-md transition">
          <Link href={href2} aria-label={`${ctry} ${noun}`}>
            <div className="relative h-40 sm:h-44 rounded-t-2xl overflow-hidden">
              <Image
                src={normalizeImageSrc(img, `/images/${slug}.jpg`)}
                alt={`${ctry} image`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 33vw"
                loading="lazy"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
            </div>
          </Link>
          <div className="flex flex-1 flex-col px-4 py-3">
            <h4 className="text-base font-semibold leading-tight text-light_text dark:text-dark_text">
              <Link
                href={href2}
                className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                {ctry}
              </Link>
            </h4>
            <p className="mt-1 text-sm text-light_grey dark:text-dark_border leading-6 line-clamp-2">
              {truncateWords(sum || `${noun} pathways in ${ctry}.`, 22)}
            </p>
            <div className="pt-3 mt-auto w-full border-t">
              <Link
                href={href2}
                className="group inline-flex items-center text-sm font-bold tracking-wide text-primary dark:text-neutral-100"
              >
                <span>Explore</span>
                <span className="ml-1 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </article>
      );
    }

    // SEO: optional ItemList JSON-LD (hero + currently visible right list)
    const jsonLd =
      seoItemListJsonLd &&
      (() => {
        const visibleLinks = filtered.slice(0, visible).map((r: any) => {
          const base2 = "category" in r ? baseFromCategory(r.category) : derivedBase;
          return {
            name: r.country || r.title || "Country",
            url: `${base2}/${r.countrySlug || "country"}`,
          };
        });
        return {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [{ name: country, url: href }, ...visibleLinks].map(
            (it, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: it.name,
              url: it.url,
            }),
          ),
        };
      })();

    return (
      <section className="max-w-screen-xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-light_text dark:text-dark_text">
            {title}
          </h2>
          <p className="mt-2 text-base md:text-lg text-section dark:text-dark_border leading-relaxed">
            {description}
          </p>
        </div>

        {/* Grid: Left = 3 cards (1 big + 2 small); Right = list + controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: 3-up column */}
          <div className="md:col-span-2">
            {/* Hero (top 1) */}
            <article className="mb-6 flex flex-col rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg shadow-sm hover:shadow-md transition">
              <Link href={href} aria-label={`${country} ${ctaNoun}`}>
                <div className="relative h-64 sm:h-72 lg:h-[420px] rounded-t-2xl overflow-hidden">
                  <Image
                    src={normalizeImageSrc(heroImage, `/images/${countrySlug}.jpg`)}
                    alt={`${country} image`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 66vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                </div>
              </Link>

              <div className="flex flex-1 flex-col px-5 py-4">
                <h3 className="text-lg sm:text-xl font-semibold leading-tight text-light_text dark:text-dark_text">
                  <Link
                    href={href}
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    {country}
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-light_grey dark:text-dark_border leading-7">
                  {truncateWords(summary || `${ctaNoun} pathways in ${country}.`, 36)}
                </p>

                {!!introPoints.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {introPoints.map((t, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-neutral-50 dark:bg-neutral-700 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mobile-only: browse all button near hero */}
                <div className="md:hidden mt-4">
                  <Link
                    href={viewAllHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg px-4 py-2.5 text-sm font-medium hover:bg-primary hover:text-white transition"
                  >
                    {ctaText} ({list.length})
                  </Link>
                </div>

                <div className="pt-4 mt-auto w-full border-t">
                  <Link
                    href={href}
                    className="group inline-flex items-center text-base font-bold tracking-wide text-primary dark:text-neutral-100 transition-all duration-300"
                  >
                    <span>Explore {country} {ctaNoun}</span>
                    <span className="ml-2 inline-block transform transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>

            {/* Below hero: 2 small cards in a 1→2 responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {second && <SmallCard raw={second} />}
              {third && <SmallCard raw={third} />}
            </div>
          </div>

          {/* RIGHT: filters + vertical list (sticky) */}
          <aside className="md:col-span-1 lg:sticky lg:top-6 self-start">
            <div className="rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg p-3 mb-3">
              <div className="grid grid-cols-1 gap-2">
                {showSearch && (
                  <div>
                    <label className="sr-only" htmlFor="country-search">Search countries</label>
                    <input
                      id="country-search"
                      aria-describedby="country-search-hint"
                      placeholder="Search countries by name…"
                      className="w-full rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      inputMode="search"
                    />
                    <p id="country-search-hint" className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Tip: type a few letters (e.g., “domi” for Dominica).
                    </p>
                  </div>
                )}

                {showRegionFilter && allRegions.length > 1 && (
                  <div>
                    <label className="sr-only" htmlFor="country-region">Filter by region</label>
                    <select
                      id="country-region"
                      className="w-full rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      {allRegions.map((r) => (
                        <option key={r} value={r}>
                          {r === "All" ? "All regions" : r}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Desktop CTA placed with the browsing controls */}
                <div className="hidden md:block">
                  <Link
                    href={viewAllHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg px-4 py-2.5 text-sm font-medium hover:bg-primary hover:text-white transition"
                  >
                    {ctaText} ({list.length})
                  </Link>
                </div>
              </div>

              {/* Result count */}
              <div aria-live="polite" className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">
                Showing <strong>{Math.min(visible, filtered.length)}</strong> of{" "}
                <strong>{filtered.length}</strong>
              </div>
            </div>

            {/* List (5 visible by default on mobile) */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg p-6 text-sm text-neutral-600 dark:text-neutral-300">
                No countries match your search. Try another term or clear filters.
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {filtered.slice(0, visible).map((raw, idx) => {
                    const isN = "category" in (raw as any);
                    const ctry = (raw as any).country || (raw as any).title || "Country";
                    const slug = (raw as any).countrySlug || "country";
                    const img =
                      (raw as any).heroImage ||
                      `/images/countries/${slug}-hero-poster.jpg`;
                    const sum = (raw as any).summary;
                    const base2 = isN ? baseFromCategory((raw as any).category) : derivedBase;
                    const href2 = `${base2}/${slug}`;
                    const noun = isN ? nounFromCategory((raw as any).category) : "Residency";

                    return (
                      <li key={`${slug}-${idx}`}>
                        <Link
                          href={href2}
                          className="group flex items-center gap-3 rounded-xl border border-border dark:border-dark_border bg-light_bg dark:bg-dark_bg p-3 hover:shadow-sm transition"
                        >
                          <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-none">
                            <Image
                              src={normalizeImageSrc(img, `/images/${slug}.jpg`)}
                              alt={`${ctry} image`}
                              fill
                              className="object-cover"
                              sizes="112px"
                              loading="lazy"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-semibold text-light_text dark:text-dark_text truncate">
                                {ctry}
                              </h4>
                              <span className="text-base opacity-0 group-hover:opacity-100 transition">
                                →
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-light_grey dark:text-dark_border leading-5 line-clamp-2">
                              {truncateWords(sum || `${noun} pathways in ${ctry}.`, 18)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {canShowMore && (
                  <div className="mt-4">
                    <button
                      onClick={() => setVisible((v) => v + rightRevealStep)}
                      className="w-full rounded-xl border border-border dark:border-dark_border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>
        </div>

        {/* Optional: JSON-LD */}
        {seoItemListJsonLd && jsonLd && (
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </section>
    );
  }

  // ===== CAROUSEL LAYOUT (existing) =====
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
            href={ctaHref || derivedBase}
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
          const country =
            (raw as any).country || (raw as any).title || "Country";
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
          const ctaNoun = isNew
            ? nounFromCategory((raw as any).category)
            : "Residency";

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
                      src={normalizeImageSrc(
                        heroImage,
                        `/images/${countrySlug}.jpg`,
                      )}
                      alt={`${country} image`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      loading={idx === 0 ? "eager" : "lazy"}
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
                      20,
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
                      <span>
                        Explore {country} {ctaNoun}
                      </span>
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
