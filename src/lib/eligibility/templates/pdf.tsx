import type { Result, Track, AnswerMap } from "@/lib/eligibility/types";

// Simple HTML string; convert to PDF with Puppeteer later.
export function renderEligibilityPDFHtml({
  name,
  track,
  answers,
  result,
}: {
  name: string;
  track: Track;
  answers: AnswerMap;
  result: Result;
}) {
  return /* html */ `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Eligibility Report</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px}
      h1,h2{margin:0 0 8px}
      .card{border:1px solid #e5e5e5;border-radius:12px;padding:16px;margin:12px 0}
      .muted{color:#666}
      pre{background:#f7f7f7;padding:12px;border-radius:8px;white-space:pre-wrap}
    </style>
  </head>
  <body>
    <h1>Eligibility Report</h1>
    <p class="muted">Name: ${name || "-"}</p>
    <p class="muted">Track: ${track}</p>

    <div class="card">
      <h2>Result</h2>
      <p><b>${result.tier}</b> — ${result.summary}</p>
      <ul>
        ${result.programs.map((p) => `<li><b>${p.name}</b> — ${p.why}</li>`).join("")}
      </ul>
    </div>

    <div class="card">
      <h2>Your Inputs</h2>
      <pre>${Object.entries(answers)
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join("\n")}</pre>
    </div>

    <p>Next step: visit https://www.xiphiasimmigration.com/contact to speak with an advisor.</p>
  </body>
  </html>`;
}
