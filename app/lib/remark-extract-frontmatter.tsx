export default async function extractFrontmatter() {
  const { load } = await import("js-yaml");
  const { visit } = await import("unist-util-visit");
  const extractFrontmatter = () => {
    return (tree: any, file: any) => {
      visit(tree, "yaml", (node, index, parent) => {
        file.data.frontmatter = load(node.value);
      });
    };
  };
  return extractFrontmatter;
}
