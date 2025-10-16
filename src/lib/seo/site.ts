export function getSiteUrl() {
  // Prefer explicit site URL (set this on Vercel prod once your real domain is live)
  let base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";

  // Vercel preview fallback
  if (!base && process.env.VERCEL_URL) {
    base = `https://${process.env.VERCEL_URL}`;
  }

  // Local dev fallback
  if (!base) base = "http://localhost:3000";

  return base.replace(/\/+$/, "");
}
