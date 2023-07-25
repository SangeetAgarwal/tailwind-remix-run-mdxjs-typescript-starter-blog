import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { Link, useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import { siteMetadata } from "~/utils/siteMetadata";
import { getAllTags } from "~/lib/tags.server";
import kebabCase from "~/lib/utils/kebabCase";
import Tag from "~/components/Tag";
import type { SEOHandle } from "@balavishnuvj/remix-seo";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    return [{ route: `/tags`, priority: 0.7 }];
  },
};

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: `Tags - ${siteMetadata.author}`,
    description: "Things I've written about.",
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async () => {
  const tags = await getAllTags("blog");
  return json(tags);
};

export default function Tags() {
  const tags = useLoaderData();
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(tags).length === 0 && "No tags found."}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mb-2 mr-5 mt-2">
                <Tag text={t} />
                <Link
                  to={`/tags/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
