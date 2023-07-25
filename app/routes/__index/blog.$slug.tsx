import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Params } from "@remix-run/react";
import { getAllFilesFrontMatter, getFileBySlug } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import formatDate from "~/lib/utils/formatDate";
import type { SEOHandle } from "@balavishnuvj/remix-seo";

const DEFAULT_LAYOUT = "PostSimpleLayout";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    const allFrontMatters = await getAllFilesFrontMatter("blog");
    return allFrontMatters.map((blog) => {
      return { route: `/blog/${blog.slug}`, priority: 0.7 };
    });
  },
};

export let meta = (context: {
  data: { frontMatter: { title: any; description: any } };
}) => {
  let seoMeta = getSeoMeta({
    title: context.data.frontMatter.title,
    description: context.data.frontMatter.description,
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async ({
  params,
}: {
  params: Params;
}) => {
  const slug = params.slug;
  if (slug) {
    const post = await getFileBySlug("blog", slug);
    post.frontMatter.date = formatDate(post.frontMatter.date!);
    return json(post);
  }
};

export default function Blog() {
  const post = useLoaderData();
  return (
    <>
      {post.frontMatter.draft !== true ? (
        <div>
          <MDXLayoutRenderer
            mdxSource={post.mdxSource}
            layout={post.frontMatter.layout || DEFAULT_LAYOUT}
            frontMatter={post.frontMatter}
            toc={post.toc}
          />
        </div>
      ) : (
        <>
          <div className="mt-24 text-center">
            <PageTitle>
              Under Construction{" "}
              <span role="img" aria-label="roadwork sign">
                🚧
              </span>
            </PageTitle>
          </div>
        </>
      )}
    </>
  );
}
