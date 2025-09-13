// src/lib/getArticles.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export type ArticleMeta = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  author?: string;
  authorImg?: string;
  image?: string;
  alt?: string;
  readTime?: string;
  wordCount?: number;
  tags?: string[];
  faqs?: { question: string; answer: string }[];
};

const ARTICLES_DIR = path.join(process.cwd(), "markdown", "articles");

/**
 * Get all articles metadata (listing page).
 */
export function getAllArticlesMeta(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const list = files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const full = path.join(ARTICLES_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data, content } = matter(raw);

    // ✅ Word count & read time
    const wordCount = content ? content.split(/\s+/).length : 0;
    const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

    return {
      slug,
      title: (data.title as string) || "Untitled",
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      updated: (data.updated as string) || undefined,
      author: (data.author as string) || "Admin",
      authorImg: (data.authorImg as string) || undefined,
      image: (data.coverImage as string) || "/images/default.jpg",
      alt: (data.alt as string) || "",
      readTime,
      wordCount,
      tags: (data.tags as string[]) || [],
      faqs: (data.faqs as { question: string; answer: string }[]) || [],
    } as ArticleMeta;
  });

  // ✅ Sort by date (newest first). If missing, keep original order.
  return list.sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return +new Date(b.date) - +new Date(a.date);
  });
}

/**
 * Get single article (content + meta + TOC).
 */
export async function getArticleBySlug(slug: string) {
  const filePathMd = path.join(ARTICLES_DIR, `${slug}.mdx`);
  const filePathMdAlt = path.join(ARTICLES_DIR, `${slug}.md`);
  let fullPath = "";

  if (fs.existsSync(filePathMd)) fullPath = filePathMd;
  else if (fs.existsSync(filePathMdAlt)) fullPath = filePathMdAlt;
  else return null;

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  // ✅ Auto calculate word count & read time
  const wordCount = content ? content.split(/\s+/).length : 0;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  // ✅ Build a simple TOC from ## and ### headings
  const toc: { id: string; title: string; depth: number }[] = [];
  const headingRegex = /^#{2,3}\s+(.*)$/gm;
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(content)) !== null) {
    const title = m[1].trim();
    const depth = m[0].startsWith("###") ? 3 : 2;
    const id = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    toc.push({ id, title, depth });
  }

  // ✅ Compile MDX for next-mdx-remote
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    },
    scope: data,
  });

  const meta: ArticleMeta = {
    slug,
    title: (data.title as string) || "Untitled",
    description: (data.description as string) || "",
    date: (data.date as string) || "",
    updated: (data.updated as string) || undefined,
    author: (data.author as string) || "Admin",
    authorImg: (data.authorImg as string) || undefined,
    image: (data.coverImage as string) || "/images/default.jpg",
    alt: (data.alt as string) || "",
    readTime,
    wordCount,
    tags: (data.tags as string[]) || [],
    faqs: (data.faqs as { question: string; answer: string }[]) || [],
  };

  return { meta, mdxSource, toc };
}
