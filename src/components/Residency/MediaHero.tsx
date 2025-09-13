"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

type Action = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
  download?: boolean;
};

function MobileCTABar({ actions }: { actions: Action[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Prefer Brochure / Appointment / Consultation; fallback to first two
  const preferred = actions.filter((a) =>
    /broch|appoint|consult/i.test(a.label)
  );
  const mobileActions = (preferred.length ? preferred : actions).slice(0, 2);

  if (mobileActions.length === 0) return null;

  return createPortal(
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-[999]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
    >
      <div className="mx-auto max-w-screen-sm px-3">
        <div className="flex w-full items-center gap-3 rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-2">
          {mobileActions.map((a) => {
            const base =
              "inline-flex flex-1 basis-1/2 items-center justify-center rounded-xl px-4 h-12 text-sm font-semibold transition";
            const styles =
              a.variant === "ghost"
                ? "bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50"
                : "bg-primary text-white hover:brightness-110";
            return (
              <Link
                key={`m-${a.label}`}
                href={a.href}
                prefetch={false}
                download={a.download}
                className={`${base} ${styles}`}
              >
                {a.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function MediaHero({
  title,
  subtitle,
  videoSrc,
  poster,
  imageSrc,
  actions = [],
}: {
  title: string;
  subtitle?: string;
  videoSrc?: string;
  poster?: string;
  imageSrc?: string;
  actions?: Action[];
}) {
  return (
    <header className="relative mb-4 overflow-hidden rounded-3xl">
      {/* MEDIA: mobile 16:9 like your reference; desktop keeps 16:7 */}
      <div className="relative w-full aspect-video md:aspect-[16/7] rounded-2xl md:rounded-3xl overflow-hidden">
        {videoSrc ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={poster}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slateGray" />
        )}
      </div>

      {/* DESKTOP overlay unchanged; hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10 hidden md:block" />
      <div className="absolute inset-0 hidden md:flex items-end">
        <div className="p-6 md:p-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-white/90">{subtitle}</p>}
            {!!actions.length && (
            <div className="mt-6 flex flex-wrap items-end gap-3 sm:gap-4">
              {actions.map((a) => {
                const base =
                  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
                const styles =
                  a.variant === "ghost"
                    ? "bg-white/20 text-white backdrop-blur ring-1 ring-inset ring-white/30 hover:bg-white/30"
                    : "bg-gradient-to-r from-blue-500 via-purple-600 to-fuchsia-600 text-white shadow-lg";
                return (
                  <Link
                    key={a.label}
                    href={a.href}
                    prefetch={false}
                    download={a.download}
                    className={`${base} ${styles}`}
                  >
                    {a.label}
                  </Link>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>

      {/* MOBILE floating CTA via portal */}
      <MobileCTABar actions={actions} />

    </header>
  );
}
