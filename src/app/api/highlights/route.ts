// src/app/api/highlights/route.ts
import { NextResponse } from "next/server";
import { getAllInsights } from "@/lib/insights-content";
import type { InsightMeta, InsightKind } from "@/types/insights";

// IMPORTANT: do not cache; always compute fresh.
// (If you want caching later, set `revalidate = 60` instead.)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

// Priority buckets
const PRIORITY: InsightKind[] = ["news", "articles", "media", "blog"];

function sortByDateDesc(a: InsightMeta, b: InsightMeta) {
  const da = new Date(a.updated || a.date || 0).getTime();
  const db = new Date(b.updated || b.date || 0).getTime();
  return db - da;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(24, Number(url.searchParams.get("limit")) || 16));

  // Pull many (we sort below)
  const { items } = await getAllInsights({ page: 1, pageSize: 800 });

  // Bucket + sort each bucket by recency
  const bucket = new Map<InsightKind, InsightMeta[]>(PRIORITY.map(k => [k, []]));
  for (const m of items) {
    if (bucket.has(m.kind)) bucket.get(m.kind)!.push(m);
  }
  for (const k of PRIORITY) bucket.get(k)!.sort(sortByDateDesc);

  // Fill by priority order
  const out: InsightMeta[] = [];
  for (const k of PRIORITY) {
    for (const m of bucket.get(k)!) {
      out.push(m);
      if (out.length >= limit) break;
    }
    if (out.length >= limit) break;
  }

  return NextResponse.json({ items: out });
}
