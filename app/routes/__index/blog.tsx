import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { getAllFilesFrontMatter } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import type { ExtendedFrontMatter } from "~/lib/types";
import ListLayout from "~/layouts/ListLayout";
import { siteMetadata } from "~/utils/siteMetadata";

export let meta = (context: any) => {
  console.log(context.params);
  let seoMeta = getSeoMeta({
    title: `Blog - ${siteMetadata.author}`,
    description: `${siteMetadata.description}`,
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async () => {
  const allFrontMatters = (await getAllFilesFrontMatter(
    "blog"
  )) as unknown as ExtendedFrontMatter[];
  return json(allFrontMatters);
};

export default function Blog() {
  const allFrontMatters = useLoaderData() as unknown as ExtendedFrontMatter[];
  return (
    <>
      <ListLayout frontMatters={allFrontMatters} title={"All Posts"} />
    </>
  );
}
