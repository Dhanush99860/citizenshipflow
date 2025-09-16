"use client";

import * as React from "react";

/**
 * MDX <Video /> block
 * - Supports either:
 *    1) <Video url="https://www.youtube.com/embed/..." title="..."/>  (iframe embed)
 *    2) <Video src="/videos/clip.mp4" poster="/poster.jpg" />        (HTML5 <video>)
 * - Pure black/white UI, responsive with CSS aspect-ratio.
 */

type Props = {
  /** Use `url` for YouTube/Vimeo/etc. embed URLs (already in /embed form). */
  url?: string;
  /** Use `src` for self-hosted files (mp4/webm/ogg). */
  src?: string;
  title?: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** CSS aspect ratio; defaults to 16 / 9 */
  aspect?: "16/9" | "4/3" | "1/1" | "21/9";
  className?: string;
};

const aspectToCSS: Record<NonNullable<Props["aspect"]>, string> = {
  "16/9": "16 / 9",
  "4/3": "4 / 3",
  "1/1": "1 / 1",
  "21/9": "21 / 9",
};

export default function Video({
  url,
  src,
  title,
  poster,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  aspect = "16/9",
  className,
}: Props) {
  const style: React.CSSProperties = { aspectRatio: aspectToCSS[aspect] || "16 / 9" };

  // If neither url nor src is provided, render nothing (avoids crashes)
  if (!url && !src) return null;

  // Self-hosted video branch
  if (src) {
    // Best-effort MIME type
    const lower = src.toLowerCase();
    const type = lower.endsWith(".webm")
      ? "video/webm"
      : lower.endsWith(".ogg") || lower.endsWith(".ogv")
      ? "video/ogg"
      : "video/mp4";

    return (
      <figure className={["my-6", className].filter(Boolean).join(" ")}>
        <div
          className="relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black"
          style={style}
        >
          <video
            className="absolute inset-0 h-full w-full"
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            preload="metadata"
          >
            <source src={src} type={type} />
            {title ? <track kind="captions" label={title} /> : null}
            Your browser does not support the video tag.
          </video>
        </div>
        {title && (
          <figcaption className="mt-2 text-sm text-black/80 dark:text-white/80">{title}</figcaption>
        )}
      </figure>
    );
  }

  // Embed branch (YouTube/Vimeo/etc.)
  const embedUrl = url!;
  return (
    <figure className={["my-6", className].filter(Boolean).join(" ")}>
      <div
        className="relative w-full overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-black"
        style={style}
      >
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedUrl}
          title={title || "Embedded video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {title && (
        <figcaption className="mt-2 text-sm text-black/80 dark:text-white/80">{title}</figcaption>
      )}
    </figure>
  );
}
