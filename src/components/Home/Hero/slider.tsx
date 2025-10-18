"use client";

import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { FaRegNewspaper } from "react-icons/fa";

// Optional local fallback (kept to avoid empty UI in early deploys)
import { cardData } from "@/app/api/data";

type Item = {
  kind?: "news" | "articles" | "media" | "blog" | string;
  title?: string;
  summary?: string;
  short?: string;
  url?: string;
  link?: string;
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
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='160'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#e5e7eb' offset='0'/><stop stop-color='#f3f4f6' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`
  );

// ── helpers ────────────────────────────────────────────────────────────────
function getKind(item: any): "News" | "Article" | "Media" | "Blog" {
  const raw = (item?.kind || item?.type || "").toString().toLowerCase();
  if (raw.startsWith("news")) return "News";
  if (raw.startsWith("article")) return "Article";
  if (raw.startsWith("media")) return "Media";
  if (raw.startsWith("blog")) return "Blog";
  return "Article";
}
function getImg(i: any) {
  return i?.hero || i?.image || i?.cover || i?.thumbnail || FALLBACK_IMG;
}
function getUrl(i: any) {
  return i?.url || i?.link || "#";
}
function getDate(i: any) {
  const raw = i?.updated || i?.date;
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Build priority list; guarantee a minimum count for a nice rail.
function buildHighlights(src: Item[], minSlides = 6) {
  const news = src.filter(s => getKind(s) === "News");
  const articles = src.filter(s => getKind(s) === "Article");
  const media = src.filter(s => getKind(s) === "Media");
  const blog = src.filter(s => getKind(s) === "Blog");

  // Always start with News when present.
  let items: Item[] = [...news, ...articles, ...media, ...blog];

  // Pick topKind for header/CTA.
  const topKind = items.length ? getKind(items[0]) : "Article";

  // Ensure we have enough to slide smoothly on desktop.
  if (items.length > 0 && items.length < minSlides) {
    const dupes = [...items];
    while (items.length < minSlides) items.push(dupes[items.length % dupes.length]);
  }
  return { items, topKind };
}

// ── component ─────────────────────────────────────────────────────────────
export default function CardSlider() {
  const [raw, setRaw] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/highlights?limit=16", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (res.ok) {
          const json = await res.json();
          if (alive) setRaw(Array.isArray(json?.items) ? json.items : []);
        } else if (alive) setRaw([]);
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

  // Fallback to local data if API returns empty
  const source = raw && raw.length > 0 ? raw : (cardData as Item[]);
  const { items, topKind } = useMemo(() => buildHighlights(source, 6), [source]);

  // slick settings (cap at 6 max per row on very wide, 5 on xl, etc.)
  const slidesToShowBase = Math.max(1, Math.min(items.length, 6));
  const settings = useMemo(
    () => ({
      autoplay: true,
      dots: false,
      arrows: false,
      infinite: true,
      autoplaySpeed: 2400,
      speed: 600,
      slidesToShow: slidesToShowBase,
      slidesToScroll: 1,
      cssEase: "ease-in-out",
      responsive: [
        { breakpoint: 1536, settings: { slidesToShow: Math.min(slidesToShowBase, 6) } },
        { breakpoint: 1280, settings: { slidesToShow: Math.min(slidesToShowBase, 5) } },
        { breakpoint: 1024, settings: { slidesToShow: Math.min(slidesToShowBase, 4) } },
        { breakpoint: 768, settings: { slidesToShow: Math.min(slidesToShowBase, 2) } },
      ],
    }),
    [slidesToShowBase]
  );

  // Tile
  const MiniTile = ({ item }: { item: Item }) => {
    const kind = getKind(item);
    return (
      <Link
        href={getUrl(item)}
        className="group flex h-[86px] w-full items-center gap-3 rounded-xl border border-blue-100/70 bg-white/85 px-3 py-2 ring-1 ring-black/5 backdrop-blur transition hover:bg-white/95 dark:border-white/10 dark:bg-white/5 dark:ring-white/5"
        aria-label={item?.title}
      >
        <span className="relative h-[60px] w-[88px] shrink-0 overflow-hidden rounded-md">
          <Image
            src={getImg(item)}
            alt={item?.title || "highlight"}
            fill
            sizes="120px"
            className="object-cover"
            loading="lazy"
            decoding="async"
            // Important: ensures remote images show up on Vercel
            // even if images.domains is not configured yet.
            unoptimized
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="rounded-full bg-yellow-200/90 px-1.5 py-[2px] font-semibold text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100">
              {kind}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{getDate(item)}</span>
          </div>
          <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900 dark:text-white">
            {item?.title}
          </h3>
        </div>

        <span className="ml-1 text-[13px] font-bold text-blue-600 opacity-70 transition group-hover:opacity-100 dark:text-blue-300">
          →
        </span>
      </Link>
    );
  };

  // Skeleton while loading
  const Skeleton = () => (
    <div className="h-[86px] w-full rounded-xl border border-blue-100/60 bg-white/70 p-3 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:ring-white/5">
      <div className="flex h-full items-center gap-3">
        <div className="h-[60px] w-[88px] animate-pulse rounded-md bg-slate-200/70 dark:bg-white/10" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
          <div className="h-4 w-[85%] animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );

  const headerLabel = items.length ? (topKind === "News" ? "Top News" : `Latest ${topKind}`) : "Latest";

  return (
    <section className="mt-6 md:mt-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-3 ring-1 ring-blue-100/80 dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/20 dark:ring-blue-900/40">
        {/* soft accents */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-700/10" />
          <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-700/10" />
          <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent_80%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
          </div>
        </div>

        {/* Header */}
        <div className="relative mb-3">
          <div className="flex items-center gap-2 rounded-2xl border border-blue-100/70 bg-white/80 px-2.5 py-2 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:ring-white/5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 px-2 py-[5px] text-[11px] font-medium text-blue-700 ring-1 ring-blue-200/60 dark:text-blue-300 dark:ring-blue-800/60">
              <FaRegNewspaper className="text-[12px]" /> Latest
            </span>
            <p className="truncate text-[12px] text-slate-700 dark:text-slate-200">{headerLabel}</p>
            <Link
              href={
                topKind === "News" ? "/news"
                : topKind === "Article" ? "/articles"
                : topKind === "Media" ? "/media"
                : "/blog"
              }
              className="ml-auto rounded-lg border border-blue-100/70 bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-900 transition hover:bg-blue-600 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              View All →
            </Link>
          </div>
        </div>

        {/* MOBILE rail (snap) */}
        <div className="relative -mx-1.5 px-1.5 md:hidden">
          <ul className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {(loading ? Array.from({ length: 3 }) : items).map((it: any, i: number) => (
              <li key={i} className="basis-[92%] shrink-0 snap-start">
                {loading ? <Skeleton /> : <MiniTile item={it} />}
              </li>
            ))}
            <li className="basis-2 shrink-0" />
          </ul>
        </div>

        {/* DESKTOP/TABLET carousel */}
        <div className="relative hidden md:block">
          {loading ? (
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : (
            <Slider {...(settings as any)}>
              {items.map((it, i) => (
                <div key={i} className="px-1.5">
                  <MiniTile item={it} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
