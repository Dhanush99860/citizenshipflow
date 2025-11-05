"use client";

// src/components/MDX/MDXProviders.tsx

/**
 * Minimal provider: safe drop-in replacement for the old Articles MDXProviders.
 * You can enrich this later (e.g., map <a> to <Link>, custom components, etc.)
 */
export default function MDXProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

