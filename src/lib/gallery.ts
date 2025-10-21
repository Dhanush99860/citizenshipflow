// src/lib/gallery.ts
export type GalleryCategory =
  | "events"
  | "team"
  | "office"
  | "awards"
  | "csr"
  | "press"
  | "other";

export type GalleryItem = {
  id: string;
  src: string;          // "/gallery/..." (public) OR "https://cdn/..."
  alt?: string;
  w: number;            // intrinsic width (improves CLS, lightbox)
  h: number;            // intrinsic height
  category: GalleryCategory | string;
  caption?: string;
  date?: string;        // "YYYY-MM-DD"
  blurDataURL?: string; // optional LQIP; can be a tiny base64 or SVG data URL
};

// --- SAMPLE DATA (replace with yours). Keep accurate w/h if possible. ---
const GALLERY: GalleryItem[] = [
  { id: "e1", src: "/images/articles/a-beacon-of-trust.webp", alt: "Annual Summit keynote", w: 1600, h: 1067, category: "events", caption: "Annual Summit — Keynote", date: "2025-02-18" },
  { id: "e2", src: "/images/articles/caribbean-islands.webp", alt: "Networking session", w: 1600, h: 1067, category: "events", caption: "Annual Summit — Keynote", date: "2025-02-18 " },
  { id: "t1", src: "/images/articles/caribbean-islands.webp", alt: "Team photo in office", w: 1600, h: 1067, category: "team", caption: "Annual Summit — Keynote", date: "2025-02-18 " },
  { id: "t2", src: "/images/articles/a-beacon-of-trust.webp", alt: "Pair programming", w: 1600, h: 1067, category: "team", caption: "Annual Summit — Keynote", date: "2025-02-18 " },
  { id: "o1", src: "/images/articles/caribbean-islands.webp", alt: "Reception area", w: 1600, h: 1067, category: "office", caption: "Annual Summit — Keynote", date: "2025-02-18 "  },
  { id: "o2", src: "/images/articles/a-beacon-of-trust.webp", alt: "Meeting room", w: 1600, h: 1067, category: "office", caption: "Annual Summit — Keynote", date: "2025-02-18 "  },
  { id: "a1", src: "/images/articles/caribbean-islands.webp", alt: "Awards night", w: 1600, h: 1067, category: "awards", caption: "Annual Summit — Keynote", date: "2025-02-18 " },
  { id: "c1", src: "/images/articles/a-beacon-of-trust.webp", alt: "CSR outreach", w: 1600, h: 1067, category: "csr", caption: "Annual Summit — Keynote", date: "2025-02-18 "  },
  { id: "p1", src: "/images/articles/caribbean-islands.webp", alt: "Press briefing", w: 1600, h: 1067, category: "press", caption: "Annual Summit — Keynote", date: "2025-02-18 "  },
  { id: "p2", src: "/images/articles/eb-1-visa-rules.webp", alt: "Press briefing", w: 1600, h: 1067, category: "press", caption: "Annual Summit — Keynote", date: "2025-02-18 "  },
];

export async function getGallery(): Promise<GalleryItem[]> {
  // Swap for CMS fetch later (Sanity/Strapi/Contentful/etc.) if needed.
  // This runs on the server in the page, so it’s SEO + fast.
  return GALLERY;
}
