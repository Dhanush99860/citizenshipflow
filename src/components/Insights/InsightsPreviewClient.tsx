"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselRail, { CarouselRailHandle } from "./CarouselRail";
import InsightCard from "./InsightCard";

type Item = { url: string };

export default function InsightsPreviewClient({
  items,
  title = "From the Insights",
  viewAllHref = "/insights",
  ariaLabel = "Insights preview slider",
}: {
  items: Item[];
  title?: string;
  viewAllHref?: string;
  ariaLabel?: string;
}) {
  const railRef = useRef<CarouselRailHandle>(null);
  const [edges, setEdges] = useState({ canPrev: false, canNext: true });

  // ✅ memoized to avoid re-creating the function each render
  const handleEdges = useCallback((s: { canPrev: boolean; canNext: boolean }) => {
    setEdges(s);
  }, []);

  return (
    <section
      aria-labelledby="insights-preview-title"
      className="relative container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-12"
    >
      <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="insights-preview-title"
          className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50"
        >
          {title}
        </h2>

        <div className="flex items-center gap-2">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300/70 dark:border-slate-600/60 bg-white/70 dark:bg-slate-800/70 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-slate-50 shadow-sm hover:bg-white/90 dark:hover:bg-slate-800/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
          >
            View all
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Arrows live in header so they never overlap cards */}
          <div className="hidden md:flex items-center gap-2 ml-1">
            <button
              type="button"
              onClick={() => railRef.current?.prev()}
              disabled={!edges.canPrev}
              aria-label="Previous"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 shadow-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => railRef.current?.next()}
              disabled={!edges.canNext}
              aria-label="Next"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 shadow-sm hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <CarouselRail ref={railRef} ariaLabel={ariaLabel} onEdgeChange={handleEdges}>
        {items.map((it) => (
          <div
            key={it.url}
            className="
              snap-start shrink-0
              w-[88%] sm:w-[64%] md:w-[48%] lg:w-[38%] xl:w-[30%]
              max-w-[460px]
            "
          >
            <InsightCard item={it as any} />
          </div>
        ))}
      </CarouselRail>
    </section>
  );
}
