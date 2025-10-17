"use client";

import { useEffect, useState, useMemo } from "react";
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

  const preferred = actions.filter((a) => /broch|appoint|consult/i.test(a.label));
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
    document.body,
  );
}

const isYouTubeUrl = (url: string) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url);

const getYouTubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      const embedIdx = parts.findIndex((p) => p === "embed");
      if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    }
  } catch {}
  return null;
};

export default function SkilledHero({
  title,
  subtitle,
  videoSrc,
  poster,
  imageSrc,
  actions = [
    {
      label: "Download Brochure",
      href: "/brochures/skilled/australia.pdf", // Make this dynamic if needed
      variant: "ghost",
      download: true,
    },
    {
      label: "Check Eligibility",
      href: "#eligibility", // or route to eligibility form/page
      variant: "primary",
    },
  ],
  controls = false,
  autoPlay = true,
  muted = true,
  loop = true,
  startAt = 0,
}: {
  title: string;
  subtitle?: string;
  videoSrc?: string;
  poster?: string;
  imageSrc?: string;
  actions?: Action[];
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  startAt?: number;
}) {
  const ytId = videoSrc && isYouTubeUrl(videoSrc) ? getYouTubeId(videoSrc) : null;

  const youTubeSrc = useMemo(() => {
    if (!ytId) return null;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      controls: controls ? "1" : "0",
      autoplay: autoPlay ? "1" : "0",
      mute: muted ? "1" : "0",
      loop: loop ? "1" : "0",
      start: startAt ? String(startAt) : "0",
      playlist: loop ? ytId : "",
    });
    return `https://www.youtube.com/embed/${ytId}?${params.toString()}`;
  }, [ytId, controls, autoPlay, muted, loop, startAt]);

  return (
    <header className="relative mb-4 overflow-hidden rounded-3xl">
      <div className="relative w-full aspect-video md:aspect-[16/7] rounded-2xl md:rounded-3xl overflow-hidden">
        {videoSrc ? (
          ytId && youTubeSrc ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={youTubeSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              controls={controls}
              playsInline
              preload="metadata"
              poster={poster}
              onLoadedMetadata={(e) => {
                try {
                  if (startAt && (e.target as HTMLVideoElement).currentTime < startAt) {
                    (e.target as HTMLVideoElement).currentTime = startAt;
                  }
                } catch {}
              }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )
        ) : imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slateGray" />
        )}
      </div>

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

      <MobileCTABar actions={actions} />
    </header>
  );
}
