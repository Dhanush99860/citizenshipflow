// app/(site)/Blog/page.tsx
import { getAllInsights } from "@/lib/insights-content";
import InsightsList from "@/components/Insights/InsightsList";
export const revalidate = 86400;
export default async function BlogListPage() {
  const { items } = await getAllInsights({ kind: "blog" });
  return (
    <main className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <InsightsList items={items} />
    </main>
  );
}
