"use client";

import React from "react";
import Link from "next/link";
import type { Award } from "./awards.data";

type Props = { award: Award; compact?: boolean };

export function AwardCard({ award, compact = false }: Props) {
  const Tag = award.href ? (Link as any) : ("div" as any);
  const tagProps = award.href ? { href: award.href as string, prefetch: false } : {};

  return (
    <Tag
      {...tagProps}
      className={[
        "aw-card group relative block rounded-3xl focus:outline-none h-full", // <-- stretch
        compact ? "w-[300px]" : "",
      ].join(" ")}
      aria-label={`${award.tag} — ${award.year}`}
    >
      {/* frame */}
      <div className="aw-frame rounded-3xl p-[1.25px] h-full"> {/* <-- stretch */}
        {/* surface */}
        <div className="aw-surface relative rounded-[calc(1.5rem-1.25px)] p-5 md:p-6 overflow-hidden h-full flex flex-col"> {/* <-- stretch + flex */}
          {/* background graphics */}
          <span aria-hidden className="aw-beams absolute inset-0 rounded-[calc(1.5rem-1.25px)]" />
          <span aria-hidden className="aw-corner absolute right-0 bottom-0 h-28 w-28 md:h-32 md:w-32" />

          {/* ribbon (inside, no clipping) */}
          <div className="aw-ribbon absolute left-4 top-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            <Star className="h-3.5 w-3.5" />
            {award.tag}
          </div>

          {/* content */}
          <div className="pt-7"> {/* space under ribbon */}
            <h3 className="text-base md:text-lg font-semibold leading-snug">
              <span className="bg-gradient-to-r from-indigo-700 to-sky-700 bg-clip-text text-transparent dark:from-indigo-200 dark:to-sky-200">
                {award.title}
              </span>
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{award.issuer}</p>
          </div>

          {/* footer fixed to bottom */}
          <div className="mt-auto pt-4 flex items-center justify-between"> {/* <-- pushes to bottom */}
            <span className="aw-coin inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold">
              {award.year}
            </span>
            {award.href ? (
              <span className="inline-flex items-center gap-1 text-indigo-700 transition group-hover:translate-x-0.5 dark:text-indigo-200">
                View <Arrow className="h-4 w-4" />
              </span>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-300/70">Recognized</span>
            )}
          </div>

          {/* subtle sheen */}
          <span className="aw-sheen pointer-events-none absolute inset-0 rounded-[calc(1.5rem-1.25px)]" />
        </div>
      </div>

      <style jsx>{`
        .aw-frame {
          background: linear-gradient(135deg, #93c5fd, #a78bfa);
          box-shadow: 0 6px 26px rgba(59,130,246,.14);
        }
        :global(.dark) .aw-frame {
          background: linear-gradient(135deg, rgba(99,102,241,.7), rgba(125,211,252,.6));
          box-shadow: 0 10px 32px rgba(99,102,241,.22);
        }
        .aw-surface {
          background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,252,.96));
          border: 1px solid rgba(15,23,42,.08);
          backdrop-filter: blur(6px);
        }
        :global(.dark) .aw-surface {
          background: linear-gradient(180deg, rgba(12,18,36,.72), rgba(14,22,44,.72));
          border: 1px solid rgba(255,255,255,.10);
        }
        .aw-beams {
          background-image:
            linear-gradient(120deg, rgba(79,70,229,.10), rgba(79,70,229,0) 60%),
            linear-gradient(300deg, rgba(14,165,233,.12), rgba(14,165,233,0) 60%);
          mix-blend-mode: overlay;
          opacity: .55;
        }
        :global(.dark) .aw-beams { opacity: .42; }
        .aw-corner {
          background: radial-gradient(120px 120px at 100% 100%, rgba(96,165,250,.22), rgba(96,165,250,0) 55%);
        }
        :global(.dark) .aw-corner {
          background: radial-gradient(120px 120px at 100% 100%, rgba(165,180,252,.18), rgba(165,180,252,0) 55%);
        }
        .aw-ribbon {
          background: linear-gradient(90deg, #4f46e5, #0ea5e9);
          box-shadow: 0 6px 16px rgba(79,70,229,.22);
        }
        :global(.dark) .aw-ribbon {
          background: linear-gradient(90deg, #4338ca, #0891b2);
          box-shadow: 0 8px 20px rgba(99,102,241,.28);
        }
        .aw-coin {
          color:#0f172a;
          background: radial-gradient(100% 100% at 50% 0%, #fff, #eef2ff 60%, #e2e8f0);
          border: 1px solid rgba(15,23,42,.08);
          box-shadow: 0 2px 8px rgba(2,6,23,.08);
        }
        :global(.dark) .aw-coin {
          color:#dbeafe;
          background: radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,.28), rgba(255,255,255,.12) 70%, rgba(255,255,255,.06));
          border: 1px solid rgba(255,255,255,.18);
          box-shadow: 0 4px 14px rgba(0,0,0,.25);
        }
        .aw-sheen {
          background: linear-gradient(110deg, rgba(255,255,255,0), rgba(255,255,255,.45) 50%, rgba(255,255,255,0));
          transform: translateX(-120%);
          transition: transform .75s ease;
          mix-blend-mode: overlay;
        }
        .aw-card:hover .aw-sheen { transform: translateX(120%); }
      `}</style>
    </Tag>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3l2.47 5.16L20 9.27l-4 3.9.94 5.48L12 16.99 7.06 18.65 8 13.17 4 9.27l5.53-1.11L12 3z" />
    </svg>
  );
}
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5 12.75h11.19l-3.72 3.72a.75.75 0 1 0 1.06 1.06l5.25-5.25a.75.75 0 0 0 0-1.06L13.53 5.97a.75.75 0 1 0-1.06 1.06l3.72 3.72H5a.75.75 0 0 0 0 1.5z" />
    </svg>
  );
}
