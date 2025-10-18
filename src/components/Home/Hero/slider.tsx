"use client";

import { useEffect, useMemo, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FaRegNewspaper } from "react-icons/fa";

/* ───────────────── helpers ───────────────── */

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#e5e7eb' offset='0'/><stop stop-color='#f3f4f6' offset='1'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/></svg>`
  );

type KindLabel = "News" | "Article" | "Media" | "Blog" | "Update";

function getKind(item: any): KindLabel {
  const raw =
    (item?.kind ?? item?.type ?? item?.category ?? item?.tag ?? item?.label ?? "Update") + "";
  const k = raw.toLowerCase();
  if (k.startsWith("news")) return "News";
  if (k.startsWith("article")) return "Article";
  if (k.startsWith("media")) return "Media";
  if (k.startsWith("blog")) return "Blog";
  return "Update";
}
function getImg(item: any) {
  return (
    item?.hero ||
    item?.image ||
    item?.cover ||
    item?.thumbnail ||
    item?.icon ||
    FALLBACK_IMG
  );
}
function getDate(item: any) {
  const raw = item?.updated ?? item?.date ?? item?.publishedAt ?? item?.time;
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function getUrl(item: any) {
  return item?.url || item?.link || "#";
}
function getViewAll(kind: KindLabel) {
  switch (kind) {
    case "News":
      return "/news";
    case "Article":
      return "/articles";
    case "Media":
      return "/media";
    case "Blog":
      return "/blog";
    default:
      return "/newsroom";
  }
}
function cmpDateDesc(a: any, b: any) {
  const da = new Date(a?.updated || a?.date || 0).getTime();
  const db = new Date(b?.updated || b?.date || 0).getTime();
  return db - da;
}

/** Priority: News → Articles → Media → Blog. Ensure at least `minSlides`. */
function buildHighlights(src: any[], max = 16, minSlides = 4) {
  const news = src.filter((x) => getKind(x) === "News").sort(cmpDateDesc);
  const articles = src.filter((x) => getKind(x) === "Article").sort(cmpDateDesc);
  const media = src.filter((x) => getKind(x) === "Media").sort(cmpDateDesc);
  const blog = src.filter((x) => getKind(x) === "Blog").sort(cmpDateDesc);

  let combined = [...news, ...articles, ...media, ...blog].slice(0, max);

  // If only 1–3 items exist, loop them so the rail/slider still scrolls.
  if (combined.length > 0 && combined.length < minSlides) {
    const dupes: any[] = [];
    while (combined.length + dupes.length < minSlides) {
      dupes.push(combined[(combined.length + dupes.length) % combined.length]);
    }
    combined = [...combined, ...dupes];
  }

  const topKind: KindLabel = combined.length ? getKind(combined[0]) : "Update";
  return { items: combined, topKind };
}

/* ───────────────── component ───────────────── */

export default function CardSlider() {
  const [raw, setRaw] = useState<any[]>([]);

  // Fetch highlights from your API (news→articles→media→blog)
  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const res = await fetch("/api/highlights?limit=16", { cache: "no-store" });
        if (!res.ok) throw new Error("highlights fetch failed");
        const json = await res.json();
        if (ok) setRaw(Array.isArray(json?.items) ? json.items : []);
      } catch {
        setRaw([]); // silent fail → no strip
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  // Build view model (don’t exit early before hooks)
  const { items, topKind } = useMemo(() => buildHighlights(raw, 16, 4), [raw]);

  // SEO JSON-LD (safe with 0 items)
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: (items || []).map((item: any, i: number) => ({
        "@type": "ListItem",
        position: i + 1,
        url: getUrl(item),
        name: item?.title || "Highlight",
        description: item?.summary || item?.short || "",
      })),
    }),
    [items]
  );

  // Slider config (desktop/tablet only; mobile uses native rail)
  const slidesToShowBase = Math.min(items.length || 1, 5);
  const sliderSettings = useMemo(
    () => ({
      autoplay: true,
      arrows: false,
      dots: false,
      infinite: true,
      autoplaySpeed: 2400,
      speed: 650,
      slidesToShow: slidesToShowBase,
      slidesToScroll: 1,
      cssEase: "ease-in-out",
      responsive: [
        { breakpoint: 1536, settings: { slidesToShow: Math.min(slidesToShowBase, 5) } },
        { breakpoint: 1280, settings: { slidesToShow: Math.min(slidesToShowBase, 4) } },
        { breakpoint: 1024, settings: { slidesToShow: Math.min(slidesToShowBase, 3) } },
        { breakpoint: 768, settings: { slidesToShow: Math.min(slidesToShowBase, 3) } },
      ],
    }),
    [slidesToShowBase]
  );

  const MiniTile = ({ item }: { item: any }) => {
    const kind = getKind(item);
    return (
      <Link
        href={getUrl(item)}
        aria-label={item?.title}
        className={[
          "group flex items-center gap-3 rounded-xl",
          "border border-blue-100/70 dark:border-white/10",
          "bg-white/85 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/5",
          "backdrop-blur-md px-3 py-2 h-[82px] w-full",
          "hover:bg-white/95 dark:hover:bg-white/10 transition",
        ].join(" ")}
      >
        <span className="relative h-[58px] w-[84px] overflow-hidden rounded-md flex-none">
          <Image
            src={getImg(item)}
            alt={item?.title || "Highlight image"}
            fill
            sizes="120px"
            className="object-cover"
            loading="lazy"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/15 to-transparent" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="rounded-full bg-yellow-200/90 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100 px-1.5 py-[2px] font-semibold">
              {kind}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {getDate(item)}
            </span>
          </div>
          <h3 className="mt-1 text-[13px] font-semibold leading-5 text-slate-900 dark:text-white line-clamp-2">
            {item?.title}
          </h3>
        </div>

        <span className="ml-1 text-[13px] font-bold text-blue-600 dark:text-blue-300 opacity-70 group-hover:opacity-100">
          →
        </span>
      </Link>
    );
  };

  if (!items.length) return null;

  /* ───────────────── UI ───────────────── */
  return (
    <>
      <Script
        id="home-highlights-ld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mt-6 md:mt-8">
        <div
          className={[
            "relative overflow-hidden rounded-3xl p-3 md:p-4",
            "bg-gradient-to-br from-sky-50 via-white to-indigo-50 ring-1 ring-blue-100/80",
            "dark:from-blue-950/30 dark:via-transparent dark:to-indigo-950/20 dark:ring-blue-900/40",
          ].join(" ")}
        >
          {/* soft accents */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-700/10" />
            <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-700/10" />
            <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.18] [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent_80%)]">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:22px_22px]" />
            </div>
          </div>

          {/* Header bar — now shows FIRST ITEM TITLE */}
          <div className="relative mb-3">
            <div
              className={[
                "flex items-center gap-2 rounded-2xl px-2.5 py-2",
                "bg-white/80 dark:bg-white/5 border border-blue-100/70 dark:border-white/10",
                "ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-md",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 px-2 py-[5px] text-[11px] font-medium ring-1 ring-blue-200/60 dark:ring-blue-800/60">
                <FaRegNewspaper className="text-[12px]" />
                Latest
              </span>

              {/* 👇 Dynamic headline from the first highlight (your one News post) */}
              <p className="truncate text-[12px] text-slate-700 dark:text-slate-200">
                {items[0]?.title || (topKind === "News" ? "Top News" : `Latest ${topKind}`)}
              </p>

              <Link
                href={getViewAll(topKind)}
                className="ml-auto rounded-lg border border-blue-100/70 dark:border-white/10 bg-white/80 dark:bg-white/5 px-2 py-1 text-[11px] font-semibold text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white transition"
              >
                View All →
              </Link>
            </div>
          </div>

          {/* MOBILE: native horizontal rail (snap) */}
          <div className="relative md:hidden -mx-1.5 px-1.5">
            <ul className="flex gap-2.5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
              {items.map((item: any, i: number) => (
                <li key={i} className="snap-start basis-[92%] shrink-0">
                  <MiniTile item={item} />
                </li>
              ))}
              <li className="basis-2 shrink-0" />
            </ul>
          </div>

          {/* DESKTOP/TABLET: slick carousel */}
          <div className="relative hidden md:block">
            <Slider {...(sliderSettings as any)}>
              {items.map((item: any, i: number) => (
                <div key={i} className="px-1.5">
                  <MiniTile item={item} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* Utilities */}
      <style jsx global>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
