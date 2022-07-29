import type { IReadTimeResults } from "reading-time";
import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import getAllFilesRecursively from "./files";
import matter from "gray-matter";
import path from "path";
import readingTime from "reading-time";
import remarkExtractFrontmatter from "./remark-extract-frontmatter";

export type Toc = { value: string; url: string; depth: number };

export type AllFrontMatter = FrontMatter & {
  slug: string;
  date: string;
};

export type PrevNext = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  draft: boolean;
  summary: string;
};

export type FrontMatter = {
  title: string;
  date: string;
  draft: boolean;
  tags: string[];
  summary: string;
  images: string[];
  authors: string[];
  layout: string;
  canonicalUrl: string;
};

export type ExtendedFrontMatter = FrontMatter & {
  readingTime: IReadTimeResults;
  slug: string | null;
  fileName: string;
  draft: boolean;
  date: string;
};

export type Post = {
  mdxSource: string;
  toc: Toc[];
  extendedFrontMatter: ExtendedFrontMatter;
  layout: string | null;
};

const root = process.cwd();
export function getFiles(type: string) {
  const prefixPaths = path.join(root, "data", type);
  const files = getAllFilesRecursively(prefixPaths);
  // Only want to return blog/path and ignore root, replace is needed to work on Windows
  return files.map((file: string) =>
    file.slice(prefixPaths.length + 1).replace(/\\/g, "/")
  );
}

export async function getAllFilesFrontMatter(folder: string) {
  const prefixPaths = path.join(root, "app", "data", folder);

  const files = getAllFilesRecursively(prefixPaths);

  const allFrontMatter: { slug: string; date: string | null }[] = [];

  files.forEach((file: string) => {
    // Replace is needed to work on Windows
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, "/");
    // Remove Unexpected File
    if (path.extname(fileName) !== ".md" && path.extname(fileName) !== ".mdx") {
      return;
    }
    const source = fs.readFileSync(file, "utf8");
    const { data: frontmatter } = matter(source);
    if (frontmatter.draft !== true) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName),
        date: frontmatter.date
          ? new Date(frontmatter.date).toISOString()
          : null,
      });
    }
  });

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date));
}

export function formatSlug(slug: string) {
  return slug.replace(/\.(mdx|md)/, "");
}

export function dateSortDesc(
  a: string | number | null,
  b: string | number | null
) {
  if (a !== null && b !== null) {
    if (a > b) return -1;
    if (a < b) return 1;
  }
  return 0;
}
export async function getFileBySlug(type: string, slug: string) {
  const remarkExtractFrontmatterThen = await remarkExtractFrontmatter();

  const BananaSlug = (await import("github-slugger")).default;
  const { toString } = await import("mdast-util-to-string");
  const { visit } = await import("unist-util-visit");
  const remarkGfm = (await import("remark-gfm")).default;
  const rehypeCitation = (await import("rehype-citation")).default;
  const remarkFootnotes = (await import("remark-footnotes")).default;
  const rehypePrismPlus = (await import("rehype-prism-plus")).default;
  const rehypeAutolinkHeadings = (await import("rehype-autolink-headings"))
    .default;
  const rehypeKatex = (await import("rehype-katex")).default;
  const rehypePresetMinify = (await import("rehype-preset-minify")).default;
  const remarkMath = (await import("remark-math")).default;

  const remarkCodeTitles = () => {
    return (tree: any) =>
      visit(tree, "code", (node, index, parent) => {
        const nodeLang = node.lang || "";
        let language = "";
        let title = "";

        if (nodeLang.includes(":")) {
          language = nodeLang.slice(0, nodeLang.search(":"));
          title = nodeLang.slice(nodeLang.search(":") + 1, nodeLang.length);
        }

        if (!title) {
          return;
        }

        const className = "remark-code-title";

        const titleNode = {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            { type: "mdxJsxAttribute", name: "className", value: className },
          ],
          children: [{ type: "text", value: title }],
          data: { _xdmExplicitJsx: true },
        };

        parent.children.splice(index, 0, titleNode);
        node.lang = language;
      });
  };
  const remarkTocHeadings = (options: { exportRef: Toc[] }) => {
    return (tree: any) => {
      return visit(tree, "heading", (node, index, parent) => {
        const textContent = toString(node);
        options.exportRef.push({
          value: textContent,
          url: "#" + BananaSlug.slug(textContent),
          depth: node.depth,
        });
      });
    };
  };
  const { default: rehypeSlug } = await import("rehype-slug");

  const mdxPath = path.join(root, "app", "data", type, `${slug}.mdx`);
  const mdPath = path.join(root, "app", "data", type, `${slug}.md`);
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, "utf8")
    : fs.readFileSync(mdPath, "utf8");

  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      root,
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  let toc: Toc[] = [{ value: "", url: "", depth: 0 }];

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    // so, say we import any component(s) in our MDX file, then those components
    // will be imported from the components directory
    cwd: path.join(root, "app", "components"),

    mdxOptions(options, frontmatter): any {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatterThen,
        // collects all headings i.e. ## {name of heading} into a toc array
        // this toc is then passed as prop to the <TOCInline toc={props.toc} /> component
        [remarkTocHeadings, { exportRef: toc }],
        // https://github.com/remarkjs/remark-gfm
        // say you have
        // Here is a simple footnote[^1]. With some additional text after it.
        // [^1]: My reference.
        // it will now create a footnote at bottom of page with the text
        // "My reference." & the link to the footnote. Plus a backlink to the
        // footnote.
        [remarkFootnotes, { inlineNotes: true }],
        // https://github.com/remarkjs/remark-gfm
        // remarkGfm is supposed to do what remarkFootnotes does & more but atleast for
        // for footnotes I couldn't get it to work.
        remarkGfm,
        // Whereever you have a code block like
        // ```js: nameofjs.js
        // some code
        // ```
        // it will automatically add a title to the code block
        remarkCodeTitles,
        // https://github.com/remarkjs/remark-math/tree/main
        remarkMath,
        // this changes the default img tag in markdown i.e. ! to Image component
        // remarkImgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        //  ids to headings. It looks for headings (so <h1> through <h6>)
        //  that do not yet have ids and adds id attributes to them based on
        //  the text they contain. The algorithm that does this is github-slugger,
        //  which matches how GitHub works.
        rehypeSlug,
        // https://github.com/rehypejs/rehype-autolink-headings
        rehypeAutolinkHeadings,
        // https://github.com/remarkjs/remark-math/tree/main#example-katex
        rehypeKatex,
        // https://github.com/timlrx/rehype-citation
        [rehypeCitation, { path: path.join(root, "app", "data") }],
        // https://github.com/timlrx/rehype-prism-plus
        // line numbers and code block highlighting
        [rehypePrismPlus, { ignoreMissing: true }],
        // minify html
        rehypePresetMinify,
      ];
      return options;
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        ".js": "jsx",
      };
      return options;
    },
  });

  return {
    mdxSource: code,
    toc,
    extendedFrontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  };
}
