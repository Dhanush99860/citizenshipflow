// src/app/booking/page.tsx
import BookingRouteClient from "./route-client";

export default async function Page({
  searchParams,
}: {
  // 🔵 Next 15: searchParams is a Promise
  searchParams: Promise<{ plan?: "free" | "paid" }>;
}) {
  const sp = await searchParams; // ✅ await it
  const plan = (sp?.plan === "paid" ? "paid" : "free") as "free" | "paid";
  return <BookingRouteClient plan={plan} />;
}