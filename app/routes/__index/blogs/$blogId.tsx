import type { LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Post } from "~/lib/utils/mdx.server";
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
    post: Post;
  } = useLoaderData();
  return (
    <>
      {post.extendedFrontMatter.draft !== true ? (
        <div>
          <MDXLayoutRenderer
            mdxSource={post.mdxSource}
            layout={"PostSimple"}
            extendedFrontMatter={post.extendedFrontMatter}
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
