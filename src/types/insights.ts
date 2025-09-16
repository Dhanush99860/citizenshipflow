export type InsightKind = "articles" | "news" | "media" | "blog";

export type Heading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type InsightMeta = {
  kind: InsightKind;
  slug: string;
  title: string;
  summary?: string;
  author?: string;
  /** Always normalized to arrays */
  country?: string[];
  program?: string[];
  tags?: string[];
  hero?: string;
  heroAlt?: string;
  date?: string;    // ISO
  updated?: string; // ISO
  readingTimeMins?: number;
  url: string;
};

export type InsightRecord = InsightMeta & {
  headings?: Heading[];
  // MDX ReactNode (opaque)
  content?: any;
};

export type GetAllInsightsParams = {
  q?: string;
  kind?: InsightKind;
  country?: string;
  program?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

export type Facets = {
  kinds: InsightKind[];
  countries: string[];
  programs: string[];
  tags: string[];
};
