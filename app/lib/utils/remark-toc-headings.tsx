import BananaSlug from "github-slugger";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export default function remarkTocHeadings(options: {
  exportRef: { value: string; url: string; depth: any }[];
}) {
  return (tree: any) =>
    visit(tree, "heading", (node, index, parent) => {
      const textContent = toString(node);
      options.exportRef.push({
        value: textContent,
        url: "#" + new BananaSlug().slug(textContent),
        depth: node.depth,
      });
    });
}
