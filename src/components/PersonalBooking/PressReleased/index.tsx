"use client";

import { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import "swiper/css";

type PressItem = {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  videoUrl: string;
};

const pressItems: PressItem[] = [
  {
    id: 1,
    thumbnail: "/images/hero/silhouettes.webp",
    title: "CNBC Interview",
    description:
      "Our CEO shares insights on wealth management and the future of financial planning.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    thumbnail: "/images/hero/silhouettes.webp",
    title: "Business Today Feature",
    description:
      "Recognized as one of the top innovators shaping the investment landscape in India.",
    videoUrl: "https://player.vimeo.com/video/123456",
  },
  {
    id: 3,
    thumbnail: "/images/hero/silhouettes.webp",
    title: "Forbes Spotlight",
    description:
      "Highlighted for empowering wealth creators with personalized investment solutions.",
    videoUrl: "https://www.youtube.com/embed/abcd1234",
  },
];

export default function PressReleased() {
  const [activeVideo, setActiveVideo] = useState<null | PressItem>(null);

  // Close on ESC
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setActiveVideo(null);
  }, []);

  useEffect(() => {
    if (activeVideo) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo, onKeyDown]);

  // ----- JSON-LD (SEO) -----
  const videoLd = pressItems.map((p, idx) => ({
    "@type": "VideoObject",
    name: p.title,
    description: p.description,
    thumbnailUrl: p.thumbnail,
    uploadDate: "2024-01-01",
    contentUrl: p.videoUrl,
    position: idx + 1,
  }));

  return (
    <section
      className="relative w-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white transition-colors"
      aria-labelledby="press-heading"
    >
      {/* JSON-LD ItemList of VideoObjects */}
      <script
        type="application/ld+json"
        // @ts-ignore
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: videoLd,
          }),
        }}
      />

      <div className="max-w-7xl w-full mx-auto py-20 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <h2
            id="press-heading"
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-gray-100 leading-tight"
          >
            Our{" "}
            <span className="bg-gradient-to-r from-primary/70 to-primary/90 bg-clip-text text-transparent">
              Press Released
            </span>{" "}
            Press Released
          </h2>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-medium shadow hover:opacity-90 transition">
            Schedule an expert call
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1.1}
          centeredSlides
          grabCursor
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 1.1 },
          }}
        >
          {pressItems.map((item) => (
            <SwiperSlide key={item.id}>
              <article className="grid md:grid-cols-2 gap-6 items-start rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-zinc-900 p-6 md:p-10">
                {/* Left: Thumbnail */}
                <figure className="relative group overflow-hidden rounded-xl">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={1200}
                    height={800}
                    priority={false}
                    className="h-64 md:h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 dark:ring-white/10 bg-gradient-to-t from-black/60 via-black/25 to-transparent backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play button */}
                  <button
                    type="button"
                    aria-label={`Play video: ${item.title}`}
                    aria-haspopup="dialog"
                    onClick={() => setActiveVideo(item)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 text-black shadow-lg ring-1 ring-black/10 hover:scale-105 transition-transform">
                      ▶
                    </span>
                  </button>

                  <figcaption className="sr-only">{item.title}</figcaption>
                </figure>

                {/* Right: Text + CTA */}
                <div className="flex flex-col justify-start">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">
                    {item.title}
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full rounded-xl"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 text-white/90 hover:text-primary transition"
              >
                <X size={36} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
