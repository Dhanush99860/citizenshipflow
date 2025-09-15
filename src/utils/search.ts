// src/utils/search.ts

export type UIItem = {
  title: string;
  type: string;
  url: string;
  snippet?: string;
};

type ApiSearchResult = {
  id: string;
  url: string;
  type: "country" | "program" | "article" | "news" | "page";
  title: string;
  subtitle?: string;
  tags?: string[];
  snippet?: string;
  hero?: string;
  date?: string;
  updated?: string;
  countries?: string[];
  programs?: string[];
  score: number;
};

type ApiSearchResponse = {
  query: string;
  tookMs: number;
  count: number;
  items: ApiSearchResult[];
};

// Small, framework-agnostic debounce that returns a callable
export function debounce<F extends (...args: any[]) => void>(fn: F, wait = 200) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// Warm up the static JSON so the first search is snappy.
// Safe to call from the client when the overlay opens.
export async function preloadIndex(): Promise<void> {
  try {
    await fetch("/search-index.json", { cache: "force-cache" });
  } catch {
    // ignore — not critical
  }
}

// Call the server API and map results to your UI’s Item shape
export async function searchItems(query: string, limit = 12, types?: string[]): Promise<UIItem[]> {
  const q = query.trim();
  if (!q) return [];

  const params = new URLSearchParams({ q, limit: String(limit) });
  if (types?.length) params.set("types", types.join(","));

  const res = await fetch(`/api/search?${params.toString()}`, {
    cache: "no-store",
    headers: { accept: "application/json" },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as ApiSearchResponse;

  // Map API docs to your Item shape (title/type/url)
  return (data.items || []).map((d) => ({
    title: d.title,
    // capitalize type for nicer display, e.g., "country" -> "Country"
    type: d.type.charAt(0).toUpperCase() + d.type.slice(1),
    url: d.url,
    snippet: d.snippet,
  }));
}
