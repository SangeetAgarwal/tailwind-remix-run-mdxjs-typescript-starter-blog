import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Params } from "@remix-run/react";
import type { Post } from "~/lib/mdx.server";
import { getFileBySlug } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeo, getSeoMeta, getSeoLinks } from "~/seo";

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: `About - ${context.data.authorFrontMatter.name}`,
    description: `${context.data.authorFrontMatter.name}, ${context.data.authorFrontMatter.occupation}`,
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async () => {
  const author = await getFileBySlug("authors", "default");
  return json(author);
};

export default function About() {
  const author = useLoaderData();
  return (
    <>
      <div>
        <MDXLayoutRenderer
          mdxSource={author.mdxSource}
          layout={"AuthorLayout"}
          authorFrontMatter={author.authorFrontMatter}
        />
      </div>
    </>
  );
}
