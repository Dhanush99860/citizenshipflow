// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'

// Needed if you read per-request values like headers:
export const dynamic = 'force-dynamic'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers(); // <- await here

  // In proxies (Vercel, etc.), prefer x-forwarded-* first:
  const host  = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const base  = `${proto}://${host}`

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  }
}
