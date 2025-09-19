"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useCurrency } from "@/lib/CurrencyProvider"; // <— global currency

type PriceOption =
  | {
      id: string;
      label: string;
      // numeric amount in baseCurrency (recommended for auto-convert)
      amount: number;
      best?: boolean;
      bullets?: string[];
    }
  | {
      id: string;
      label: string;
      // fallback: literal string price if you don’t want auto-convert
      price: string;
      best?: boolean;
      bullets?: string[];
    };

type Props = {
  // Person
  advisorName?: string;
  role?: string;
  avatarSrc?: string;
  credentials?: string;
  languages?: string;
  timezone?: string;

  // Copy
  title?: string;
  subtitle?: string;

  // Social proof
  rating?: number;
  reviewsCount?: number;
  clientsServed?: number;
  testimonials?: { quote: string; name: string }[];

  // Pricing (baseCurrency only matters when using numeric “amount”)
  baseCurrency?: "USD" | "INR" | "AED" | "EUR";
  priceOptions?: PriceOption[];
  currencyNote?: string;
  highDemandHint?: string;

  // CTAs
  bookingUrl?: string;
  brochureUrl?: string;

  // Trust / payments
  paymentNote?: string;
  guaranteeNote?: string;
  complianceNote?: string;

  rightGraphic?: boolean;
  className?: string;
};

function cx(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdvisorConsultationCard({
  advisorName = "Varun Singh",
  role = "CBI & RBI — Caribbean",
  avatarSrc = "/images/avtar/varun-singh.png",
  credentials = "Ex-Big4 • 12+ yrs CBI/RBI",
  languages = "English • Hindi • Arabic",
  timezone = "Gulf / IST friendly",

  title = "Talk to a senior CBI advisor",
  subtitle = "Personal, paid session on eligibility, timelines, and project selection — fully confidential.",

  rating = 4.9,
  reviewsCount = 312,
  clientsServed = 1200,
  testimonials = [
    { quote: "Clear, actionable advice. We decided in one call.", name: "R.K., Dubai" },
    { quote: "No sales push — just facts and next steps.", name: "S.P., Singapore" },
  ],

  baseCurrency = "INR",
  priceOptions = [
    { id: "std", label: "45–60 mins", amount: 15500, best: true, bullets: [
      "Eligibility triage & risk pointers",
      "Donation vs real-estate comparison",
      "Project shortlist & document checklist",
    ]},
    { id: "deep", label: "90 mins (in-depth)", amount: 25500, bullets: [
      "Everything in Standard",
      "File strategy & timeline modelling",
      "Follow-up summary & action plan",
    ]},
  ],
  currencyNote = "Prices auto-convert to your selected currency",
  highDemandHint = "High demand this week",

  bookingUrl = "/PersonalBooking",
  brochureUrl,

  paymentNote = "UPI • Cards • Bank Wire",
  guaranteeNote = "If we can’t help, we’ll say so — no upsell.",
  complianceNote = "Advisory only; not legal/financial advice. Subject to KYC & eligibility.",

  rightGraphic = true,
  className = "",
}: Props) {
  const { currency, convert } = useCurrency(); // ← from provider
  const [openWhyPaid, setOpenWhyPaid] = React.useState(false);

  const [selected, setSelected] = React.useState<string>(
    (priceOptions.find((p: any) => p.best)?.id as string) || (priceOptions[0] as any).id
  );
  const current = priceOptions.find((p: any) => p.id === selected)!;

  // helper: show price either from numeric “amount” (auto-convert) or literal “price”
  function showPrice(p: PriceOption) {
    if ("amount" in p) {
      const converted = convert(p.amount, baseCurrency, currency);
      return formatMoney(converted, currency);
    }
    return p.price;
  }

  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-2xl p-6 sm:p-8",
        "bg-white/80 dark:bg-neutral-900/40 ring-1 ring-neutral-200 dark:ring-neutral-800 backdrop-blur",
        "shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      aria-labelledby="advisor-card-title"
    >
      {/* Decorative gradient */}
      {rightGraphic && (
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl" />
      )}

      {/* Price strip */}
      <div className="mb-5 -mt-1 -mx-1 flex items-center justify-between rounded-lg bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300 px-3 py-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <BadgeDollar className="h-4 w-4" />
          <span>Paid 1:1 consultation</span>
          <Dot />
          <span>{(current as any).label}</span>
          <Dot />
          <strong>{showPrice(current)}</strong>
        </div>
        <span className="hidden sm:inline text-xs">{highDemandHint}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        {/* LEFT: person & trust */}
        <div>
          <div className="flex gap-4">
            

            <div className="min-w-0">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900">
              <Image src={avatarSrc} alt={advisorName} fill sizes="96px" className="object-cover" />
            </div>
              <h3 id="advisor-card-title" className="text-xl font-semibold tracking-tight pt-3">
                {title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{subtitle}</p>
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {advisorName} — {role}
              </p>

              {/* chips */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Chip icon={<BadgeId className="h-3.5 w-3.5" />}>{credentials}</Chip>
                <Chip icon={<GlobeIcon className="h-3.5 w-3.5" />}>{languages}</Chip>
                <Chip icon={<ClockIcon className="h-3.5 w-3.5" />}>{timezone}</Chip>
              </div>

              {/* social proof */}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                <Chip tone="success" icon={<StarIcon className="h-3.5 w-3.5" />}>
                  {rating.toFixed(1)} · {reviewsCount.toLocaleString()} reviews
                </Chip>
                <Chip icon={<ShieldIcon className="h-3.5 w-3.5" />}>Confidential & secured</Chip>
                <Chip icon={<UsersIcon className="h-3.5 w-3.5" />}>
                  {clientsServed.toLocaleString()}+ clients served
                </Chip>
              </div>
            </div>
          </div>

          {/* Why paid? */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setOpenWhyPaid((v) => !v)}
              aria-expanded={openWhyPaid}
              className="inline-flex items-center gap-2 text-sm underline underline-offset-2 text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <InfoIcon className="h-4 w-4" />
              Why is it paid?
            </button>

            {openWhyPaid && (
              <div className="mt-3 rounded-lg ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-3 text-sm text-neutral-700 dark:text-neutral-300">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Senior-level time focused on your case — not a sales call.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Clear answers on eligibility, risk/compliance, and route trade-offs.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                    Follow-up summary so you can act with confidence.
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* testimonials */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {testimonials.slice(0, 2).map((t, i) => (
              <figure key={i} className="rounded-xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/60 p-3">
                <blockquote className="text-sm text-neutral-700 dark:text-neutral-300">“{t.quote}”</blockquote>
                <figcaption className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* RIGHT: options + CTAs */}
        <div className="relative rounded-xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/80 dark:bg-neutral-900/60 p-4 sm:p-5 overflow-hidden">
          {rightGraphic && (
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-300/40 to-cyan-400/20 blur-xl" />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {priceOptions.map((opt: any) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                aria-pressed={selected === opt.id}
                className={cx(
                  "w-full text-left rounded-lg px-4 py-3 ring-1 transition",
                  selected === opt.id
                    ? "bg-emerald-50 ring-emerald-400 text-neutral-900 dark:bg-emerald-900/20 dark:text-white dark:ring-emerald-700"
                    : "bg-white ring-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:ring-neutral-800"
                )}
              >
                <div className="flex items-center gap-2">
                  {opt.best && <Badge className="bg-emerald-600 text-white">Popular</Badge>}
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                <div className="mt-1 text-base font-semibold">{showPrice(opt)}</div>
                {!!opt.bullets?.length && (
                  <ul className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                    {opt.bullets.slice(0, 3).map((b: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <DotSmall />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{currencyNote}</p>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{highDemandHint}</p>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Link
              href={bookingUrl}
              className={cx(
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
                "bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              )}
              aria-label={`Book ${"label" in current ? (current as any).label : "consultation"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Book consultation
            </Link>

            {brochureUrl && (
              <a
                href={brochureUrl}
                download
                className={cx(
                  "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
                  "bg-white text-neutral-800 hover:bg-neutral-100 ring-1 ring-neutral-300",
                  "dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:ring-neutral-700"
                )}
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download brochure
              </a>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-600 dark:text-neutral-300">
            <span className="inline-flex items-center gap-1"><LockIcon className="h-3.5 w-3.5" /> Secure checkout</span>
            <span className="inline-flex items-center gap-1"><PrivacyIcon className="h-3.5 w-3.5" /> Confidential</span>
            <span className="inline-flex items-center gap-1"><CreditCardIcon className="h-3.5 w-3.5" /> {paymentNote}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{guaranteeNote}</p>
        </div>
      </div>

      {complianceNote && (
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">{complianceNote}</p>
      )}
    </section>
  );
}

/* ——— Small UI bits ——— */
function Chip({ children, icon, tone = "neutral" }: { children: React.ReactNode; icon?: React.ReactNode; tone?: "neutral" | "success"; }) {
  const base = "inline-flex items-center gap-1 rounded-full ring-1 px-2.5 py-1";
  const styles = tone === "success"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800"
    : "bg-neutral-50 text-neutral-700 ring-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:ring-neutral-700";
  return <span className={cx(base, styles)}>{icon}{children}</span>;
}
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", className)}>{children}</span>;
}
function Dot() { return <span className="mx-1 inline-block h-1.5 w-1.5 rounded-full bg-current opacity-60" />; }
function DotSmall() { return <span className="mt-1 inline-block h-1 w-1 rounded-full bg-current opacity-70" />; }

/* ——— Inline SVG icons (ALL included, including GlobeIcon) ——— */
function BadgeDollar({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 1a1 1 0 011 1v1.07c2.28.2 4 1.6 4 3.43 0 1.97-1.76 3.05-4.36 3.47L10 10.2V13h3a1 1 0 110 2h-3v2.06c2.47.17 4 .97 4 2.44 0 1.64-1.84 2.76-4.25 2.89V22a1 1 0 11-2 0v-1.62c-2.28-.2-4-1.6-4-3.43 0-1.97 1.76-3.05 4.36-3.47L12 13.8V11H9a1 1 0 110-2h3V6.94c-2.47-.17-4-.97-4-2.44 0-1.64 1.84-2.76 4.25-2.89V2a1 1 0 011-1z"/></svg>;
}
function StarIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M10 1.5l2.472 5.007 5.528.804-4 3.896.944 5.506L10 13.99 5.056 16.713 6 11.207l-4-3.896 5.528-.804L10 1.5z"/></svg>;
}
function ShieldIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 2l7 4v6c0 5-3.5 9.74-7 10-3.5-.26-7-5-7-10V6l7-4z"/></svg>;
}
function UsersIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M16 11c1.66 0 2.99-1.79 2.99-4S17.66 3 16 3s-3 1.79-3 4 1.34 4 3 4zm-8 0c1.66 0 3-1.79 3-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
}
function ClockIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm.75 4.5a.75.75 0 10-1.5 0v4.25c0 .2.08.39.22.53l2.5 2.5a.75.75 0 101.06-1.06l-2.28-2.28V6.5z"/></svg>;
}
function CalendarIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM18 9H2v7a2 2 0 002 2h12a2 2 0 002-2V9z"/></svg>;
}
function DownloadIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M3 14a1 1 0 011-1h3v-5a1 1 0 112 0v5h3a1 1 0 011 1v3H3v-3zm8-9a1 1 0 10-2 0v3.586L7.707 7.293a1 1 0 10-1.414 1.414l3 3 .007.007a.996.996 0 00.7.286h.006a.996.996 0 00.7-.293l3-3a1 1 0 10-1.414-1.414L11 8.586V5z"/></svg>;
}
function InfoIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9a.75.75 0 111.5 0v5.25a.75.75 0 11-1.5 0V9zm.75-3.5a1 1 0 100-2 1 1 0 000 2z"/></svg>;
}
function LockIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M5 9V7a5 5 0 1110 0v2h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h2zm2-2v2h6V7a3 3 0 10-6 0z"/></svg>;
}
function PrivacyIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 2l8 4v6c0 5.5-3.9 10.7-8 12-4.1-1.3-8-6.5-8-12V6l8-4zm0 6a4 4 0 00-4 4v3h8v-3a4 4 0 00-4-4z"/></svg>;
}
function CreditCardIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v2H2V6zm0 4h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8zm3 5h6a1 1 0 010 2H5a1 1 0 010-2z"/></svg>;
}
function BadgeId({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}><path d="M7 2h10v2h3a1 1 0 011 1v15a2 2 0 01-2 2H5a2 2 0 01-2-2V5a1 1 0 011-1h3V2zm2 0v2h6V2H9zm-3 6h12v10H6V8zm2 2v2h4v-2H8zm0 3v2h6v-2H8z"/></svg>;
}
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.93 7H15.8c-.27-2.02-1.04-3.73-2.01-4.66A8.03 8.03 0 0117.93 9zM12 4.07C10.1 5.86 8.88 8.84 8.7 11h6.6c-.18 2.16-1.4 5.14-3.3 6.93A8.01 8.01 0 0112 4.07zM6.07 11h2.13c.27-2.02 1.04-3.73 2.01-4.66A8.03 8.03 0 006.07 11zm0 2a8.03 8.03 0 004.14 4.66c-.97-.93-1.74-2.64-2.01-4.66H6.07zM12 19.93c1.9-1.79 3.12-4.77 3.3-6.93H8.7c.18 2.16 1.4 5.14 3.3 6.93zM17.93 13a8.03 8.03 0 01-4.14 4.66c.97-.93 1.74-2.64 2.01-4.66h2.13z" />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden><path d="M7.629 13.314L3.95 9.636a1 1 0 011.414-1.415l2.265 2.265 6.007-6.008a1 1 0 111.415 1.415l-7.422 7.421a1 1 0 01-1.415 0z"/></svg>;
}
