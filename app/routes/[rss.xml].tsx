import type { LoaderFunction } from "@remix-run/server-runtime";
import { getAllFilesFrontMatter } from "~/lib/mdx.server";
import formatDate from "~/lib/utils/formatDate";
import { siteMetadata } from "~/utils/siteMetadata";

export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
  siteUrl?: string;
};

export function generateRss({
  description,
  entries,
  link,
  title,
}: {
  title: string;
  description: string;
  link: string;
  entries: RssEntry[];
}): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <link>${link}</link>
    <language>en-us</language>
    <ttl>60</ttl>
    <atom:link href="${
      siteMetadata.siteUrl
    }/rss.xml" rel="self" type="application/rss+xml" />
    ${entries
      .map(
        (entry) => `
      <item>
        <title><![CDATA[${entry.title}]]></title>
        <description><![CDATA[${entry.description}]]></description>
        <pubDate>${entry.pubDate}</pubDate>
        <link>${entry.link}</link>
        ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
      </item>`
      )
      .join("")}
  </channel>
</rss>`;
}

export const loader: LoaderFunction = async () => {
  const allFrontMatters = await getAllFilesFrontMatter("blog");
  allFrontMatters.forEach((frontMatter) => {
    return (frontMatter.date = formatDate(frontMatter.date));
  });
  const feed = generateRss({
    title: siteMetadata.title,
    description: siteMetadata.description,
    link: `${siteMetadata.siteUrl}/blog`,
    entries: allFrontMatters.map((post) => ({
      description: post.summary,
      pubDate: new Date(post.date).toUTCString(),
      title: post.title,
      link: `${siteMetadata.siteUrl}/${post.slug}`,
      guid: `${siteMetadata.siteUrl}/${post.slug}`,
      siteUrl: siteMetadata.siteUrl,
    })),
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};
