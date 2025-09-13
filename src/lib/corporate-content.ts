import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { ReactNode } from "react";

export type CountryMeta = {
  title: string; category: "corporate"; country: string; countrySlug: string;
  summary?: string; tagline?: string; heroImage?: string; heroVideo?: string; heroPoster?: string;
  introPoints?: string[]; tags?: string[]; seo?: { title?: string; description?: string; keywords?: string[] }; draft?: boolean;
};
export type Step = { title: string; description?: string };
export type PriceRow = { label: string; amount?: number; currency?: "USD"|"EUR"|"AED"|"INR"|"CAD"|"GBP"; when?: string; notes?: string; };
export type ProofOfFundsRow = { label?: string; amount: number; currency?: "USD"|"EUR"|"AED"|"INR"|"CAD"|"GBP"; notes?: string; };
export type QuickCheckConfig = { title?: string; questions?: { id: string; label: string; type: "boolean"|"select"|"number"|"text"; options?: string[] }[]; };
export type ProgramMeta = {
  title: string; category: "corporate"; country: string; countrySlug: string; programSlug: string;
  tagline?: string; minInvestment?: number; currency?: "USD"|"EUR"|"AED"|"INR"|"CAD"|"GBP"; timelineMonths?: number;
  tags?: string[]; benefits?: string[]; requirements?: string[]; processSteps?: Step[]; faq?: { q: string; a: string }[];
  brochure?: string; prices?: PriceRow[]; proofOfFunds?: ProofOfFundsRow[]; disqualifiers?: string[]; quickCheck?: QuickCheckConfig;
  heroImage?: string; heroVideo?: string; heroPoster?: string; seo?: { title?: string; description?: string; keywords?: string[] }; draft?: boolean;
};
export type ProgramSections = Record<string, ReactNode>;

const ROOT = path.join(process.cwd(), "content", "corporate");
const exists = (p: string) => { try { fs.accessSync(p); return true; } catch { return false; } };
const toTitle = (slug: string) => slug.split("-").map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s)).join(" ");
const coerceNum = (v: unknown): number | undefined => typeof v === "number" ? v : (typeof v === "string" && v.trim() && !isNaN(+v) ? +v : undefined);
const baseMdxOptions = { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] };
const slugify = (h: string) => h.toLowerCase().replace(/&/g,"and").replace(/[^\w\s-]/g,"").trim().replace(/\s+/g,"-");
function splitByH3(md: string): Record<string,string> {
  const lines = md.split(/\r?\n/); const out: Record<string,string> = {}; let current: string | null = null; let buf: string[] = [];
  const counts = new Map<string,number>(); const nextKey = (b: string)=>{const n=(counts.get(b)||0)+1;counts.set(b,n);return n===1?b:`${b}-${n}`};
  const flush=()=>{ if(current) out[current]=buf.join("\n").trim(); buf=[]; };
  for(const line of lines){ const m=/^###\s+(.+?)\s*$/.exec(line);
    if(m){ flush(); current=nextKey(slugify(m[1])); buf.push(line); }
    else { if(!current){ current=nextKey("overview"); buf.push("### Overview"); } buf.push(line); }
  } flush(); return out;
}

function normalizeCountry(meta: Partial<CountryMeta>, slug: string): CountryMeta {
  const countrySlug = meta.countrySlug || slug;
  const country = meta.country || meta.title || toTitle(countrySlug);
  const title = meta.title || (typeof country === "string" ? country : toTitle(countrySlug));
  const heroImage = meta.heroImage || `/images/${countrySlug}.jpg`;
  return { ...meta, title: String(title), country: String(country), countrySlug: String(countrySlug), heroImage: String(heroImage), category: "corporate" } as CountryMeta;
}
function normalizeProgram(metaIn: Partial<ProgramMeta>, cSlug: string, pSlug: string): ProgramMeta {
  const meta: any = { ...metaIn };
  meta.programSlug = meta.programSlug || pSlug;
  meta.countrySlug = meta.countrySlug || cSlug;
  meta.category = "corporate";
  if (meta.minInvestment !== undefined) meta.minInvestment = coerceNum(meta.minInvestment);
  if (meta.timelineMonths !== undefined) meta.timelineMonths = coerceNum(meta.timelineMonths);
  if (Array.isArray(meta.prices)) meta.prices = meta.prices.map((r: any) => ({ ...r, amount: coerceNum(r?.amount) }));
  if (Array.isArray(meta.proofOfFunds)) meta.proofOfFunds = meta.proofOfFunds.map((r: any) => ({ ...r, amount: coerceNum(r?.amount) ?? 0 }));
  return meta as ProgramMeta;
}

export function getCorporateCountrySlugs(): string[] {
  if (!exists(ROOT)) return [];
  return fs.readdirSync(ROOT, { withFileTypes: true }).filter((d)=>d.isDirectory()).map((d)=>d.name);
}
export function getCorporateCountries(): CountryMeta[] {
  const out: CountryMeta[] = [];
  for (const slug of getCorporateCountrySlugs()) {
    const file = path.join(ROOT, slug, "_country.mdx");
    if (!exists(file)) continue;
    const { data } = matter(fs.readFileSync(file, "utf8"));
    const meta = normalizeCountry(data as Partial<CountryMeta>, slug);
    if (!meta.draft) out.push(meta);
  }
  return out.sort((a,b)=>a.country.localeCompare(b.country));
}
export function getCorporateProgramSlugs(countrySlug: string): string[] {
  const dir = path.join(ROOT, countrySlug);
  if (!exists(dir)) return [];
  return fs.readdirSync(dir).filter((n)=>n.endsWith(".mdx") && n !== "_country.mdx").map((n)=>n.replace(/\.mdx$/,""));
}
export function getCorporatePrograms(countrySlug?: string): ProgramMeta[] {
  const countries = countrySlug ? [countrySlug] : getCorporateCountrySlugs();
  const out: ProgramMeta[] = [];
  for (const c of countries) {
    for (const p of getCorporateProgramSlugs(c)) {
      const f = path.join(ROOT, c, `${p}.mdx`);
      const { data } = matter(fs.readFileSync(f,"utf8"));
      const meta = normalizeProgram(data as Partial<ProgramMeta>, c, p);
      if (!meta?.draft) out.push(meta);
    }
  }
  return out.sort((a,b)=>(a.countrySlug + a.title).localeCompare(b.countrySlug + b.title));
}

export async function loadCountryPage(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<CountryMeta>({ source, options: { parseFrontmatter: true, mdxOptions: baseMdxOptions as any } });
  const meta = normalizeCountry(frontmatter as Partial<CountryMeta>, countrySlug);
  return { content, meta };
}
export async function loadProgramPage(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const source = fs.readFileSync(f, "utf8");
  const { content, frontmatter } = await compileMDX<ProgramMeta>({ source, options: { parseFrontmatter: true, mdxOptions: baseMdxOptions as any } });
  const meta = normalizeProgram(frontmatter as Partial<ProgramMeta>, countrySlug, programSlug);
  return { content, meta };
}
export async function loadProgramPageSections(countrySlug: string, programSlug: string): Promise<{ meta: ProgramMeta; sections: Record<string, ReactNode> }> {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const raw = fs.readFileSync(f, "utf8");
  const { data, content: body } = matter(raw);
  const meta = normalizeProgram(data as Partial<ProgramMeta>, countrySlug, programSlug);
  const chunks = splitByH3(body);
  const entries = await Promise.all(Object.entries(chunks).map(async ([key, md]) => {
    const { content } = await compileMDX({ source: md, options: { parseFrontmatter: false, mdxOptions: baseMdxOptions as any } });
    return [key, content] as const;
  }));
  return { meta, sections: Object.fromEntries(entries) };
}

export function getProgramFrontmatter(countrySlug: string, programSlug: string) {
  const f = path.join(ROOT, countrySlug, `${programSlug}.mdx`);
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return normalizeProgram(data as Partial<ProgramMeta>, countrySlug, programSlug);
}
export function getCountryFrontmatter(countrySlug: string) {
  const f = path.join(ROOT, countrySlug, "_country.mdx");
  const { data } = matter(fs.readFileSync(f, "utf8"));
  return normalizeCountry(data as Partial<CountryMeta>, countrySlug);
}
export function getCorporateUrls() {
  const urls: { url: string }[] = [{ url: "/corporate" }];
  for (const c of getCorporateCountrySlugs()) {
    urls.push({ url: `/corporate/${c}` });
    for (const p of getCorporateProgramSlugs(c)) urls.push({ url: `/corporate/${c}/${p}` });
  }
  return urls;
}
export function invalidateCorporateContentCache() {}
