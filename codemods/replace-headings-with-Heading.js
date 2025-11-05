/**
 * Replaces raw <h2..h6> with <Heading level={N}> across src/.
 * Leaves <h1> untouched.
 * Injects: import { Heading } from "@/components/ui/heading/Heading"
 */
const j = require("jscodeshift");
const IMPORT_PATH = "@/components/ui/heading/Heading";

function ensureImport(root) {
  const has = root.find(j.ImportDeclaration, { source: { value: IMPORT_PATH } }).size() > 0;
  if (has) return;
  const decl = j.importDeclaration([j.importSpecifier(j.identifier("Heading"))], j.literal(IMPORT_PATH));
  const first = root.find(j.ImportDeclaration).at(0);
  if (first.size()) first.insertBefore(decl);
  else root.get().node.program.body.unshift(decl);
}

module.exports = function transformer(file) {
  const root = j(file.source);
  let changed = false;

  // Opening tags <h2..h6>
  root.find(j.JSXOpeningElement, { name: { type: "JSXIdentifier" } }).forEach(p => {
    const name = p.node.name.name;
    if (/^h[2-6]$/.test(name)) {
      const level = Number(name.slice(1));
      p.node.name = j.jsxIdentifier("Heading");
      // add/update level prop
      const hasLevel = (p.node.attributes || []).some(a =>
        a.type === "JSXAttribute" && a.name && a.name.name === "level"
      );
      if (!hasLevel) {
        p.node.attributes = p.node.attributes || [];
        p.node.attributes.push(
          j.jsxAttribute(j.jsxIdentifier("level"), j.jsxExpressionContainer(j.literal(level)))
        );
      }
      changed = true;
    }
  });

  // Closing tags </h2..h6>
  root.find(j.JSXClosingElement, { name: { type: "JSXIdentifier" } }).forEach(p => {
    const name = p.node.name.name;
    if (/^h[2-6]$/.test(name)) {
      p.node.name = j.jsxIdentifier("Heading");
      changed = true;
    }
  });

  if (changed) ensureImport(root);
  return changed ? root.toSource({ quote: "double", reuseWhitespace: false }) : null;
};
