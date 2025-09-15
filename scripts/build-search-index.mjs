// scripts/build-search-index.mjs
// Node ESM script. No TS needed. Runs before `next build`.
// Scans content & articles/news, extracts frontmatter + snippet, writes /public/search-index.json

import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

// Optional, but keeps snippets clean enough without heavy remark pipeline
function stripToText(input) {
  if (!input) return "";
  let s = input;
  // remove fenced code blocks
  s = s.replace(/```[\s\S]*?```/g, " ");
  // remove MDX components/JSX blocks <Component ...>...</Component> and self-closing
  s = s.replace(/<[^>]+>/g, " ");
  // remove markdown images/links
  s = s.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  s = s.replace(/\[[^\]]*\]\([^)]+\)/g, (m) => m.match(/\[([^\]]*)\]/)?.[1] ?? " ");
  // remove inline code
  s = s.replace(/`([^`]+)`/g, "$1");
  // collapse whitespace
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function firstChars(s, n = 180) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "…";
}

function guessTypeAndUrl(abs, repoRoot) {
  // Normalize to POSIX-like separators for matching
  const rel = abs.split(path.sep).join("/");
  const baseRel = rel.replace(repoRoot.split(path.sep).join("/") + "/", "");

  // content/<section>/<country>/_country.mdx => /<section>/<country>
  // content/<section>/<country>/<program>.mdx => /<section>/<country>/<program>
  // articles/<slug>.mdx => /articles/<slug>
  // news/<slug>.mdx => /news/<slug>
  const contentMatch = baseRel.match(/^content\/(citizenship|residency|corporate)\/([^/]+)\/([^/]+)\.mdx$/i);
  if (contentMatch) {
    const [, section, country, leaf] = contentMatch;
    if (leaf === "_country") {
      return { type: "country", url: `/${section}/${country}`, section, country, program: null };
    }
    return { type: "program", url: `/${section}/${country}/${leaf}`, section, country, program: leaf };
  }

  const articleMatch = baseRel.match(/^articles\/([^/]+)\.mdx$/i);
  if (articleMatch) {
    const slug = articleMatch[1];
    return { type: "article", url: `/articles/${slug}`, section: null, country: null, program: null };
  }

  const newsMatch = baseRel.match(/^news\/([^/]+)\.mdx$/i);
  if (newsMatch) {
    const slug = newsMatch[1];
    return { type: "news", url: `/news/${slug}`, section: null, country: null, program: null };
  }

  return { type: "page", url: "/", section: null, country: null, program: null };
}

function ensureArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  return [x];
}

async function main() {
  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, "public");
  const outputFile = path.join(publicDir, "search-index.json");

  const patterns = [
    "content/citizenship/**/*.mdx",
    "content/residency/**/*.mdx",
    "content/corporate/**/*.mdx",
    "articles/**/*.mdx",
    "news/**/*.mdx",
  ];

  const files = await fg(patterns, {
    cwd: repoRoot,
    absolute: true,
    dot: false,
  });

  /** @type {Array<any>} */
  const docs = [];

  for (const abs of files) {
    const raw = await fs.readFile(abs, "utf8");
    const { data: fm, content } = matter(raw);

    const meta = guessTypeAndUrl(abs, repoRoot);

    // Frontmatter fields we care about (with fallbacks)
    const title = (fm.title ?? "").toString().trim() || path.basename(abs, ".mdx");
    const subtitle =
      meta.type === "program"
        ? (fm.country ?? fm.countryName ?? meta.country ?? "").toString()
        : (fm.subtitle ?? fm.section ?? meta.section ?? "").toString();

    const tags = ensureArray(fm.tags).map(String);
    const summary = (fm.summary ?? fm.description ?? "").toString().trim();
    const hero = (fm.hero ?? fm.heroImage ?? fm.image ?? "").toString();
    const date = (fm.date ?? "").toString();
    const updated = (fm.updated ?? fm.lastmod ?? "").toString();

    const text = stripToText(content);
    const snippet = summary || firstChars(text, 200);

    const countries = ensureArray(fm.countries?.length ? fm.countries : (meta.country ? [meta.country] : []))
      .map((s) => s.toString().toLowerCase());
    const programs = ensureArray(fm.programs?.length ? fm.programs : (meta.program ? [meta.program] : []))
      .map((s) => s.toString().toLowerCase());

    const id = `${meta.type}:${meta.url}`;

    docs.push({
      id,
      url: meta.url,
      type: meta.type, // "country" | "program" | "article" | "news" | "page"
      title,
      subtitle: subtitle || undefined,
      tags: tags.length ? tags : undefined,
      snippet: snippet || undefined,
      hero: hero || undefined,
      date: date || undefined,
      updated: updated || undefined,
      countries,
      programs,
    });
  }

  // Ensure public/ exists
  await fs.mkdir(publicDir, { recursive: true });
  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: docs.length,
    docs,
  };
  await fs.writeFile(outputFile, JSON.stringify(payload), "utf8");
  console.log(`✓ search-index.json written (${docs.length} docs) -> ${path.relative(repoRoot, outputFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
