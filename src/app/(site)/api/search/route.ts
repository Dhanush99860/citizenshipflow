// app/api/search/route.ts
import { NextRequest } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import MiniSearch from "minisearch";
import type { SearchDoc, SearchIndexFile, ApiSearchResponse } from "@/types/search";

export const runtime = "nodejs"; // Fuse/MiniSearch prefer Node
export const dynamic = "force-dynamic";
export const revalidate = 0;

let cachedDocs: SearchDoc[] | null = null;
let mini: MiniSearch<SearchDoc> | null = null;

function expandQuery(q: string) {
  // Simple synonym/alias expansion
  const normalized = q.toLowerCase();
  const add: string[] = [];
  if (normalized.includes("golden visa")) add.push("residency by investment", "greece golden visa", "portugal golden visa");
  if (/\bcbi\b/.test(normalized)) add.push("citizenship by investment");
  if (/\bebi\b/.test(normalized)) add.push("employment based immigration");
  if (/\bep\b/.test(normalized)) add.push("employment pass");
  if (normalized.includes("startup visa")) add.push("start up visa", "start-up visa");
  if (normalized.includes("real estate")) add.push("property investment");
  return [q, ...add];
}

async function loadIndex(): Promise<SearchDoc[]> {
  if (cachedDocs) return cachedDocs;

  const file = path.join(process.cwd(), "public", "search-index.json");
  const json = await fs.readFile(file, "utf8");
  let parsed: SearchIndexFile | SearchDoc[];
  try {
    parsed = JSON.parse(json);
  } catch {
    parsed = [] as SearchDoc[];
  }

  const docs = Array.isArray(parsed) ? (parsed as SearchDoc[]) : (parsed as SearchIndexFile).docs;
  cachedDocs = docs ?? [];
  return cachedDocs;
}

function buildMiniSearch(docs: SearchDoc[]) {
  if (mini) return mini;
  mini = new MiniSearch<SearchDoc>({
    fields: ["title", "subtitle", "tags", "snippet"],
    storeFields: ["id", "url", "type", "title", "subtitle", "tags", "snippet", "hero", "date", "updated", "countries", "programs"],
    searchOptions: {
      boost: { title: 4, subtitle: 2, tags: 1.5, snippet: 1 },
      fuzzy: 0.2, // edit distance tolerance
      prefix: true,
    },
  });
  mini.addAll(docs);
  return mini;
}

export async function GET(req: NextRequest) {
  const t0 = performance.now();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 25);
  const types = (searchParams.get("types") || "").split(",").filter(Boolean) as Array<SearchDoc["type"]>;

  if (!q) {
    return Response.json(
      { query: "", tookMs: 0, count: 0, items: [] } as ApiSearchResponse,
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const docs = await loadIndex();
  const ms = buildMiniSearch(docs);

  const queries = expandQuery(q);
  const seen = new Map<string, number>(); // id -> best score

  for (const part of queries) {
    const results = ms.search(part, {
      filter: types.length ? (doc) => types.includes(doc.type) : undefined,
    });
    for (const r of results) {
      const prev = seen.get(r.id);
      const score = r.score ?? 0;
      if (prev == null || score < prev) {
        // MiniSearch: lower score is better? (No: higher is better). Adjust if needed:
        // In MiniSearch, higher score is better. Keep the max.
        if (prev == null || score > prev) seen.set(r.id, score);
      }
    }
  }

  // Build final items in order of score desc
  const idToDoc = new Map(docs.map((d) => [d.id, d]));
  const items = Array.from(seen.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id, score]) => ({ ...(idToDoc.get(id) as SearchDoc), score }));

  const tookMs = Math.round(performance.now() - t0);

  const res = Response.json(
    { query: q, tookMs, count: items.length, items } as ApiSearchResponse,
    {
      headers: {
        // CDN friendly
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=600",
      },
    }
  );
  return res;
}
