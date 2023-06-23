import { Toc } from "./types";

export const remarkTocHeadings = async (options: { exportRef: Toc[] }) => {
  const BananaSlug = (await import("github-slugger")).default;
  const { toString } = await import("mdast-util-to-string");
  const { visit } = await import("unist-util-visit");
  return (tree: any) => {
    return visit(tree, "heading", (node: any, index: any, parent: any) => {
      const textContent = toString(node);
      options.exportRef.push({
        value: textContent,
        url: "#" + BananaSlug.slug(textContent),
        depth: node.depth,
      });
    });
  };
};
