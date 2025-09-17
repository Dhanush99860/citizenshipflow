// src/app/(site)/[vertical]/[country]/[program]/page.tsx
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllContentCached } from "@/lib/content";
import { getRelated } from "@/lib/content/related";
import type { Vertical, ProgramDoc } from "@/lib/content/types";
import { JsonLd } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";

import path from "node:path";
import fg from "fast-glob";

const VERTICALS: Vertical[] = ["residency", "citizenship", "skilled", "corporate"];

export async function generateStaticParams() {
  // derive params from folder structure, skip files starting with "_"
  const root = path.join(process.cwd(), "content");
  const files = await fg(
    [
      "residency/*/*.mdx",
      "citizenship/*/*.mdx",
      "skilled/*/*.mdx",
      "corporate/*/*.mdx",
    ],
    { cwd: root, onlyFiles: true, dot: false }
  );

  return files
    .map((rel) => rel.replace(/\\/g, "/")) // windows-safe
    .map((rel) => {
      const [vertical, country, file] = rel.split("/");
      const program = path.posix.basename(file, ".mdx");
      return { vertical, country, program } as {
        vertical: string;
        country: string;
        program: string;
      };
    })
    .filter(
      (p) =>
        VERTICALS.includes(p.vertical as Vertical) &&
        p.country &&
        p.program &&
        !p.program.startsWith("_")
    );
}

export const dynamicParams = false;

export default async function ProgramPage({
  params,
}: {
  params: { vertical: Vertical; country: string; program: string };
}) {
  const { vertical, country, program } = params;

  if (!VERTICALS.includes(vertical) || !country || !program) return notFound();

  const doc = getAllContentCached().find(
    (d): d is ProgramDoc =>
      d.kind === "program" &&
      d.vertical === vertical &&
      d.country === country &&
      d.program === program
  );
  if (!doc) return notFound();

  const mdx = await compileMDX({
    source: doc.body,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
      },
    },
  });

  const related = getRelated(doc, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: doc.vertical, item: `/${doc.vertical}` },
      { "@type": "ListItem", position: 3, name: doc.country, item: `/${doc.vertical}/${doc.country}` },
      { "@type": "ListItem", position: 4, name: doc.title, item: doc.url },
    ],
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-[2fr_1fr]">
      <JsonLd data={breadcrumbLd} />

      <article className="space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">{doc.title}</h1>
          {doc.summary && <p className="opacity-80">{doc.summary}</p>}
        </header>

        <div className="prose max-w-none">{mdx.content}</div>

        {doc.brochure && (
          <a
            className="inline-block rounded-xl border px-4 py-2 hover:bg-gray-50"
            href={doc.brochure}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download brochure
          </a>
        )}

        {doc.faq?.length ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">FAQ</h2>
            <ul className="mt-3 space-y-3">
              {doc.faq.map((f, i) => (
                <li key={i}>
                  <details>
                    <summary className="font-medium">{f.q}</summary>
                    <div className="mt-1 opacity-80">{f.a}</div>
                  </details>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>

      <aside className="space-y-4">
        <div className="rounded-2xl border p-4">
          <h3 className="mb-3 font-semibold">Related</h3>
          <ul className="space-y-2">
            {related.map((it) => (
              <li key={it.url}>
                <Link className="hover:underline" href={it.url}>
                  {it.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
