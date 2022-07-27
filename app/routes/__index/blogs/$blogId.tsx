import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import { getFileBySlug } from "~/lib/utils/mdx.server";

export const loader: LoaderFunction = async ({ params }: { params: any }) => {
  const id = params.blogId;
  const post = await getFileBySlug("blog", id);
  return { post };
};
export default function Blog() {
  const { post } = useLoaderData();

  return (
    <div>
      <MDXLayoutRenderer
        mdxSource={post.mdxSource}
        layout={'PostSimple'}
        frontMatter={post.frontMatter}
        toc={post.toc}
      />
    </div >)
}
