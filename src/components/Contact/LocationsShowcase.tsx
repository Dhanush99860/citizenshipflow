// src/components/Contact/LocationsShowcase.tsx
"use client";

import * as React from "react";

export type Region = { key: string; label: string };
export type Office = {
  id: string;
  city: string;
  regionKey: string;
  regionLabel: string;
  address: string[];
  phone?: string;
  email?: string;
  mapQuery?: string;
  heroImage?: string;
};

export default function LocationsShowcase({
  offices, regions, defaultRegion, showBengaluruMap = false, title = "Our global presence",
  subtitle = "Find the nearest office. Call, email, or get directions.", className = "",
}: {
  offices: Office[];
  regions: Region[];
  defaultRegion?: string;
  showBengaluruMap?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const initialIdx = Math.max(0, regions.findIndex((r) => r.key.toLowerCase() === (defaultRegion ?? "").toLowerCase()));
  const [activeIdx, setActiveIdx] = React.useState(initialIdx === -1 ? 0 : initialIdx);

  const activeRegion = regions[activeIdx]?.key ?? regions[0]?.key;
  const regionOffices = React.useMemo(() => offices.filter((o) => o.regionKey === activeRegion), [offices, activeRegion]);

  const gmLink = (q?: string) => (q ? `https://www.google.com/maps?q=${encodeURIComponent(q)}` : undefined);
  const gmEmbed = (q: string, z = 12) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${z}&output=embed`;

  return (
    <section className={["w-full", className].join(" ")} aria-labelledby="loc-hero">
      {/* visual hero */}
      <div
        className={[
          "relative overflow-hidden rounded-3xl p-6 md:p-8 lg:p-10",
          "bg-gradient-to-br from-sky-50 via-white to-indigo-50 ring-1 ring-blue-100/80",
          "dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/20 dark:ring-blue-900/40",
        ].join(" ")}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-700/10" />
          <div className="absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-700/10" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 text-[12px]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="font-semibold">Worldwide</span>
          </div>
          <h2 id="loc-hero" className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-2 text-[15px] leading-7 text-zinc-700 dark:text-zinc-300 md:text-base">{subtitle}</p>

          <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Regions">
            {regions.map((r, i) => {
              const selected = i === activeIdx;
              return (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`panel-${r.key}`}
                  onClick={() => setActiveIdx(i)}
                  className={[
                    "rounded-full px-3 py-1.5 text-sm ring-1 transition",
                    selected ? "bg-blue-600 text-white ring-blue-700/20" : "bg-white text-blue-700 ring-blue-200 hover:bg-blue-50 dark:bg-white/5 dark:text-blue-200 dark:ring-blue-800/60",
                  ].join(" ")}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* office cards */}
      <div id={`panel-${activeRegion}`} role="tabpanel" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regionOffices.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-blue-200 p-8 text-center text-sm text-zinc-600">
            No offices listed yet.
          </div>
        ) : (
          regionOffices.map((o) => {
            const link = gmLink(o.mapQuery);
            return (
              <article key={o.id} className="group overflow-hidden rounded-3xl ring-1 ring-blue-100/80 bg-white dark:bg-white/5 dark:ring-blue-900/30 shadow-sm hover:shadow-md transition">
                <div className="relative h-36 w-full">
                  {o.heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.heroImage} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-blue-900/30 dark:via-transparent dark:to-indigo-900/20" />
                  )}
                  <div className="absolute bottom-3 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs ring-1 ring-blue-200 backdrop-blur dark:bg-white/10 dark:ring-blue-800/60">
                    {o.regionLabel}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold">{o.city}</h3>
                  <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 space-y-0.5">
                    {o.address.map((line, idx) => <div key={idx}>{line}</div>)}
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    {o.phone && (
                      <div><span className="font-medium">Phone:</span>{" "}
                        <a className="underline decoration-blue-400 hover:decoration-blue-600" href={`tel:${o.phone.replace(/\s/g, "")}`}>{o.phone}</a>
                      </div>
                    )}
                    {o.email && (
                      <div><span className="font-medium">Email:</span>{" "}
                        <a className="underline decoration-blue-400 hover:decoration-blue-600" href={`mailto:${o.email}`}>{o.email}</a>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-blue-700 ring-1 ring-blue-300 hover:bg-blue-50 dark:bg-white/5 dark:text-blue-200 dark:ring-blue-800/60 dark:hover:bg-blue-950/20 transition">
                        Open map
                        <OpenIcon />
                      </a>
                    )}
                    {o.email && (
                      <a href={`mailto:${o.email}`} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-white ring-1 ring-blue-700/20 hover:bg-blue-700 transition">
                        Email office
                        <ArrowRight />
                      </a>
                    )}
                  </div>
                </div>

                {/* optional: single map for Bengaluru only if you enable prop */}
                {showBengaluruMap && /bengaluru|bangalore/i.test(o.city) && o.mapQuery ? (
                  <div className="bg-zinc-50 dark:bg-zinc-900">
                    <iframe
                      title={`${o.city} map`} src={gmEmbed(o.mapQuery, 12)} width="100%" height={220}
                      loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block"
                    />
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M5 12.75h11.19l-3.72 3.72a.75.75 0 1 0 1.06 1.06l5.25-5.25a.75.75 0 0 0 0-1.06L13.53 5.97a.75.75 0 1 0-1.06 1.06l3.72 3.72H5a.75.75 0 0 0 0 1.5z"/></svg>
  );
}
function OpenIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M14 3a1 1 0 0 0 0 2h3.586l-7.293 7.293a1 1 0 0 0 1.414 1.414L19 6.414V10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-6z"/><path fill="currentColor" d="M5 6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4a1 1 0 1 0-2 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h4a1 1 0 1 0 0-2H5z"/></svg>
  );
}
