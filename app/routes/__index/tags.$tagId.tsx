import { json, type LoaderFunction } from "@remix-run/server-runtime";
import type { Params } from "@remix-run/react";
import { getAllFilesFrontMatter } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import type { AllFrontMatter } from "~/lib/types";
import kebabCase from "~/lib/utils/kebabCase";
import ListLayout from "~/layouts/ListLayout";
import { siteMetadata } from "~/utils/siteMetadata";

export let meta = (context: any) => {
  console.log(context.params);
  let seoMeta = getSeoMeta({
    title: `${context.params.tagId} - ${siteMetadata.author}`,
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
  const id = params.tagId;
  if (id) {
    const allFrontMatters = (await getAllFilesFrontMatter(
      "blog"
    )) as unknown as AllFrontMatter[];
    const filteredFrontMatters = allFrontMatters.filter(
      (post) =>
        post.draft !== true &&
        post.tags.map((tag) => kebabCase(tag)).includes(id)
    );
    return json({ filteredFrontMatters, id });
  }
};

export default function Tag() {
  const { filteredFrontMatters, id: tag } = useLoaderData();
  const title = tag[0].toUpperCase() + tag.split(" ").join("-").slice(1);
  return (
    <>
      <ListLayout frontMatters={filteredFrontMatters} title={title} />
    </>
  );
}
