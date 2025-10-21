// src/components/Home/Hero/slider.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ----------------------------- Types & helpers ---------------------------- */

type Item = {
  kind?: "news" | "articles" | "media" | "blog" | string;
  title?: string;
  url?: string;
  link?: string;
  slug?: string;
  hero?: string;
  image?: string;
  cover?: string;
  thumbnail?: string;
  date?: string;
  updated?: string;
};

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='100%' height='100%' fill='#eef2ff'/></svg>`
  );

function getKind(item: Item): "News" | "Article" | "Media" | "Blog" {
  const raw = (item?.kind || (item as any)?.type || "").toString().toLowerCase();
  if (raw.startsWith("news")) return "News";
  if (raw.startsWith("article")) return "Article";
  if (raw.startsWith("media")) return "Media";
  if (raw.startsWith("blog")) return "Blog";
  return "Article";
}
const getImg = (i: Item) => i?.hero || i?.image || i?.cover || i?.thumbnail || FALLBACK_IMG;

const INTERNAL_HOSTS = new Set([
  "xiphiasimmigration.com",
  "www.xiphiasimmigration.com",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function normalizeHref(raw?: string, item?: Item) {
  let out = raw || "#";
  try {
    const base =
      typeof window !== "undefined" ? window.location.origin : "https://www.xiphiasimmigration.com";
    const u = new URL(out, base);
    if (INTERNAL_HOSTS.has(u.hostname)) out = u.pathname + u.search + u.hash;
  } catch {}
  out = out.replace(/^\/insights\/(news|articles|media|blog)\//, "/$1/");
  if ((!out || out === "#") && item?.kind && item?.slug) {
    const k = String(item.kind).toLowerCase();
    if (["news", "articles", "media", "blog"].includes(k)) out = `/${k}/${item.slug}`;
  }
  return out || "#";
}
const getUrl = (i: Item) => normalizeHref(i?.url || i?.link, i);

function getDate(i: Item) {
  const raw = i?.updated || i?.date;
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildHighlights(src: Item[], minSlides = 10) {
  const news = src.filter((s) => getKind(s) === "News");
  const articles = src.filter((s) => getKind(s) === "Article");
  const media = src.filter((s) => getKind(s) === "Media");
  const blog = src.filter((s) => getKind(s) === "Blog");
  const items = [...news, ...articles, ...media, ...blog];
  const topKind = (news.length ? "News" : articles.length ? "Article" : media.length ? "Media" : "Blog") as
    | "News"
    | "Article"
    | "Media"
    | "Blog";
  if (items.length && items.length < minSlides) {
    const out = [...items];
    while (out.length < minSlides) out.push(items[out.length % items.length]);
    return { items: out, topKind };
  }
  return { items, topKind };
}

/* --------------------------------- UI ------------------------------------ */

export default function HighlightsPremium() {
  const [raw, setRaw] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/highlights?limit=20", { cache: "no-store", credentials: "same-origin" });
        const json = res.ok ? await res.json() : { items: [] };
        if (alive) setRaw(Array.isArray(json?.items) ? json.items : []);
      } catch {
        if (alive) setRaw([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const { items } = useMemo(() => buildHighlights(raw ?? [], 10), [raw]);
  // Duplicate to create a seamless loop
  const loopItems = useMemo(() => (items.length ? [...items, ...items] : []), [items]);

  // speed scales with count
  const durationSec = Math.max(24, Math.min(72, Math.max(items.length, 10) * 3.8));
  const trackStyle = { ["--duration" as any]: `${durationSec}s` } as React.CSSProperties;

  const Tile = ({ item }: { item: Item }) => {
    const href = getUrl(item);
    const kind = getKind(item);
    return (
      <Link
        href={href}
        prefetch={false}
        className="group flex w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] xl:w-[380px] items-center gap-3
                   rounded-xl border border-blue-100/70 bg-white/85 px-3 py-2
                   ring-1 ring-black/5 backdrop-blur transition
                   hover:bg-white dark:border-white/10 dark:bg-white/5 dark:ring-white/5"
        aria-label={item?.title || "Highlight"}
      >
        <span className="relative h-[64px] w-[96px] shrink-0 overflow-hidden rounded-md">
          <Image
            src={getImg(item)}
            alt={item?.title || "highlight image"}
            fill
            sizes="160px"
            className="object-cover"
            loading="lazy"
            decoding="async"
            unoptimized
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] leading-none">
            <span className="inline-flex items-center rounded-full bg-white/80 px-2 py-[3px] ring-1 ring-blue-200 dark:bg-white/5 dark:ring-blue-800/60">
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="font-medium text-blue-800">{kind}</span>
            </span>
            <time className="text-slate-500 dark:text-slate-400">{getDate(item)}</time>
          </div>
          <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900 dark:text-white">
            {item?.title}
          </h3>
        </div>
        <span className="ml-1 text-[13px] font-bold text-blue-500/70 transition group-hover:text-blue-700">→</span>
      </Link>
    );
  };

  const Skeleton = () => (
    <div className="flex w-[270px] sm:w-[310px] md:w-[340px] lg:w-[360px] xl:w-[380px] items-center gap-3 rounded-xl border border-blue-100/70 bg-white/70 px-3 py-2 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:ring-white/5">
      <div className="h-[64px] w-[96px] animate-pulse rounded-md bg-slate-200/70 dark:bg-white/10" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
        <div className="h-4 w-[85%] animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
      </div>
    </div>
  );

  return (
    <section className="mt-6 md:mt-8">
      {/* Premium hero-like container */}
      <div
        className={[
          "relative overflow-hidden rounded-3xl p-4 sm:p-5 lg:p-6",
          "bg-gradient-to-br from-sky-50 via-white to-indigo-50 ring-1 ring-blue-100/80",
          "dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/20 dark:ring-blue-900/40",
          "text-black dark:text-white",
        ].join(" ")}
      >
        {/* Decorative accents (like your reference) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-700/10" />
          <div className="absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-700/10" />
          <div className="absolute inset-0 opacity-40 dark:opacity-20 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent_80%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
          </div>
        </div>

        {/* Header (pill + title) */}
        <div className="relative mb-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium ring-1 ring-blue-200 backdrop-blur dark:bg-white/5 dark:ring-blue-800">
            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            Latest
          </span>
          <p className="text-[12px] text-slate-700 dark:text-slate-200">Fresh highlights across News, Articles & Media</p>
        </div>

        {/* Edge-faded marquee rail */}
        <div
          className="relative -mx-1 px-1"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
          }}
        >
          <div className="overflow-hidden">
            <ul role="list" className="marquee-track flex gap-3" style={trackStyle}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <li key={`sk-${i}`}>
                      <Skeleton />
                    </li>
                  ))
                : loopItems.map((it, i) => (
                    <li key={`hl-${i}-${it.slug ?? it.url ?? "x"}`}>
                      <Tile item={it} />
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>

      {/* marquee animation */}
      <style jsx global>{`
        @keyframes x-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-track {
          width: max-content;
          animation: x-scroll var(--duration, 40s) linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
