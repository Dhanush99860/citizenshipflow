// src/components/Citizenship/CountryCardPro.tsx
import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  title: string;
  summary?: string;
  heroImage?: string;
  country?: string;
  visaFreeCount?: number;
  passportRank?: number;
  minInvestment?: number;
  currency?: string; // e.g. USD
  timelineMonths?: number; // typical processing
  tags?: string[];
  className?: string;
};

/* ---------------- utils ---------------- */
function ensureAbsolute(src?: string) {
  if (!src) return undefined;
  return src.startsWith("/") ? src : `/${src.replace(/^\.?\/*/, "")}`;
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
function plural(n: number, s: string) {
  return `${n} ${s}${n === 1 ? "" : "s"}`;
}

/* ---------------- component ---------------- */
export default function CountryCardPro({
  href,
  title,
  summary,
  heroImage,
  country,
  visaFreeCount,
  passportRank,
  minInvestment,
  currency = "USD",
  timelineMonths,
  tags = [],
  className = "",
}: Props) {
  const price = fmtCurrency(minInvestment, currency);
  const time =
    typeof timelineMonths === "number"
      ? plural(timelineMonths, "mo")
      : "Varies";
  const normalized = ensureAbsolute(heroImage);
  const hId = React.useId();
  const dId = React.useId();

  return (
    <Link
      href={href}
      aria-labelledby={hId}
      aria-describedby={summary ? dId : undefined}
      className={[
        "group block overflow-hidden rounded-2xl",
        "bg-white dark:bg-neutral-900",
        "ring-1 ring-neutral-200/90 dark:ring-neutral-800/90",
        "shadow-sm hover:shadow-lg transition hover:-translate-y-0.5 motion-reduce:transform-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70",
        className,
      ].join(" ")}
    >
      {/* Microdata lives on <article> to keep TS happy while the whole card stays clickable */}
      <article itemScope itemType="https://schema.org/Product">
        <meta itemProp="url" content={href} />
        {country ? <meta itemProp="brand" content={country} /> : null}
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

        {/* ---------- Hero ---------- */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {normalized ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={normalized}
              alt={`${title}${country ? ` — ${country}` : ""}`}
              decoding="async"
              loading="lazy"
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={(e) => {
                e.currentTarget.src = "/og.jpg";
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 grid place-items-center">
              <span className="text-xs text-neutral-700/80 dark:text-neutral-200/80">
                {country || "Program"}
              </span>
            </div>
          )}

          {/* overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          {country ? (
            <span
              className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/85 px-2 py-1 text-[11px] font-medium text-neutral-900 ring-1 ring-neutral-200 backdrop-blur
                         dark:bg-neutral-900/70 dark:text-neutral-100 dark:ring-neutral-700"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-blue-600"
                aria-hidden
              />
              {country}
            </span>
          ) : null}
        </div>

        {/* ---------- Body ---------- */}
        <div className="p-4 sm:p-5">
          <h3
            id={hId}
            className="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
          >
            {title}
          </h3>
          {summary ? (
            <p
              id={dId}
              className="mt-1 text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2"
            >
              {summary}
            </p>
          ) : null}

          {/* Key metrics */}
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

          {passportRank || visaFreeCount ? (
            <div className="mt-2 grid grid-cols-2 gap-2 text-[13px]">
              <div className="rounded-xl p-2 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {passportRank ?? "—"}
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Passport rank
                </div>
              </div>
              <div className="rounded-xl p-2 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {visaFreeCount ?? "—"}
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Visa-free countries
                </div>
              </div>
            </div>
          ) : null}

          {/* Tags */}
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
    </Link>
  );
}
