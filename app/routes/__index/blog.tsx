import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { getAllFilesFrontMatter } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import ListLayout from "~/layouts/ListLayout";
import { siteMetadata } from "~/utils/siteMetadata";
import formatDate from "~/lib/utils/formatDate";
import type { SEOHandle } from "@balavishnuvj/remix-seo";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    return [{ route: `/blog`, priority: 0.7 }];
  },
};

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: `Blog - ${siteMetadata.author}`,
    description: `${siteMetadata.description}`,
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async () => {
  const allFrontMatters = await getAllFilesFrontMatter("blog");
  allFrontMatters.forEach((frontMatter) => {
    return (frontMatter.date = formatDate(frontMatter.date));
  });
  return json(allFrontMatters);
};

export default function Blog() {
  const allFrontMatters = useLoaderData();
  return (
    <>
      <ListLayout posts={allFrontMatters} title={"All Posts"} />
    </>
  );
}
