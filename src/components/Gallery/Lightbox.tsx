"use client";

// src/components/gallery/Lightbox.tsx

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery";

function shimmer() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='20'>
         <defs><linearGradient id='g'>
          <stop stop-color='#f3f4f6' offset='20%'/><stop stop-color='#e5e7eb' offset='50%'/><stop stop-color='#f3f4f6' offset='80%'/></linearGradient></defs>
         <rect width='100%' height='100%' fill='#f3f4f6'/>
         <rect width='100%' height='100%' fill='url(#g)'>
           <animate attributeName='x' from='-100%' to='100%' dur='1.2s' repeatCount='indefinite'/>
         </rect>
       </svg>`
    )
  );
}

export default function Lightbox({
  items,
  startIndex,
  onClose,
}: {
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const overlayRef = useRef<HTMLDivElement>(null);

  const canPrev = idx > 0;
  const canNext = idx < items.length - 1;

  const goPrev = () => canPrev && setIdx((i) => i - 1);
  const goNext = () => canNext && setIdx((i) => i + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const it = items[idx];
  if (!it) return null;

  return (
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 md:p-6"
      onMouseDown={(e) => e.currentTarget === e.target && onClose()}
    >
      <figure className="relative max-h-[85vh] w-full max-w-6xl">
        <div className="relative w-full" style={{ aspectRatio: `${it.w}/${it.h}` }}>
          <Image
            src={it.src}
            alt={it.alt || "Gallery image"}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            placeholder="blur"
            blurDataURL={it.blurDataURL || shimmer()}
            priority
          />
        </div>

        <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-3 text-white/90">
          <div className="min-w-0">
            {it.caption && <p className="truncate text-sm font-medium">{it.caption}</p>}
            {(it.date || it.category) && (
              <p className="text-xs text-white/70">
                {it.date &&
                  new Date(it.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                {it.date ? " â€¢ " : ""}
                {String(it.category).charAt(0).toUpperCase() + String(it.category).slice(1)}
              </p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Previous image"
              className="rounded-full bg-white/10 px-3 py-2 text-sm ring-1 ring-white/20 backdrop-blur hover:bg-white/15 disabled:opacity-40"
            >
              â†
            </button>
            <button
              onClick={goNext}
              disabled={!canNext}
              aria-label="Next image"
              className="rounded-full bg-white/10 px-3 py-2 text-sm ring-1 ring-white/20 backdrop-blur hover:bg-white/15 disabled:opacity-40"
            >
              â†’
            </button>
            <button
              onClick={onClose}
              aria-label="Close lightbox"
              className="rounded-full bg-white/10 px-3 py-2 text-sm ring-1 ring-white/20 backdrop-blur hover:bg-white/15"
            >
              Esc
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}

