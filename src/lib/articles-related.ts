import { getAllArticlesMeta } from "@/lib/getArticles";

export function getRelatedArticlesForProgram(opts: {
  vertical: "residency" | "citizenship" | "skilled" | "corporate";
  country: string;
  tags?: string[];
  limit?: number;
}) {
  const { vertical, country, tags = [], limit = 6 } = opts;
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const arts = getAllArticlesMeta();

  const scored = arts.map((a: any) => {
    let s = 0;
    if (Array.isArray(a.verticals) && a.verticals.includes(vertical)) s += 2;
    if (Array.isArray(a.countries) && a.countries.includes(country)) s += 2;
    if (Array.isArray(a.tags)) for (const t of a.tags) if (tagSet.has(String(t).toLowerCase())) s += 1;
    return [a, s] as const;
  });

  return scored
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([a]) => a);
}
