// src/lib/insights-content.ts
"use server";
import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import mdxComponents from "@/components/MDX/registry";

import type {
  Facets,
  GetAllInsightsParams,
  Heading,
  InsightKind,
  InsightMeta,
  InsightRecord,
} from "@/types/insights";

/* ────────────────────────────────────────────────────────────────────────── */
/* constants                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const INSIGHT_KINDS: InsightKind[] = ["articles", "news", "media", "blog"];
const DEV = process.env.NODE_ENV !== "production";

/* ────────────────────────────────────────────────────────────────────────── */
/* types                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

type RawDoc = {
  kind: InsightKind;
  slug: string;
  filePath: string;
  source: string;
  data: Record<string, unknown>;
};

/* ────────────────────────────────────────────────────────────────────────── */
/* helpers                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

function assertKind(kind: string): kind is InsightKind {
  return INSIGHT_KINDS.includes(kind as InsightKind);
}

function toUrl(kind: InsightKind, slug: string) {
  switch (kind) {
    case "articles":
      return `/articles/${slug}`;
    case "news":
      return `/news/${slug}`;
    case "media":
      return `/media/${slug}`;
    case "blog":
      return `/blog/${slug}`;
  }
}

function normalizeArray(val?: unknown): string[] | undefined {
  if (val == null) return undefined;
  if (Array.isArray(val)) return val.map((v) => String(v));
  const s = String(val).trim();
  if (!s) return undefined;
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function coerceString(val?: unknown): string | undefined {
  if (val == null) return undefined;
  const s = String(val).trim();
  return s || undefined;
}

function readingTimeMins(text: string) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function slugify(text: string, existing: Set<string>) {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\/^$*+?.()|[\]{}]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  let out = base;
  let i = 1;
  while (existing.has(out)) out = `${base}-${i++}`;
  existing.add(out);
  return out;
}

function extractHeadingsForToc(source: string): Heading[] {
  const lines = source.split(/\r?\n/);
  const seen = new Set<string>();
  const res: Heading[] = [];
  for (const line of lines) {
    const h2 = /^##\s+(.*)$/.exec(line);
    const h3 = /^###\s+(.*)$/.exec(line);
    if (h2) res.push({ id: slugify(h2[1], seen), text: h2[1].trim(), depth: 2 });
    else if (h3) res.push({ id: slugify(h3[1], seen), text: h3[1].trim(), depth: 3 });
  }
  return res;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* disk scan                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

async function loadRawDocs(): Promise<RawDoc[]> {
  const patterns = [
    "content/articles/**/*.mdx",
    "content/news/**/*.mdx",
    "content/media/**/*.mdx",
    "content/blog/**/*.mdx",
  ];

  const files = await fg(patterns, {
    cwd: process.cwd(),
    absolute: true,
    onlyFiles: true,
    dot: false,
  });

  if (DEV) console.log(`[insights] matched files: ${files.length}`);

  const out: RawDoc[] = [];
  for (const filePath of files) {
    const file = await fs.readFile(filePath, "utf8");
    const { content, data } = matter(file);

    const relFromContent = path.relative(path.join(process.cwd(), "content"), filePath);
    const kindDir = relFromContent.split(path.sep)[0];
    if (!assertKind(kindDir)) continue;

    const slug = path.basename(filePath, ".mdx");
    out.push({ kind: kindDir as InsightKind, slug, filePath, source: content, data });
  }

  return out;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* meta + sort                                                               */
/* ────────────────────────────────────────────────────────────────────────── */

function metaFromRaw(raw: RawDoc): InsightMeta {
  const title = coerceString(raw.data.title) ?? raw.slug;
  const summary = coerceString(raw.data.summary);

  // Support string or { name: string }
  const author =
    coerceString(raw.data.author) ?? coerceString((raw.data as any).author?.name);

  const country = normalizeArray(raw.data.country) ?? normalizeArray((raw.data as any).countries);
  const program = normalizeArray(raw.data.program) ?? normalizeArray((raw.data as any).programs);
  const tags = normalizeArray(raw.data.tags) ?? [];

  const hero =
    coerceString((raw.data as any).hero) ||
    coerceString((raw.data as any).heroImage) ||
    coerceString((raw.data as any).image);

  const heroAlt = coerceString((raw.data as any).heroAlt) || title;

  // Detail hero video/poster (optional)
  const heroVideo =
    coerceString((raw.data as any).heroVideo) ||
    coerceString((raw.data as any).video) ||
    coerceString((raw.data as any).videoSrc);

  const heroPoster =
    coerceString((raw.data as any).heroPoster) ||
    coerceString((raw.data as any).poster) ||
    undefined;

  const date = coerceString(raw.data.date);
  const updated = coerceString((raw.data as any).updated) || coerceString((raw.data as any).lastmod);
  const url = toUrl(raw.kind, raw.slug);
  const readingTime = readingTimeMins(raw.source);

  return {
    kind: raw.kind,
    slug: raw.slug,
    title,
    summary,
    author,
    country: country && country.length ? country : undefined,
    program: program && program.length ? program : undefined,
    tags,
    hero: hero || undefined,
    heroAlt,
    heroVideo,
    heroPoster,
    date,
    updated,
    readingTimeMins: readingTime,
    url,
  };
}

function sortByDateDesc(a: InsightMeta, b: InsightMeta) {
  const da = new Date(a.updated || a.date || 0).getTime();
  const db = new Date(b.updated || b.date || 0).getTime();
  return db - da;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* cache                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

let _cache: { metas: InsightMeta[]; raw: RawDoc[]; loadedAt: number } | null = null;

async function ensureCache() {
  if (!DEV && _cache) return _cache; // reuse in prod

  const raw = await loadRawDocs();
  const metas = raw.map(metaFromRaw).sort(sortByDateDesc);
  const next = { metas, raw, loadedAt: Date.now() };
  if (!DEV) _cache = next;
  return next;
}

/* ────────────────────────────────────────────────────────────────────────── */
/* queries                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

export async function getAllInsights(params: GetAllInsightsParams = {}) {
  const { metas } = await ensureCache();
  const { q, kind, country, program, tag, page = 1, pageSize = 12 } = params;

  let filtered = metas.slice();

  if (kind) filtered = filtered.filter((m) => m.kind === kind);
  if (country)
    filtered = filtered.filter((m) =>
      (m.country ?? []).map((c: string) => c.toLowerCase()).includes(country.toLowerCase())
    );
  if (program)
    filtered = filtered.filter((m) =>
      (m.program ?? []).map((p: string) => p.toLowerCase()).includes(program.toLowerCase())
    );
  if (tag)
    filtered = filtered.filter((m) =>
      (m.tags ?? []).map((t: string) => t.toLowerCase()).includes(tag.toLowerCase())
    );

  if (q) {
    const needle = q.toLowerCase();
    filtered = filtered.filter((m) => {
      const hay = [
        m.title,
        m.summary,
        (m.tags ?? []).join(" "),
        (m.country ?? []).join(" "),
        (m.program ?? []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }

  filtered.sort(sortByDateDesc);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = filtered.slice(start, end);

  return { items, total, page, pageSize };
}

export async function getInsightsFacets(): Promise<Facets> {
  const { metas } = await ensureCache();
  const kinds: InsightKind[] = Array.from(new Set(metas.map((m) => m.kind))) as InsightKind[];
  const countries = Array.from(new Set(metas.flatMap((m) => m.country ?? []))).sort((a, b) =>
    a.localeCompare(b)
  );
  const programs = Array.from(new Set(metas.flatMap((m) => m.program ?? []))).sort((a, b) =>
    a.localeCompare(b)
  );
  const tags = Array.from(new Set(metas.flatMap((m) => m.tags ?? []))).sort((a, b) =>
    a.localeCompare(b)
  );
  return { kinds, countries, programs, tags };
}

export async function getInsightBySlug(
  kind: InsightKind,
  slug: string
): Promise<InsightRecord | null> {
  const { raw } = await ensureCache();
  const entry = raw.find((r) => r.kind === kind && r.slug === slug);
  if (!entry) return null;

  const headings = extractHeadingsForToc(entry.source);

  // MDX components registry (must include FAQSection)
  const componentsMap = (mdxComponents as Record<string, unknown>) || {};
  if (DEV) console.log("[mdx components keys]", Object.keys(componentsMap));

  // IMPORTANT: components at TOP LEVEL (runtime needs this on your version).
  // Cast to satisfy TS if local type definition doesn’t include `components`.
  const args = {
    source: entry.source,
    components: componentsMap as Record<string, any>,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm] as any,
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: ["anchor"] },
            },
          ],
        ] as any,
      },
    },
  } as unknown as Parameters<typeof compileMDX>[0];

  const { content } = await compileMDX(args);

  const meta = metaFromRaw(entry);
  return { ...meta, headings, content };
}

export async function getRelatedContent(current: InsightMeta, limit = 3): Promise<InsightMeta[]> {
  const { metas } = await ensureCache();
  const curTags = new Set((current.tags ?? []).map((t: string) => t.toLowerCase()));
  const curCountries = new Set((current.country ?? []).map((c: string) => c.toLowerCase()));
  const curPrograms = new Set((current.program ?? []).map((p: string) => p.toLowerCase()));

  const scored = metas
    .filter((m) => m.url !== current.url)
    .map((m) => {
      let score = 0;
      for (const t of m.tags ?? []) if (curTags.has(t.toLowerCase())) score += 2;
      for (const c of m.country ?? []) if (curCountries.has(c.toLowerCase())) score += 1;
      for (const p of m.program ?? []) if (curPrograms.has(p.toLowerCase())) score += 1;
      if (m.kind === current.kind) score += 1;
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || sortByDateDesc(a.m, b.m));

  return scored.slice(0, limit).map((x) => x.m);
}
