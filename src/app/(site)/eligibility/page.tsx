import fs from "node:fs";
import path from "node:path";
import EligibilityWizard from "./components/EligibilityWizard";

function readSchema(name: string) {
  const file = path.join(
    process.cwd(),
    "src",
    "app",
    "(site)",
    "eligibility",
    "schema",
    `${name}.json`,
  );
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export default function EligibilityPage() {
  const schema = readSchema("residency"); // add more schemas later
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Eligibility Checker</h1>
      <EligibilityWizard schema={schema} />
    </main>
  );
}
