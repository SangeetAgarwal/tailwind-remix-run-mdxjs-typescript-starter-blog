import type { UnistTreeType, UnistNodeType } from "~/types/server";

export default async function extractFrontmatter() {
  const { load } = await import("js-yaml");
  const { visit } = await import("unist-util-visit");
  const extractFrontmatter = () => {
    return (tree: UnistTreeType, file: any) => {
      visit(tree, "yaml", (node: UnistNodeType) => {
        file.data.frontmatter = load(node.value);
      });
    };
  };
  return extractFrontmatter;
}
