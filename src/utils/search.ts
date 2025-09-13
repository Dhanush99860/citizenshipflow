// src/utils/search.ts
export type SearchItem = { title: string; type: string; url: string; tags?: string[] };

let CACHE: SearchItem[] | null = null;
let loading = false;

async function loadIndexOnce() {
  if (CACHE || loading) return;
  loading = true;
  try {
    const res = await fetch("/api/search-index", { cache: "no-store" });
    const json = await res.json();
    CACHE = (json?.items || []) as SearchItem[];
  } catch {
    CACHE = [];
  } finally {
    loading = false;
  }
}

/** Call this when the overlay opens to warm the cache. */
export function preloadIndex() {
  // fire-and-forget
  void loadIndexOnce();
}

/** Synchronous search; returns [] until the index loads. */
export function searchItems(q: string, limit = 20): SearchItem[] {
  const query = q.trim().toLowerCase();
  // kick off a background load the first time it's used
  void loadIndexOnce();

  if (!CACHE || !query) return [];

  // tiny scoring heuristic
  const scored = CACHE.map((it) => {
    const t = it.title.toLowerCase();
    const ty = it.type.toLowerCase();
    const tags = (it.tags || []).join(" ").toLowerCase();

    let score = 0;
    if (t.includes(query)) score += 5;
    if (t.startsWith(query)) score += 3;
    if (ty.includes(query)) score += 1;
    if (tags.includes(query)) score += 1;
    return { it, score };
  }).filter(x => x.score > 0);

  scored.sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title));
  return scored.slice(0, limit).map(x => x.it);
}

/** Small utility so components can import { debounce } from "@/utils/search" */
export function debounce<T extends (...args: any[]) => void>(fn: T, wait = 250) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
