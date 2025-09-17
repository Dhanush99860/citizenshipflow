"use client";
import React from "react";

type Field =
  | { id: string; label: string; type: "text" | "number"; required?: boolean }
  | { id: string; label: string; type: "boolean"; required?: boolean }
  | {
      id: string;
      label: string;
      type: "select";
      options: string[];
      required?: boolean;
    };

type Step = { id: string; title: string; fields: Field[] };
type Rule = {
  if: Partial<{
    age_lt: number;
    english_gte: number;
    liquid_funds_gte: number;
    education_in: string[];
    willing_invest: boolean;
  }>;
  add: number;
};
type Band = { min: number; label: string; color: string };
type Recommendation = {
  when_min: number;
  programs: [string, string, string][];
};
type Schema = {
  title: string;
  steps: Step[];
  scoring: Rule[];
  bands: Band[];
  recommendations: Recommendation[];
};

export default function EligibilityWizard({ schema }: { schema: Schema }) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [values, setValues] = React.useState<Record<string, any>>({});
  const step = schema.steps[stepIdx];

  const setField = (id: string, v: any) =>
    setValues((s) => ({ ...s, [id]: v }));
  const next = () => setStepIdx((i) => Math.min(i + 1, schema.steps.length));
  const prev = () => setStepIdx((i) => Math.max(i - 1, 0));

  if (stepIdx === schema.steps.length) {
    const score = schema.scoring.reduce((acc, r) => {
      const c = r.if;
      let ok = true;
      if (c.age_lt !== undefined) ok &&= (values.age ?? Infinity) < c.age_lt;
      if (c.english_gte !== undefined)
        ok &&= (values.english ?? 0) >= c.english_gte;
      if (c.liquid_funds_gte !== undefined)
        ok &&= (values.liquid_funds ?? 0) >= c.liquid_funds_gte;
      if (c.education_in !== undefined)
        ok &&= c.education_in.includes(values.education);
      if (c.willing_invest !== undefined)
        ok &&= Boolean(values.willing_invest) === c.willing_invest;
      return ok ? acc + r.add : acc;
    }, 0);

    const band = schema.bands
      .sort((a, b) => b.min - a.min)
      .find((b) => score >= b.min)!;

    const recos =
      schema.recommendations
        .sort((a, b) => b.when_min - a.when_min)
        .find((r) => score >= r.when_min)?.programs ?? [];

    return (
      <div className="space-y-4">
        <div className="text-2xl font-semibold">Your score: {score}</div>
        <div className="text-lg">
          Result: <span className="capitalize">{band.label}</span>
        </div>
        {recos.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium">Suggested programs</div>
            <ul className="list-disc pl-6">
              {recos.map(([v, c, p]) => (
                <li key={`${v}/${c}/${p}`}>
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/${v}/${c}/${p}`}
                  >{`${v} / ${c} / ${p}`}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          className="rounded-xl border px-4 py-2"
          onClick={() => setStepIdx(0)}
        >
          Start again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">{step.title}</div>
      <div className="grid gap-4">
        {step.fields.map((f) => (
          <div key={f.id} className="grid gap-2">
            <label className="font-medium">
              {f.label}
              {f.required && " *"}
            </label>

            {f.type === "text" || f.type === "number" ? (
              <input
                type={f.type}
                className="rounded-xl border p-3"
                value={values[f.id] ?? ""}
                onChange={(e) =>
                  setField(
                    f.id,
                    f.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                  )
                }
              />
            ) : f.type === "boolean" ? (
              <select
                className="rounded-xl border p-3"
                value={String(values[f.id] ?? "false")}
                onChange={(e) => setField(f.id, e.target.value === "true")}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            ) : f.type === "select" ? (
              <select
                className="rounded-xl border p-3"
                value={values[f.id] ?? ""}
                onChange={(e) => setField(f.id, e.target.value)}
              >
                <option value="" disabled>
                  Select…
                </option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {stepIdx > 0 && (
          <button className="rounded-xl border px-4 py-2" onClick={prev}>
            Back
          </button>
        )}
        <button className="rounded-xl border px-4 py-2" onClick={next}>
          Continue
        </button>
      </div>
    </div>
  );
}
