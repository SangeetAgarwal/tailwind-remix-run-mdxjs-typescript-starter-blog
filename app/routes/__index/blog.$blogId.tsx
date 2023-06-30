import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Params } from "@remix-run/react";
import { getFileBySlug } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";

const DEFAULT_LAYOUT = "PostSimple";

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: context.data.blogFrontMatter.title,
    description: context.data.blogFrontMatter.description,
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
  const id = params.blogId;
  if (id) {
    const post = await getFileBySlug("blog", id);
    return json(post);
  }
};

export default function Blog() {
  const post = useLoaderData();
  return (
    <>
      {post.blogFrontMatter.draft !== true ? (
        <div>
          <MDXLayoutRenderer
            mdxSource={post.mdxSource}
            layout={post.blogFrontMatter.layout || DEFAULT_LAYOUT}
            blogFrontMatter={post.blogFrontMatter}
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
