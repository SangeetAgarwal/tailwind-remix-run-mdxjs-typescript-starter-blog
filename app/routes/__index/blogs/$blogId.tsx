import type { LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import { getFileBySlug } from "~/lib/utils/mdx.server";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }: { params: any }) => {
  const id = params.blogId;
  const post = await getFileBySlug("blog", id);
  return { post };
};
export default function Blog() {
  const {
    post,
  }: {
    post: {
      mdxSource: string;
      toc: [{ value: string; url: string; depth: number }];
      frontMatter: {
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
    };
  } = useLoaderData();

  return (
    <>
      {post.frontMatter.draft !== true ? (
        <div>
          <MDXLayoutRenderer
            mdxSource={post.mdxSource}
            layout={"PostSimple"}
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
