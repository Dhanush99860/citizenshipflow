import Link from "next/link";

export type SitemapGroup = {
  title: string;
  items: { label: string; href: string; children?: { label: string; href: string }[] }[];
};

export type ExtraLinkGroup = {
  title: string;
  links: { label: string; href: string; badge?: string }[];
};

export default function GuideSidebar({
  eligibilityHref,
  residencyEligibilityHref,
  corporateEligibilityHref,
  sitemap,
  extraGroups = [],
}: {
  eligibilityHref: string;
  residencyEligibilityHref: string;
  corporateEligibilityHref: string;
  sitemap: SitemapGroup[];
  extraGroups?: ExtraLinkGroup[];
}) {
  return (
    <div className="lg:sticky lg:top-20 space-y-4">

      {/* Extra links (your custom redirects/shortcuts) */}
      {extraGroups?.length ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-black dark:text-white">Shortcuts</h3>
          <div className="mt-2 space-y-3">
            {extraGroups.map((g) => (
              <div key={g.title}>
                <div className="text-xs uppercase tracking-wide text-black/80 dark:text-white/80">{g.title}</div>
                <ul className="mt-1 space-y-1.5">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex items-center gap-2 text-sm text-blue-700 hover:underline dark:text-blue-300">
                        {l.label}
                        {l.badge ? (
                          <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                            {l.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Sitemap (auto from menu) */}
      <nav className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-black dark:text-white">Site map</h3>

        {/* Mobile: collapsible with details/summary (no JS) */}
        <div className="mt-2 space-y-2 lg:max-h-[60vh] lg:overflow-auto pr-1">
          {sitemap.map((group) => (
            <details key={group.title} className="rounded-lg bg-white dark:bg-zinc-900 open:shadow-sm" open>
              <summary className="cursor-pointer select-none rounded-lg px-2 py-1.5 text-sm font-medium text-black hover:bg-zinc-50 dark:text-white dark:hover:bg-zinc-800">
                {group.title}
              </summary>
              <ul className="px-2 pb-2">
                {group.items.map((country) => (
                  <li key={country.href} className="py-1">
                    <Link href={country.href} className="text-sm font-medium text-blue-700 hover:underline dark:text-blue-300">
                      {country.label}
                    </Link>
                    {country.children?.length ? (
                      <ul className="mt-1 ml-3 list-disc space-y-0.5">
                        {country.children.map((p) => (
                          <li key={p.href} className="marker:text-zinc-400 dark:marker:text-zinc-600">
                            <Link href={p.href} className="text-[13px] text-black hover:underline dark:text-white">
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </nav>
    </div>
  );
}
