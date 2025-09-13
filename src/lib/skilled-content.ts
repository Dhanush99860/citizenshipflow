// src/lib/skilled-content.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ReactNode } from "react";

/* =========================
 * Shared Types
 * =======================*/
export type Currency = "USD" | "EUR" | "AED" | "INR" | "CAD" | "GBP" | "AUD";

/* =========================
 * Types (same API as residency; category differs) + Skilled extensions
 * =======================*/
export type CountryMeta = {
  title: string;
  category: "skilled";
  country: string;
  countrySlug: string;
  summary?: string;
  tagline?: string;
  heroImage?: string;
  heroVideo?: string;
  heroPoster?: string;
  introPoints?: string[];
  tags?: string[];
  seo?: { title?: string; description?: string; keywords?: string[] };
  lastUpdated?: string; // NEW (optional)
  draft?: boolean;
};

export type Step = { title: string; description?: string };

export type PriceRow = {
  label: string;
  amount?: number;
  currency?: Currency;
  when?: string;
  notes?: string;
};

export type GovernmentFeeRow = {
  label: string;
  amount?: number;
  currency?: Currency;
  sourceLabel?: string;
  sourceUrl?: string;
};

export type ProofOfFundsRow = {
  label?: string;
  amount: number;
  currency?: Currency;
  notes?: string;
};

export type DocumentChecklistGroup = {
  group: string;
  documents: string[];
};

export type FamilyMatrix = {
  childrenUpTo?: number;
  parentsFromAge?: number;
  siblings?: boolean;
  spouse?: boolean;
  notes?: string[];
};

export type QuickCheckConfig = {
  title?: string;
  questions?: {
    id: string;
    label: string;
    type: "boolean" | "select" | "number" | "text";
    options?: string[];
  }[];
  // NEW (optional CTAs inline with quiz)
  ctas?: {
    primaryHref?: string;
    primaryText?: string;
    secondaryHref?: string;
    secondaryText?: string;
  };
};

export type ProgramMeta = {
  title: string;
  category: "skilled";
  country: string;
  countrySlug: string;
  programSlug: string;
  tagline?: string;

  // Reused field (kept for compatibility): can be used for min salary / costs if needed.
  minInvestment?: number;

  currency?: Currency;
  timelineMonths?: number;
  processingMonths?: number; // NEW alias if you prefer this name
  tags?: string[];

  benefits?: string[];
  requirements?: string[];
  disqualifiers?: string[];
  processSteps?: Step[];
  faq?: { q: string; a: string }[];

  brochure?: string;
  prices?: PriceRow[];
  governmentFees?: GovernmentFeeRow[]; // NEW
  proofOfFunds?: ProofOfFundsRow[];

  // NEW — Skilled-specific quick facts
  salaryThreshold?: { amount: number; currency: Currency; period: "year" | "month" };
  languageMin?: { test: "IELTS" | "PTE" | "OET"; overall?: number; bands?: Record<string, number> };
  occupationListUrl?: string;
  occupationCodes?: string[];
  points?: { max?: number; recentCutoff?: number; gridUrl?: string };

  documentChecklist?: DocumentChecklistGroup[]; // NEW
  riskNotes?: string[]; // NEW
  complianceNotes?: string[]; // NEW
  familyMatrix?: FamilyMatrix; // NEW

  quickCheck?: QuickCheckConfig;
  heroImage?: string;
  heroVideo?: string;
  heroPoster?: string;

  // NEW — route metadata & freshness
  routeType?:
    | "points-tested"
    | "state-nominated"
    | "employer-sponsored"
    | "talent"
    | "provisional"
    | "other";
  lastUpdated?: string;

  // Optional interactive estimator (mirrors citizenship style)
  costEstimator?: {
    baseOptions: { id: string; label: string; amount: number }[];
    defaultBaseId?: string;
    adults?: number;
    children?: number;
    addons?: { id: string; label: string; amount: number; per?: "adult" | "child" | "person" | "application" }[];
  };

  seo?: { title?: string; description?: string; keywords?: string[] };
  draft?: boolean;
};

/** Sections map returned by loadProgramPageSections */
export type ProgramSections = Record<string, ReactNode>;

/* =========================
 * Constants & tiny utils
 * =======================*/
const ROOT = path.join(process.cwd(), "content", "skilled");

const exists = (p: string) => {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
};

const mustExist = (p: string, kind: "file" | "dir") => {
  if (!exists(p)) {
    const rel = path.relative(process.cwd(), p);
    throw new Error(`[skilled-content] ${kind} not found: ${rel}`);
  }
};

const toTitle = (slug: string) =>
  slug
    .split("-")
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(" ");

const coerceNum = (v: unknown): number | undefined => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v))) return Number(v);
  return undefined;
};

/** MDX options — NOTE: no `as const` so arrays aren't readonly */
const baseMdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
};

/** slugify section titles, e.g. "Why Choose Us?" -> "why-choose-us" */
function slugify(h: string) {
  return h
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Split MDX body by top-level `###` headings (keeps <h3>) */
function splitByH3(md: string): Record<string, string> {
  const lines = md.split(/\r?\n/);
  const out: Record<string, string> = {};
  let current: string | null = null;
  let buf: string[] = [];
  const counts = new Map<string, number>();

  const nextKey = (base: string) => {
    const n = (counts.get(base) || 0) + 1;
    counts.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };

  const flush = () => {
    if (current) out[current] = buf.join("\n").trim();
    buf = [];
  };

  for (const line of lines) {
    const m = /^###\s+(.+?)\s*$/.exec(line);
    if (m) {
      flush();
      current = nextKey(slugify(m[1]));
      buf.push(line);
    } else {
      if (!current) {
        current = nextKey("overview");
        buf.push("### Overview");
      }
      buf.push(line);
    }
  }
  flush();
  return out;
}

/* =========================
 * Lightweight in-memory cache (dev-friendly)
 * =======================*/
type Cache = {
  countries?: CountryMeta[];
  programsAll?: ProgramMeta[];
  mtimes?: Map<string, number>;
};
const _g = globalThis as any;
if (!_g.__SKILLED_CACHE__) _g.__SKILLED_CACHE__ = { mtimes: new Map() } as Cache;
const CACHE: Cache = _g.__SKILLED_CACHE__;

function mtime(file: string) {
  try {
    return fs.statSync(file).mtimeMs;
  } catch {
    return 0;
  }
}

/** Recursively stamp a directory tree (files + subfolders) */
function dirStamp(root: string): number {
  if (!exists(root)) return 0;
  let stamp = mtime(root);
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, ent.name);
    if (ent.isDirectory()) {
      stamp = Math.max(stamp, dirStamp(full));
    } else if (ent.isFile() && (ent.name.endsWith(".mdx") || ent.name.endsWith(".md"))) {
      stamp = Math.max(stamp, mtime(full));
    } else {
      stamp = Math.max(stamp, mtime(full));
    }
  }
  return stamp;
}

/* =========================
 * Normalizers
 * =======================*/
function normalizeCountry(meta: Partial<CountryMeta>, slug: string): CountryMeta {
  const countrySlug = (meta as any).countrySlug || slug;
  const country = (meta as any).country || (meta as any).title || toTitle(countrySlug);
  const title = (meta as any).title || (typeof country === "string" ? country : toTitle(countrySlug));
  // Use structured fallback aligned with residency assets
  const heroImage = (meta as any).heroImage || `/images/countries/${countrySlug}-hero-poster.jpg`;
  return {
    ...(meta as any),
    title: String(title),
    country: String(country),
    countrySlug: String(countrySlug),
    heroImage: String(heroImage),
    category: "skilled",
  } as CountryMeta;
}

function normalizeProgram(metaIn: Partial<ProgramMeta>, cSlug: string, pSlug: string): ProgramMeta {
  const meta: any = { ...metaIn };
  meta.programSlug = meta.programSlug || pSlug;
  meta.countrySlug = meta.countrySlug || cSlug;
  meta.category = "skilled";

  if (meta.minInvestment !== undefined) meta.minInvestment = coerceNum(meta.minInvestment);
  if (meta.timelineMonths !== undefined) meta.timelineMonths = coerceNum(meta.timelineMonths);
  if (meta.processingMonths !== undefined) meta.processingMonths = coerceNum(meta.processingMonths);

  if (Array.isArray(meta.prices)) {
    meta.prices = meta.prices.map((row: any) => ({
      ...row,
      amount: coerceNum(row?.amount),
    }));
  }
  if (Array.isArray(meta.proofOfFunds)) {
    meta.proofOfFunds = meta.proofOfFunds.map((row: any) => ({
      ...row,
      amount: coerceNum(row?.amount) ?? 0,
    }));
  }
  if (Array.isArray(meta.governmentFees)) {
    meta.governmentFees = meta.governmentFees.map((row: any) => ({
      ...row,
      amount: coerceNum(row?.amount),
    }));
  }

  // Ensure some string fields are strings if provided
  if (meta.occupationListUrl && typeof meta.occupationListUrl !== "string") {
    meta.occupationListUrl = String(meta.occupationListUrl);
  }
  if (Array.isArray(meta.occupationCodes)) {
    meta.occupationCodes = meta.occupationCodes.map((c: any) => String(c));
  }

  return meta as ProgramMeta;
}

/* =========================
 * Lists & slugs (sync, like residency)
 * =======================*/
export function getSkilledCountrySlugs(): string[] {
  if (!exists(ROOT)) return [];
  const cacheKey = `${ROOT}::countries_dir_mtime`;
  const stamp = dirStamp(ROOT);
  if (CACHE.countries && CACHE.mtimes?.get(cacheKey) === stamp) {
    return CACHE.countries.map((c) => c.countrySlug);
  }

  const slugs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  CACHE.mtimes?.set(cacheKey, stamp);
  return slugs;
}

export function getSkilledCountries(): CountryMeta[] {
  const stamp = dirStamp(ROOT);
  const cacheKey = `${ROOT}::countries`;
  const cacheStamp = `${ROOT}::countries_dir_mtime`;

  if (CACHE.countries && CACHE.mtimes?.get(cacheStamp) === stamp) {
    return CACHE.countries;
  }

  const out: CountryMeta[] = [];

  for (const slug of getSkilledCountrySlugs()) {
    const file = path.join(ROOT, slug, "_country.mdx");
    if (!exists(file)) continue;

    const { data } = matter(fs.readFileSync(file, "utf8"));
    const meta = normalizeCountry(data as Partial<CountryMeta>, slug);
    if (!meta.draft) out.push(meta);
  }

  const sorted = out.sort((a, b) => a.country.localeCompare(b.country));
  CACHE.countries = sorted;
  CACHE.mtimes?.set(cacheKey, Date.now());
  CACHE.mtimes?.set(cacheStamp, stamp);
  return sorted;
}

export function getSkilledProgramSlugs(countrySlug: string): string[] {
  const dir = path.join(ROOT, countrySlug);
  if (!exists(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith(".mdx") && n !== "_country.mdx")
    .map((n) => n.replace(/\.mdx$/, ""));
}

export function getSkilledPrograms(countrySlug?: string): ProgramMeta[] {
  const stamp = dirStamp(ROOT);
  const cacheKey = `${ROOT}::programsAll`;
  const cacheStamp = `${ROOT}::programs_dir_mtime`;

  if (!countrySlug && CACHE.programsAll && CACHE.mtimes?.get(cacheStamp) === stamp) {
    return CACHE.programsAll;
  }

  const countries = countrySlug ? [countrySlug] : getSkilledCountrySlugs();
  const out: ProgramMeta[] = [];

  for (const c of countries) {
    for (const p of getSkilledProgramSlugs(c)) {
      const f = path.join(ROOT, c, `${p}.mdx`);
      const { data } = matter(fs.readFileSync(f, "utf8"));
      const meta = normalizeProgram(data as Partial<ProgramMeta>, c, p);
      if (!meta?.draft) out.push(meta);
    }
  }

  const sorted = out.sort((a, b) => (a.countrySlug + a.title).localeCompare(b.countrySlug + b.title));
  if (!countrySlug) {
    CACHE.programsAll = sorted;
    CACHE.mtimes?.set(cacheKey, Date.now());
    CACHE.mtimes?.set(cacheStamp, stamp);
  }
  return sorted;
}

/* =========================
 * Renderers
 * =======================*/
export async function loadCountryPage(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  mustExist(f, "file");
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<CountryMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: baseMdxOptions as any,
    },
  });

  const meta = normalizeCountry(frontmatter as Partial<CountryMeta>, countrySlug);
  return { content, meta };
}

export async function loadProgramPage(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  mustExist(f, "file");
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<ProgramMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: baseMdxOptions as any,
    },
  });

  const meta = normalizeProgram(frontmatter as Partial<ProgramMeta>, countrySlug, programSlug);
  return { content, meta };
}

/** Section-by-section renderer (same as residency) */
export async function loadProgramPageSections(
  countrySlug: string,
  programSlug: string
): Promise<{ meta: ProgramMeta; sections: ProgramSections }> {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  mustExist(f, "file");
  const raw = fs.readFileSync(f, "utf8");
  const { data, content: body } = matter(raw);

  const meta = normalizeProgram(data as Partial<ProgramMeta>, countrySlug, programSlug);
  const chunks = splitByH3(body);

  const entries = await Promise.all(
    Object.entries(chunks).map(async ([key, md]) => {
      const { content } = await compileMDX({
        source: md,
        options: {
          parseFrontmatter: false,
          mdxOptions: baseMdxOptions as any,
        },
      });
      return [key, content] as const;
    })
  );

  const sections = Object.fromEntries(entries) as ProgramSections;
  return { meta, sections };
}

/* =========================
 * Frontmatter-only helpers
 * =======================*/
export function getProgramFrontmatter(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  mustExist(f, "file");
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return normalizeProgram(data as Partial<ProgramMeta>, countrySlug, programSlug);
}

export function getCountryFrontmatter(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  mustExist(f, "file");
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return normalizeCountry(data as Partial<CountryMeta>, countrySlug);
}

/* =========================
 * Sitemap helper
 * =======================*/
export function getSkilledUrls() {
  const urls: { url: string }[] = [{ url: "/skilled" }];
  for (const c of getSkilledCountrySlugs()) {
    urls.push({ url: `/skilled/${c}` });
    for (const p of getSkilledProgramSlugs(c)) {
      urls.push({ url: `/skilled/${c}/${p}` });
    }
  }
  return urls;
}

/* =========================
 * Dev helper
 * =======================*/
export function invalidateSkilledContentCache() {
  CACHE.countries = undefined;
  CACHE.programsAll = undefined;
}
