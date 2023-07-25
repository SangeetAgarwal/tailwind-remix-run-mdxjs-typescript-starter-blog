import type { EntryContext } from "@remix-run/node";
import { generateSitemap } from "@balavishnuvj/remix-seo";
import { siteMetadata } from "./utils/siteMetadata";
const siteUrl =
  process.env.NODE_ENV === "production"
    ? siteMetadata.siteUrl
    : "http://localhost:3000";

type Handler = (
  request: Request,
  remixContext: EntryContext
) => Promise<Response | null> | null;

export const otherRootRoutes: Record<string, Handler> = {
  "/sitemap.xml": async (request, remixContext) => {
    return generateSitemap(request, remixContext, {
      siteUrl,
    });
  },
};

export const otherRootRouteHandlers: Array<Handler> = [
  ...Object.entries(otherRootRoutes).map(([path, handler]) => {
    return (request: Request, remixContext: EntryContext) => {
      if (new URL(request.url).pathname !== path) return null;

      return handler(request, remixContext);
    };
  }),
];
