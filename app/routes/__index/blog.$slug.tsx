import { json, type LoaderFunction } from "@remix-run/server-runtime";
import { MDXLayoutRenderer } from "~/components/MDXComponents";
import PageTitle from "~/components/PageTitle";
import type { Params } from "@remix-run/react";
import { getAllFilesFrontMatter, getFileBySlug } from "~/lib/mdx.server";
import { useLoaderData } from "@remix-run/react";
import { getSeoMeta } from "~/seo";
import formatDate from "~/lib/utils/formatDate";
import type { SEOHandle } from "@balavishnuvj/remix-seo";
import { siteMetadata } from "~/utils/siteMetadata";
import type { ReadTimeResults } from "reading-time";
import type { PostProps } from "~/types";

const DEFAULT_LAYOUT = "PostSimpleLayout";

export const handle: SEOHandle = {
  getSitemapEntries: async (request) => {
    const allFrontMatters = await getAllFilesFrontMatter("blog");
    return allFrontMatters.map((blog) => {
      return { route: `/blog/${blog.slug}`, priority: 0.7 };
    });
  },
};

export let meta = (context: {
  data: {
    frontMatter: {
      date: string | null;
      title: any;
      description: any;
      images: string[];
      readingTime: ReadTimeResults;
      slug: string | null;
      fileName: string;
    };
  };
}) => {
  let seoMeta = getSeoMeta({
    title: context.data.frontMatter.title,
    description: context.data.frontMatter.description,
    twitter: {
      card: "summary_large_image",
      site: `${siteMetadata.siteUrl}`,
      creator: `${siteMetadata.twitterUsername}`,
      title: context.data.frontMatter.title,
      description: context.data.frontMatter.description,
      image: {
        url: context.data.frontMatter.images
          ? `${siteMetadata.siteUrl}${context.data.frontMatter.images[0]}`
          : "",
        alt: context.data.frontMatter.title,
      },
    },
    openGraph: {
      description: context.data.frontMatter.description,
      title: context.data.frontMatter.title,
      url: `${siteMetadata.siteUrl}/blog/${context.data.frontMatter.slug}`,
      type: "article",
      article: {
        authors: [`${siteMetadata.author}`],
      },
      images: context.data.frontMatter.images
        ? context.data.frontMatter.images.map((image) => {
            return {
              url: `${siteMetadata.siteUrl}${image}`,
              alt: context.data.frontMatter.title,
            };
          })
        : [],
    },
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
  const slug = params.slug;
  if (slug) {
    const post: PostProps = await getFileBySlug("blog", slug);
    post.frontMatter.date = formatDate(post.frontMatter.date!);
    const canonical = `${siteMetadata.siteUrl}/blog/${post.frontMatter.slug}`;
    post["canonical"] = canonical;
    return json(post);
  }
};

export default function Blog() {
  const post = useLoaderData();
  return (
    <>
      {post.frontMatter.draft !== true ? (
        <div>
          <MDXLayoutRenderer
            mdxSource={post.mdxSource}
            layout={post.frontMatter.layout || DEFAULT_LAYOUT}
            frontMatter={post.frontMatter}
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
