import type { MetadataRoute } from "next";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getSiteUrl } from "../lib/seo/site";

/** Walk a directory recursively and return matching files */
function walk(dir: string, filter: (f: string, d?: fs.Dirent) => boolean): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out.push(...walk(p, filter));
    else if (filter(p, d)) out.push(p);
  }
  return out;
}

/** Remove route groups like (site) */
function cleanSegment(seg: string) {
  if (seg.startsWith("(") && seg.endsWith(")")) return "";
  return seg;
}

/** Build route path from a folder containing a page.* under src/app */
function dirToRoute(dir: string): string | null {
  const rel = path.relative(path.join(process.cwd(), "src", "app"), dir).replace(/\\/g, "/");
  if (!rel) return "/";
  const parts = rel.split("/").map(cleanSegment).filter(Boolean);

  // Skip dynamic segments and any segment starting with '_' (internal)
  if (parts.some((p) => p.includes("[") || p.startsWith("_"))) return null;

  return "/" + parts.join("/");
}

/** Convert content path to route, supporting /content and /src/content */
function contentPathToRoute(file: string): string | null {
  const root1 = path.join(process.cwd(), "content");
  const root2 = path.join(process.cwd(), "src", "content");
  const base = file.startsWith(root2) ? root2 : root1;

  const rel = path.relative(base, file).replace(/\\/g, "/");
  const noExt = rel.replace(/\.mdx$/, "");
  let parts = noExt.split("/");

  // If the leaf is "index" or starts with "_" (e.g., _country), drop it (map to parent)
  const leaf = parts[parts.length - 1];
  if (leaf === "index" || leaf.startsWith("_")) parts = parts.slice(0, -1);

  // Drop any other internal segments like "_foo" anywhere in the path
  parts = parts.filter((seg) => seg && !seg.startsWith("_"));

  if (parts.length === 0) return "/"; // safety
  return "/" + parts.join("/");
}

function parseMaybeDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const urls: MetadataRoute.Sitemap = [];

  // 1) Static routes from src/app/**/page.*
  const staticPageFiles = walk(path.join(process.cwd(), "src", "app"), (f) =>
    /\/page\.(tsx|ts|jsx|js)$/.test(f.replace(/\\/g, "/"))
  );
  for (const file of staticPageFiles) {
    const routeDir = path.dirname(file);
    const route = dirToRoute(routeDir);
    if (!route || route.startsWith("/api")) continue;
    const stat = fs.statSync(file);
    urls.push({ url: `${base}${route}`.replace(/\/+$/, "") || base, lastModified: stat.mtime });
  }

  // 2) Content-driven routes from /content/**/*.mdx and /src/content/**/*.mdx
  const contentRoots = [path.join(process.cwd(), "content"), path.join(process.cwd(), "src", "content")];
  for (const root of contentRoots) {
    const mdxFiles = walk(root, (f) => f.endsWith(".mdx"));
    for (const file of mdxFiles) {
      try {
        const raw = fs.readFileSync(file, "utf8");
        const { data } = matter(raw) as { data: Record<string, any> };
        const lastmod = parseMaybeDate(data?.updatedAt) || parseMaybeDate(data?.date) || fs.statSync(file).mtime;
        const route = contentPathToRoute(file);
        if (!route) continue;
        const url = `${base}${route}`.replace(/\/+$/, "");
        urls.push({ url, lastModified: lastmod });
      } catch {}
    }
  }

  // 3) Ensure homepage exists
  if (!urls.some((u) => u.url === base || u.url === `${base}/`)) {
    urls.push({ url: base, lastModified: new Date() });
  }

  // 4) Deduplicate
  const seen = new Set<string>();
  const deduped = urls.filter((u) => !seen.has(u.url) && (seen.add(u.url), true));

  return deduped;
}
