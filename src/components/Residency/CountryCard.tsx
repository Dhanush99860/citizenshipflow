// src/components/Residency/CountryCard.tsx
import Link from "next/link";
import Image from "next/image";
import React from "react";

// --- accept all verticals without changing UI ---
import type { CountryMeta as ResidencyCountry } from "@/lib/residency-content";
import type { CountryMeta as CitizenshipCountry } from "@/lib/citizenship-content";
import type { CountryMeta as SkilledCountry } from "@/lib/skilled-content";
import type { CountryMeta as CorporateCountry } from "@/lib/corporate-content";

type AnyCountry =
  | ResidencyCountry
  | CitizenshipCountry
  | SkilledCountry
  | CorporateCountry;

type Variant = "compact" | "standard" | "plush";

/* ---------------- utils ---------------- */
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

function ensureAbsoluteForImage(src?: string) {
  if (!src) return undefined;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  )
    return src;
  return `/${src.replace(/^\.?\/*/, "")}`;
}

function fmtCurrency(amount?: number, cur = "USD") {
  if (typeof amount !== "number") return "Varies";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: cur.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${cur.toUpperCase()}`;
  }
}
function plural(n?: number, s = "mo") {
  if (typeof n !== "number") return "Varies";
  return `${n} ${s}${n === 1 ? "" : "s"}`;
}

/* ---------------- component ---------------- */
export default function CountryCard({
  country,
  variant = "standard",
}: {
  country: AnyCountry;
  variant?: Variant;
}) {
  // sizes keep your old API but the rest of the UI matches CountryCardPro
  const sizes = {
    compact: { pad: "p-3", imgAspect: "aspect-[6/3]" },
    standard: { pad: "p-4", imgAspect: "aspect-[16/10] sm:aspect-[4/3]" },
    plush: { pad: "p-5", imgAspect: "aspect-[16/9] sm:aspect-[4/3]" },
  }[variant];

  // Pull common fields (tolerant to vertical meta differences)
  const title = (country as any).title as string;
  const summary = (country as any).summary as string | undefined;
  const heroImage = ensureAbsoluteForImage(
    (country as any).heroImage as string | undefined,
  );
  const minInvestment = (country as any).minInvestment as number | undefined;
  const currency = ((country as any).currency as string | undefined) || "USD";
  const timelineMonths = (country as any).timelineMonths as number | undefined;
  const tags = ((country as any).tags as string[] | undefined) || [];

  // Safe URL compute; if missing, render non-link card
  const computedHref = country?.countrySlug
    ? `${baseFromCategory(country.category)}/${country.countrySlug}`
    : undefined;

  const price = fmtCurrency(minInvestment, currency);
  const time = plural(timelineMonths, "mo");

  const headingId = React.useId();
  const descId = React.useId();

  const CardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const common = [
      "group block overflow-hidden rounded-2xl",
      "bg-white dark:bg-neutral-900",
      "ring-1 ring-neutral-200/90 dark:ring-neutral-800/90",
      "shadow-sm hover:shadow-lg transition hover:-translate-y-0.5 motion-reduce:transform-none",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70",
    ].join(" ");

    return computedHref ? (
      <Link
        href={computedHref}
        aria-labelledby={headingId}
        aria-describedby={summary ? descId : undefined}
        className={common}
      >
        {children}
      </Link>
    ) : (
      <div
        role="group"
        aria-labelledby={headingId}
        aria-describedby={summary ? descId : undefined}
        className={common}
      >
        {children}
      </div>
    );
  };

  return (
    <CardShell>
      {/* SEO microdata lives inside to work for both link/non-link shells */}
      <article itemScope itemType="https://schema.org/Product">
        {computedHref ? <meta itemProp="url" content={computedHref} /> : null}
        <meta itemProp="name" content={title} />
        {summary ? <meta itemProp="description" content={summary} /> : null}
        {typeof minInvestment === "number" ? (
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="hidden"
          >
            <meta itemProp="priceCurrency" content={currency.toUpperCase()} />
            <meta itemProp="price" content={String(minInvestment)} />
            <link itemProp="availability" href="https://schema.org/InStock" />
          </div>
        ) : null}

        {/* Hero */}
        <div
          className={[
            "relative w-full overflow-hidden",
            sizes.imgAspect,
            "bg-neutral-100 dark:bg-neutral-800",
          ].join(" ")}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt={`${title} hero image`}
              fill
              loading="lazy"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full grid place-items-center">
              <span className="text-xs text-neutral-600 dark:text-neutral-300">
                Program
              </span>
            </div>
          )}

          {/* soft overlay & badge */}
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          <span
            className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/85 px-2 py-1 text-[11px] font-medium text-neutral-900 ring-1 ring-neutral-200 backdrop-blur
                       dark:bg-neutral-900/70 dark:text-neutral-100 dark:ring-neutral-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
            Residency
          </span> */}
        </div>

        {/* Body */}
        <div className={["", sizes.pad].join(" ")}>
          <h3
            id={headingId}
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            {title}
          </h3>
          {summary ? (
            <p
              id={descId}
              className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2"
            >
              {summary}
            </p>
          ) : null}

          {/* Key metrics (parity with CountryCardPro) */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
            <div className="rounded-xl p-2 bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {price}
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Min investment
              </div>
            </div>
            <div className="rounded-xl p-2 bg-neutral-50 dark:bg-neutral-900 ring-1 ring-neutral-200 dark:ring-neutral-800">
              <div className="font-medium text-neutral-900 dark:text-neutral-100">
                {time}
              </div>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Typical timeline
              </div>
            </div>
          </div>

          {/* Tags (optional) */}
          {!!tags.length && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]
                             bg-white text-neutral-900 ring-1 ring-neutral-200
                             dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </CardShell>
  );
}
