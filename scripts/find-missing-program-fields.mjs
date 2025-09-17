// scripts/find-missing-program-fields.mjs
import fg from "fast-glob";
import fs from "node:fs";
import matter from "gray-matter";

const files = await fg(["content/**/*.mdx"], { dot: false });
const bad = [];
for (const f of files) {
  const { data } = matter.read(f);
  // Heuristic: a "program" doc – adapt this if you use a different signal
  const isProgram = data.kind === "program" || data.program;
  if (isProgram) {
    const v = data.vertical;
    const c = data.country;
    const p = data.program;
    if (!v || !c || !p) bad.push({ file: f, title: data.title, vertical: v, country: c, program: p });
  }
}
console.log("Program files missing required fields:", bad.length);
console.table(bad);
if (bad.length) process.exit(1);
