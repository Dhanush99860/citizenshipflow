// src/app/api/highlights/route.ts
import { NextResponse } from "next/server";
import { getAllInsights } from "@/lib/insights-content";
import type { InsightMeta, InsightKind } from "@/types/insights";

// Priority: news → articles → media → blog
const PRIORITY: InsightKind[] = ["news", "articles", "media", "blog"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(24, Number(url.searchParams.get("limit")) || 12));

  // Pull recent items (you already parse all mdx via insights-content)
  const { items } = await getAllInsights({ page: 1, pageSize: 400 });

  // Bucket by kind, then pick by priority
  const buckets = new Map<InsightKind, InsightMeta[]>(PRIORITY.map(k => [k, []]));
  for (const m of items) {
    if (buckets.has(m.kind)) buckets.get(m.kind)!.push(m);
  }

  const picked: InsightMeta[] = [];
  for (const k of PRIORITY) {
    for (const m of buckets.get(k) ?? []) {
      picked.push(m);
      if (picked.length >= limit) break;
    }
    if (picked.length >= limit) break;
  }

  return NextResponse.json({ items: picked });
}
