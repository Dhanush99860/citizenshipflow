"use client";

import React from "react";
import type { Award } from "./awards.data";

export function MiniAwardCard({ award }: { award: Award }) {
  return (
    <div
      className="mini group relative w-[240px] md:w-[260px] h-[176px] md:h-[184px] rounded-2xl p-[1px]"
      aria-label={`${award.tag} — ${award.year}`}
    >
      <div className="inner relative h-full rounded-[calc(1rem-1px)] p-3 flex flex-col">
        <span aria-hidden className="beam absolute inset-0 rounded-[calc(1rem-1px)]" />
        <span aria-hidden className="corner absolute right-0 bottom-0 h-16 w-16" />

        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase">
          <span className="pill px-2 py-0.5 rounded-full truncate">{award.tag}</span>
        </div>

        <h3 className="mt-2 text-[13.5px] font-semibold leading-snug line-clamp-2">
          {award.title}
        </h3>
        <p className="mt-1 text-[12px] text-slate-600 dark:text-slate-300 truncate">
          {award.issuer}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="coin px-2.5 py-0.5 text-[12px] font-semibold rounded-full">{award.year}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-300/70">Recognized</span>
        </div>
      </div>

      <style jsx>{`
        .mini { background: linear-gradient(135deg, #93c5fd, #a78bfa); box-shadow: 0 4px 16px rgba(59,130,246,.15); }
        :global(.dark) .mini { background: linear-gradient(135deg, rgba(99,102,241,.7), rgba(125,211,252,.6)); box-shadow: 0 6px 18px rgba(99,102,241,.22); }

        .inner { background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.96)); border: 1px solid rgba(15,23,42,.08); backdrop-filter: blur(6px); }
        :global(.dark) .inner { background: linear-gradient(180deg, rgba(12,18,36,.72), rgba(14,22,44,.72)); border: 1px solid rgba(255,255,255,.1); }

        .pill { background: linear-gradient(90deg, #4f46e5, #0ea5e9); color: white; }
        :global(.dark) .pill { background: linear-gradient(90deg, #4338ca, #0891b2); }

        .coin { color:#0f172a; background: radial-gradient(100% 100% at 50% 0%, #fff, #eef2ff 60%, #e2e8f0); border: 1px solid rgba(15,23,42,.08); }
        :global(.dark) .coin { color:#dbeafe; background: radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,.28), rgba(255,255,255,.12) 70%, rgba(255,255,255,.06)); border: 1px solid rgba(255,255,255,.18); }

        .beam { background-image: linear-gradient(120deg, rgba(79,70,229,.10), rgba(79,70,229,0) 60%), linear-gradient(300deg, rgba(14,165,233,.12), rgba(14,165,233,0) 60%); mix-blend-mode: overlay; opacity:.55; }
        :global(.dark) .beam { opacity:.42; }
        .corner { background: radial-gradient(80px 80px at 100% 100%, rgba(96,165,250,.22), rgba(96,165,250,0) 55%); }
        :global(.dark) .corner { background: radial-gradient(80px 80px at 100% 100%, rgba(165,180,252,.18), rgba(165,180,252,0) 55%); }
      `}</style>
    </div>
  );
}
