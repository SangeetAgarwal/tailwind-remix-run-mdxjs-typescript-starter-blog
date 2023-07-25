import { json, type LoaderFunction } from "@remix-run/server-runtime";
import type { Params } from "@remix-run/react";
import { getAllFilesFrontMatter } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import kebabCase from "~/lib/utils/kebabCase";
import ListLayout from "~/layouts/ListLayout";
import { siteMetadata } from "~/utils/siteMetadata";
import formatDate from "~/lib/utils/formatDate";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import { getAllTags } from "~/lib/tags.server";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    const tags = await getAllTags("blog");
    return Object.keys(tags).map((tag) => {
      return { route: `/tags/${tag}`, priority: 0.7 };
    });
  },
};

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: `${context.params.tag} - ${siteMetadata.author}`,
    description: `${context.params.tagId} tags - ${siteMetadata.author}`,
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
  const tag = params.tag;
  if (tag) {
    const allFrontMatters = await getAllFilesFrontMatter("blog");
    const filteredFrontMatters = allFrontMatters.filter(
      (post) =>
        post.draft !== true &&
        post.tags.map((tag) => kebabCase(tag)).includes(tag)
    );
    filteredFrontMatters.forEach((frontMatter) => {
      return (frontMatter.date = formatDate(frontMatter.date));
    });
    return json({ filteredFrontMatters, tag });
  }
};

export default function Tag() {
  const { filteredFrontMatters, tag } = useLoaderData();
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
  return (
    <>
      <ListLayout posts={filteredFrontMatters} title={title} />
    </>
  );
}
