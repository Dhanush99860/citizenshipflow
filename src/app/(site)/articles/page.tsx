import { getAllInsights } from "@/lib/insights-content";
import InsightsList from "@/components/Insights/InsightsList";
export const revalidate = 86400;
export default async function ArticlesListPage() {
  const { items } = await getAllInsights({ kind: "article" });
  return (
    <main className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <InsightsList items={items} />
    </main>
  );
}
