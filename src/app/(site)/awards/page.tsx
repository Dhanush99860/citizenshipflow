import type { Metadata } from "next";
import React from "react";
import { awardsData } from "@/components/awards/awards.data";
import { HeroAwards } from "@/components/awards/HeroAwards"; // hero stays static for optimal LCP
// Dynamically import heavier components below the fold to reduce initial JS payload and improve performance【330944343751455†L23-L112】.
import nextDynamic from "next/dynamic";

// Dynamically import the client components. When the module exports named components (no default export),
// we must explicitly select the correct export in the promise to avoid passing the entire module to the
// client component. If we omit the selector, Next.js will attempt to use the default export and end up
// passing the module object itself, which triggers a runtime error (“Only plain objects can be passed…”)【709169303420970†screenshot】.
const AwardsGrid = nextDynamic(() =>
  import("@/components/awards/AwardsGrid").then((mod) => mod.AwardsGrid)
);

// Breadcrumb has a default export, so importing the module directly is fine. However, we still load it
// dynamically to keep the initial JS payload small.
const Breadcrumb = nextDynamic(() =>
  import("@/components/Common/Breadcrumb").then((mod) => mod.default)
);
export const metadata: Metadata = {
  title: "Awards & Recognition",
  description:
    "Independent accolades that recognize our quality, leadership, and client service.",
  alternates: { canonical: "/awards" },
  openGraph: {
    title: "Awards & Recognition",
    description:
      "Independent accolades that recognize our quality, leadership, and client service.",
    url: "https://www.xiphiasimmigration.com/awards",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Awards & Recognition – XIPHIAS Immigration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awards & Recognition",
    description:
      "Independent accolades that recognize our quality, leadership, and client service.",
    images: ["/og.jpg"],
  },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:py-12">
      <HeroAwards />
              {/* breadcrumb under the card */}
              <div>
          <Breadcrumb />
        </div>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-white">Awards & Recognition</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            A curated selection of our most meaningful honors.
          </p>
        </div>
        <AwardsGrid items={awardsData} />
      </section>
    </main>
  );
}