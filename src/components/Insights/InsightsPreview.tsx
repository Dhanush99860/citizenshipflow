import { getAllInsights } from "@/lib/insights-content";
import InsightsPreviewClient from "./InsightsPreviewClient";

export default async function InsightsPreview({
  limit = 8,
  title = "From the Insights",
  viewAllHref = "/insights",
  ariaLabel = "Insights preview slider",
}: {
  limit?: number;
  title?: string;
  viewAllHref?: string;
  ariaLabel?: string;
}) {
  const { items } = await getAllInsights({ pageSize: limit });
  if (!items?.length) return null;

  return (
    <InsightsPreviewClient
      items={items}
      title={title}
      viewAllHref={viewAllHref}
      ariaLabel={ariaLabel}
    />
  );
}
