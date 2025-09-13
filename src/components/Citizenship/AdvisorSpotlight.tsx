import Link from "next/link";
import React from "react";

type Props = {
  title?: string;
  subtitle?: string;
  advisorName?: string;
  role?: string;
  avatarSrc?: string; // optional image url
  bookingUrl?: string;
  brochureUrl?: string;
  className?: string;
};

export default function AdvisorSpotlight({
  title = "Talk to a senior advisor",
  subtitle = "Confidential consultation on eligibility, timelines, and project selection.",
  advisorName = "Senior Advisor",
  role = "Citizenship by Investment",
  avatarSrc,
  bookingUrl = "/PersonalBooking",
  brochureUrl,
  className = "",
}: Props) {
  return (
    <section className={`rounded-2xl bg-white/80 dark:bg-neutral-900/40 ring-1 ring-neutral-200 dark:ring-neutral-800 p-6 sm:p-7 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden bg-gradient-to-br from-emerald-300 to-cyan-300 dark:from-emerald-700 dark:to-cyan-700">
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt={advisorName} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm opacity-80 mt-1">{subtitle}</p>
          <p className="mt-1 text-xs opacity-70">
            {advisorName} · {role}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href={bookingUrl} className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
              Book Consultation
            </Link>
            {brochureUrl ? (
              <a href={brochureUrl} download className="rounded-xl ring-1 ring-neutral-300 dark:ring-neutral-700 bg-white/80 dark:bg-neutral-900 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                Download Brochure
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
