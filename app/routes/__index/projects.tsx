import type { SEOHandle } from "@balavishnuvj/remix-seo";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Card } from "~/components/Card";
import projectsData from "~/data/projectsData";
import { getSeoMeta } from "~/seo";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    return [{ route: `/projects`, priority: 0.7 }];
  },
};

export let meta = (context: any) => {
  let seoMeta = getSeoMeta({
    title: "Projects",
    description: "Showcase your projects with a hero image (16 x 9)",
  });
  return {
    ...seoMeta,
  };
};

export const loader: LoaderFunction = async () => {
  const projects = projectsData;
  return json(projects);
};
export default function Projects() {
  const projects = useLoaderData();
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Showcase your projects with a hero image (16 x 9)
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projects.map((d: any) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
