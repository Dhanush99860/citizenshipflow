// src/app/api/search-index/route.ts
import "server-only";
import { NextResponse } from "next/server";

import { getResidencyCountries, getResidencyPrograms } from "@/lib/residency-content";
import { getCitizenshipCountries, getCitizenshipPrograms } from "@/lib/citizenship-content";
import { getSkilledCountries, getSkilledPrograms } from "@/lib/skilled-content";
import { getCorporateCountries, getCorporatePrograms } from "@/lib/corporate-content";
import { getAllArticlesMeta } from "@/lib/getArticles";
import { baseFromCategory } from "@/lib/section-helpers";

export async function GET() {
  const items: Array<{ title: string; type: string; url: string; tags?: string[] }> = [];

  // countries
  [
    ...getResidencyCountries(),
    ...getCitizenshipCountries(),
    ...getSkilledCountries?.() ?? [],
    ...getCorporateCountries?.() ?? [],
  ].forEach((c: any) => {
    items.push({
      title: `${c.country}`,
      type: `${c.category[0].toUpperCase()}${c.category.slice(1)} · Country`,
      url: `${baseFromCategory(c.category)}/${c.countrySlug}`,
      tags: c.tags ?? [],
    });
  });

  // programs
  [
    ...getResidencyPrograms(),
    ...getCitizenshipPrograms(),
    ...getSkilledPrograms?.() ?? [],
    ...getCorporatePrograms?.() ?? [],
  ].forEach((p: any) => {
    items.push({
      title: `${p.title} — ${p.country}`,
      type: `${p.category[0].toUpperCase()}${p.category.slice(1)} · Program`,
      url: `${baseFromCategory(p.category)}/${p.countrySlug}/${p.programSlug}`,
      tags: p.tags ?? [],
    });
  });

  // articles (optional; tag by country/program if your meta provides it)
  try {
    const articles = getAllArticlesMeta();
    for (const a of articles) {
      items.push({
        title: a.title,
        type: "Article",
        url: a.url || `/articles/${a.slug}`,
        tags: a.tags || [],
      });
    }
  } catch {}

  return NextResponse.json({ items }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
