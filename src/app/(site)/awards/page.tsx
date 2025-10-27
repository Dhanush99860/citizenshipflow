import type { Metadata } from "next";
import React from "react";
import { awardsData } from "@/components/awards/awards.data";
import { HeroAwards } from "@/components/awards/HeroAwards"; // if you’re using this file
import { AwardsGrid } from "@/components/awards/AwardsGrid";
import Breadcrumb from "@/components/Common/Breadcrumb";
export const metadata: Metadata = {
  title: "Awards & Recognition",
  description:
    "Independent accolades that recognize our quality, leadership, and client service.",
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
