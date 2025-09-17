// Tiny rehype transformer to turn invalid <link>text</link> into <a>text</a>
// (but leaves proper self-closing <link ... /> tags alone)
export function rehypeFixInvalidLinkChildren() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node && typeof node === "object") {
        if (
          node.type === "element" &&
          node.tagName === "link" &&
          Array.isArray(node.children) &&
          node.children.length > 0
        ) {
          node.tagName = "a"; // treat as normal anchor
        }
        if (Array.isArray(node.children)) node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}
