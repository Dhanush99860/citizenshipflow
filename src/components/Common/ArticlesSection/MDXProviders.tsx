"use client";

import { MDXProvider } from "@mdx-js/react";
import FAQItem from "@/components/Common/ArticlesSection/FAQItem";

const mdxComponents = {
  // Headings (preserve IDs for TOC to work)
  h1: ({ id, ...props }: any) => (
    <h1
      id={id}
      className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4 tracking-tight"
      {...props}
    />
  ),
  h2: ({ id, children, ...props }: any) => {
    const headingId =
      id || String(children).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    return (
      <h2
        id={headingId}
        className="text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3 tracking-tight scroll-mt-24"
        {...props}
      >
        {children}
      </h2>
    );
  },
  
  h3: ({ id, ...props }: any) => (
    <h3
      id={id}
      className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-5 mb-2"
      {...props}
    />
  ),
  h4: ({ id, ...props }: any) => (
    <h4
      id={id}
      className="text-base font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2"
      {...props}
    />
  ),

  // Body text
  p: (props: any) => (
    <p
      className="my-3 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  // Links
  a: (props: any) => (
    <a
      className="text-blue-600 dark:text-blue-400 underline decoration-dotted hover:decoration-solid hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      {...props}
    />
  ),

  // Lists
  ul: (props: any) => (
    <ul
      className="list-disc pl-6 my-3 space-y-1 text-[15px] text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal pl-6 my-3 space-y-1 text-[15px] text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  li: (props: any) => <li className="leading-relaxed">{props.children}</li>,

  // Text emphasis
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-gray-700 dark:text-gray-300" {...props} />
  ),

  // Blockquote
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 rounded-md my-5 py-2"
      {...props}
    />
  ),

  // Divider
  hr: (props: any) => (
    <hr className="my-8 border-t border-gray-300 dark:border-gray-700" {...props} />
  ),

  // Inline code
  code: (props: any) => (
    <code
      className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 text-sm font-mono"
      {...props}
    />
  ),

  // Code blocks
  pre: (props: any) => (
    <pre
      className="p-4 rounded-lg bg-gray-900 text-gray-100 text-sm overflow-x-auto my-5"
      {...props}
    />
  ),

  // Images
  img: (props: any) => (
    <img
      className="rounded-lg shadow-md my-6 max-w-full h-auto"
      loading="lazy"
      {...props}
    />
  ),

  // Figures
  figure: (props: any) => <figure className="my-6 text-center" {...props} />,
  figcaption: (props: any) => (
    <figcaption className="text-sm text-gray-500 dark:text-gray-400 mt-2" {...props} />
  ),

  // Tables
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
        {props.children}
      </table>
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
  ),
  th: (props: any) => (
    <th
      className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-200"
      {...props}
    />
  ),
  tr: (props: any) => (
    <tr
      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),

  // FAQ Component
  FAQItem,
};

export default function MDXProviders({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={mdxComponents}>{children}</MDXProvider>;
}
