// src/components/careers/Perks.tsx
export default function Perks() {
  const perks = [
    { t: "Remote-first", d: "Work from anywhere with flexible hours." },
    { t: "Learning support", d: "Certification reimbursements & structured training." },
    { t: "Global team", d: "Collaborate across countries and time zones." },
    { t: "Wellbeing", d: "Paid time off and a wellness-friendly culture." },
    { t: "Equipment & tools", d: "Laptop + professional software stack." },
    { t: "Performance bonus", d: "Role-based incentives for impact." },
    { t: "Inclusive leave", d: "Parental, medical, and compassionate leave." },
    { t: "Immigration expertise", d: "Hands-on exposure to PR, citizenship, and mobility programs." },
  ];

  return (
    <section aria-labelledby="perks">
      <div
        className={[
          "rounded-3xl p-6 sm:p-8",
          "bg-gradient-to-br from-sky-50 via-white to-indigo-50 ring-1 ring-blue-100/80",
          "dark:from-blue-950/30 dark:to-indigo-950/20 dark:ring-blue-900/40",
          "text-black dark:text-white",
        ].join(" ")}
      >
        <h2 id="perks" className="text-xl font-bold tracking-tight">
          Benefits & Perks
        </h2>

        <ul role="list" className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <li
              key={p.t}
              className="rounded-xl border border-black/10 bg-white/85 p-4 ring-1 ring-black/5 dark:border-white/20 dark:bg-white/5 dark:ring-white/5"
            >
              <div className="flex items-start gap-3">
                {/* simple check icon in black/white */}
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path d="M5 10l3 3 7-7" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{p.t}</h3>
                  <p className="mt-1 text-sm">{p.d}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs opacity-80">
          Benefits may vary by location and role seniority.
        </p>
      </div>
    </section>
  );
}
