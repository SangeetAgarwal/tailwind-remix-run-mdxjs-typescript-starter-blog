import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Params } from "@remix-run/react";
import { getFileBySlug } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeo, getSeoMeta, getSeoLinks } from "~/seo";

// export let meta = (context: any) => {
//   let seoMeta = getSeoMeta({
//     title: context.data.extendedFrontMatter.title,
//     description: context.data.extendedFrontMatter.description,
//   });
//   return {
//     ...seoMeta,
//   };
// };

export const loader: LoaderFunction = async ({
  params,
}: {
  params: Params;
}) => {
  const id = params.tagId;
  return json({ id });
};

export default function Blog() {
  return (
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
  );
}
