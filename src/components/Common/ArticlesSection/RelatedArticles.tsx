import Image from "next/image";
import Link from "next/link";
import { getAllArticlesMeta } from "@/lib/getArticles";

interface RelatedArticlesProps {
  currentSlug: string;
  tags?: string[];
}

export default async function RelatedArticles({ currentSlug, tags }: RelatedArticlesProps) {
  let articles = getAllArticlesMeta().filter((a) => a.slug !== currentSlug);

  // Match by tags first
  if (tags && tags.length > 0) {
    articles = articles.filter((a) =>
      a.tags?.some((tag) => tags.includes(tag))
    );
  }

  // fallback: just take latest ones
  const related = articles.slice(0, 3);

  if (related.length === 0) return null;

  return (
    <ul className="space-y-4">
      {related.map((article) => (
        <li key={article.slug}>
          <Link
            href={`/articles/${article.slug}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={article.image || "/images/hero/silhouettes.webp"}
                alt={article.alt || article.title || "Article"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title */}
            <p className="text-sm md:text-base font-medium line-clamp-2 text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
              {article.title}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
