"use client";

import React from "react";
import Link from "next/link";
import { MiniAwardCard } from "./MiniAwardCard";
import type { Award } from "./awards.data";

type Props = {
  items: Award[];
  hrefAll?: string;
  className?: string;
  speed?: number;    // seconds per full loop
  limit?: number;
};

export function AwardsMarquee({
  items,
  hrefAll = "/awards",
  className = "mx-auto max-w-screen-2xl px-4 py-5",
  speed = 80,       // slower default
  limit,
}: Props) {
  const list = limit ? items.slice(0, limit) : items;

  return (
    <section className={className}>
      <div className="relative overflow-hidden">
        <div
          className="flex w-max gap-3 md:gap-4 animate-marquee"
          style={{ ["--speed" as any]: `${speed}s` }}
        >
          {[...list, ...list].map((a, i) => (
            <MiniAwardCard key={`${a.id}-${i}`} award={a} />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent dark:from-slate-950/80" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent dark:from-slate-950/80" />
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Link
          href={hrefAll}
          prefetch={false}
          className="inline-flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-blue-700 ring-1 ring-blue-300 hover:bg-blue-50 dark:bg-white/5 dark:text-blue-200 dark:ring-blue-800/60 dark:hover:bg-blue-950/20"
        >
          View all Awards & Recognition
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="currentColor" d="M5 12.75h11.19l-3.72 3.72a.75.75 0 1 0 1.06 1.06l5.25-5.25a.75.75 0 0 0 0-1.06L13.53 5.97a.75.75 0 1 0-1.06 1.06l3.72 3.72H5a.75.75 0 0 0 0 1.5z"/>
          </svg>
        </Link>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee var(--speed) linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .animate-marquee { animation: none; } }
      `}</style>
    </section>
  );
}