/* eslint-disable @typescript-eslint/no-unused-vars */

import type {
  AppData,
  HtmlLinkDescriptor,
  HtmlMetaDescriptor,
} from "@remix-run/server-runtime";

import type { Location } from "history";
import type { Params } from "@remix-run/react";
import type { RouteData } from "@remix-run/server-runtime/dist/routeData";

export function initSeo(defaultConfig?: SeoConfig): {
  getSeo: SeoFunction;
  getSeoMeta: SeoMetaFunction;
  getSeoLinks: SeoLinkFunction;
} {
  const getSeo = (
    cfg?: SeoConfig | ((routeArgs?: RouteArgs) => SeoConfig) | undefined,
    routeArgs?: RouteArgs
  ): [HtmlMetaDescriptor, HtmlLinkDescriptor[]] => {
    const config = resolveConfig(defaultConfig, cfg, routeArgs);
    let meta = getMeta(config, routeArgs);
    let links = getLinks(config, routeArgs);
    return [meta, links];
  };

  const getSeoMeta = (
    cfg?: SeoConfig | ((routeArgs?: RouteArgs) => SeoConfig) | undefined,
    routeArgs?: RouteArgs
  ): HtmlMetaDescriptor => {
    const config = resolveConfig(defaultConfig, cfg, routeArgs);
    let meta = getMeta(config, routeArgs);
    return meta;
  };

  const getSeoLinks = (
    cfg?: SeoConfig | ((routeArgs?: RouteArgs) => SeoConfig) | undefined,
    routeArgs?: RouteArgs
  ): HtmlLinkDescriptor[] => {
    const config = resolveConfig(defaultConfig, cfg, routeArgs);
    let links = getLinks(config, routeArgs);
    return links;
  };
  return {
    getSeo,
    getSeoMeta,
    getSeoLinks,
  };
}

export default initSeo;

function getMeta(config: SeoConfig, routeArgs?: RouteArgs) {
  const meta: HtmlMetaDescriptor = {};
  const title = getSeoTitle(config);
  const {
    canonical,
    description,
    facebook,
    omitGoogleBotMeta = false,
    openGraph,
    robots = {},
    twitter,
  } = config;

  if (title) {
    meta.title = title;
  }

  if (description) {
    meta.description = description;
  }

  // Robots meta tags
  const {
    maxImagePreview,
    maxSnippet,
    maxVideoPreview,
    noArchive,
    noFollow,
    noImageIndex,
    noIndex,
    noSnippet,
    noTranslate,
    unavailableAfter,
  } = robots;

  const robotsParams = [
    noArchive && "noarchive",
    noImageIndex && "noimageindex",
    noSnippet && "nosnippet",
    noTranslate && "notranslate",
    maxImagePreview && `max-image-preview:${maxImagePreview}`,
    maxSnippet && `max-snippet:${maxSnippet}`,
    maxVideoPreview && `max-video-preview:${maxVideoPreview}`,
    unavailableAfter && `unavailable-after:${unavailableAfter}`,
  ];

  const robotsParam =
    (noIndex ? "noindex" : "index") +
    "," +
    (noFollow ? "nofollow" : "follow") +
    robotsParams.filter(Boolean).join(",");

  meta.robots = robotsParam;

  if (!omitGoogleBotMeta) {
    meta.googlebot = robotsParam;
  }

  if (twitter) {
    if (twitter.title || title) {
      meta["twitter:title"] = twitter.title || title;
    }

    if (twitter.description || openGraph?.description || description) {
      meta["twitter:description"] = twitter.description || description;
    }

    if (twitter.card) {
      const cardType = validateTwitterCard(twitter);
      meta["twitter:card"] = cardType;
    }

    if (twitter.site) {
      meta["twitter:site"] =
        typeof twitter.site === "object" ? twitter.site.id : twitter.site;
    }

    if (twitter.creator) {
      meta["twitter:creator"] =
        typeof twitter.creator === "object"
          ? twitter.creator.id
          : twitter.creator;
    }

    if (hasTwitterImageMeta(twitter)) {
      warnIfInvalidUrl(
        twitter.image.url,
        `twitter image tag must be valid, absolute url. Relative paths will not work,
			 check \`twitter.image.url\` in your config.`
      );
      meta["twitter:image"] = twitter.image.url;
      if (twitter.image!.alt) {
        meta["twitter:image:alt"] = twitter.image.alt;
      } else {
        warn(
          "twitter image tag must have alt attribute, this is important for folks who are visually impaired."
        );
      }
    }

    if (hasTwitterPlayerMeta(twitter)) {
      if (twitter.player.url) {
        warnIfInvalidUrl(
          twitter.player.url,
          `The twitter:image tag must be a valid, absolute URL. Relative paths will not work as
					 expected. Check the config's \`twitter.image.url\` value.`
        );
        meta["twitter:player"] = twitter.player.url;
      }

      if (twitter.player.stream) {
        warnIfInvalidUrl(
          twitter.player.stream,
          `The twitter:image tag must be a valid, 
				absolute URL. Relative paths will not work as expected. Check the config's \`twitter.player.stream\` value.`
        );
        meta["twitter:player:stream"] = twitter.player.stream;
      }

      if (twitter.player.height) {
        meta["twitter:player:height"] = twitter.player.height.toString();
      }

      if (twitter.player.width) {
        meta["twitter:player:width"] = twitter.player.width.toString();
      }
    }

    if (hasTwitterAppMeta(twitter)) {
      const twitterDevices = ["iPhone", "iPad", "googlePlay"] as const;

      if (typeof twitter.app.name === "object") {
        for (const device of twitterDevices) {
          if (twitter.app.name[device]) {
            meta[`twitter:app:name:${device}`] = twitter.app.name[device];
          }
        }
      } else {
        meta["twitter:app:name:iphone"] = twitter.app.name;
        meta["twitter:app:name:ipad"] = twitter.app.name;
        meta["twitter:app:name:googlePlay"] = twitter.app.name;
      }

      if (typeof twitter.app.id === "object") {
        for (const device of twitterDevices) {
          if (twitter.app.id[device]) {
            meta[`twitter:app:id:${device}`] = twitter.app.id[device];
          }
        }
      }

      if (typeof twitter.app.url === "object") {
        for (const device of twitterDevices) {
          if (twitter.app.url[device]) {
            meta[`twitter:app:url:${device}`] = twitter.app.url[device];
          }
        }
      }
    }

    if (!meta["twitter:card"]) {
      if (hasTwitterPlayerMeta(twitter)) {
        meta["twitter:card"] = "player";
      } else if (hasTwitterAppMeta(twitter)) {
        meta["twitter:card"] = "app";
      } else if (hasTwitterImageMeta(twitter)) {
        meta["twitter:card"] = "summary";
      }
    }
  }

  // eslint-disable-next-line no-empty
  if (facebook) {
    if (facebook.appId) {
      meta["fb:app_id"] = facebook.appId;
    }
  }

  // OG: Other stuff
  if (openGraph?.title || title) {
    meta["og:title"] = openGraph?.title || title;
  }

  if (openGraph?.description || description) {
    meta["og:description"] = openGraph?.description || description;
  }

  if (openGraph) {
    if (openGraph.url || canonical) {
      if (openGraph.url) {
        warnIfInvalidUrl(
          openGraph.url,
          `openGraph.url must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`openGraph.url\` value.`
        );
      }
      if (canonical) {
        warnIfInvalidUrl(
          canonical,
          `canonical must be a valid, absolute URL. Relative paths will not work as expected. Check the config's \`canonical\` value.`
        );
      }
      meta["og:url"] = openGraph.url || canonical;
    }

    if (openGraph.type) {
      const ogType = openGraph.type.toLowerCase();
      meta["og:type"] = ogType;

      if (ogType === "profile" && openGraph.profile) {
        if (openGraph.profile.firstName) {
          meta["profile:first_name"] = openGraph.profile.firstName;
        }
        if (openGraph.profile.lastName) {
          meta["profile:last_name"] = openGraph.profile.lastName;
        }
        if (openGraph.profile.username) {
          meta["profile:username"] = openGraph.profile.username;
        }
        if (openGraph.profile.gender) {
          meta["profile:gender"] = openGraph.profile.gender;
        }
      } else if (ogType === "book" && openGraph.book) {
        if (openGraph.book.authors && openGraph.book.authors.length) {
          for (const author of openGraph.book.authors) {
            if (Array.isArray(meta["book:author"])) {
              meta["book:author"].push(author);
            } else {
              meta["book:author"] = [author];
            }
          }
        }

        if (openGraph.book.isbn) {
          meta["book:isbn"] = openGraph.book.isbn;
        }

        if (openGraph.book.releaseDate) {
          meta["book:release_date"] = openGraph.book.releaseDate;
        }

        if (openGraph.book.tags && openGraph.book.tags.length) {
          for (const tag of openGraph.book.tags) {
            if (Array.isArray(meta["book:tag"])) {
              meta["book:tag"].push(tag);
            } else {
              meta["book:tag"] = [tag];
            }
          }
        }
      } else if (ogType === "article" && openGraph.article) {
        if (openGraph.article.publishedTime) {
          meta["article:published_time"] = openGraph.article.publishedTime;
        }

        if (openGraph.article.modifiedTime) {
          meta["article:modified_time"] = openGraph.article.modifiedTime;
        }

        if (openGraph.article.expirationTime) {
          meta["article:expiration_time"] = openGraph.article.expirationTime;
        }

        if (openGraph.article.section) {
          meta["article:section"] = openGraph.article.section;
        }

        if (openGraph.article.authors && openGraph.article.authors.length) {
          for (const author of openGraph.article.authors) {
            if (Array.isArray(meta["article:author"])) {
              meta["article:author"].push(author);
            } else {
              meta["article:author"] = [author];
            }
          }
        }

        if (openGraph.article.tags && openGraph.article.tags.length) {
          for (const tag of openGraph.article.tags) {
            if (Array.isArray(meta["article:tag"])) {
              meta["article:tag"].push(tag);
            } else {
              meta["article:tag"] = [tag];
            }
          }
        }
      } else if (
        (ogType === "video.movie" ||
          ogType === "video.episode" ||
          ogType === "video.tv_show" ||
          ogType === "video.other") &&
        openGraph.video
      ) {
        if (openGraph.video.actors && openGraph.video.actors.length) {
          for (const actor of openGraph.video.actors) {
            if (actor.profile) {
              meta["video:actor"] = actor.profile;
            }
            if (actor.role) {
              meta["video:actor:role"] = actor.role;
            }
          }
        }

        if (openGraph.video.directors && openGraph.video.directors.length) {
          for (let director of openGraph.video.directors) {
            meta["video:director"] = director;
          }
        }

        if (openGraph.video.writers && openGraph.video.writers.length) {
          for (let writer of openGraph.video.writers) {
            meta["video:writer"] = writer;
          }
        }

        if (openGraph.video.duration) {
          meta["video:duration"] = openGraph.video.duration.toString();
        }

        if (openGraph.video.releaseDate) {
          meta["video:release_date"] = openGraph.video.releaseDate;
        }

        if (openGraph.video.tags && openGraph.video.tags.length) {
          for (let tag of openGraph.video.tags) {
            meta["video:tag"] = tag;
          }
        }

        if (openGraph.video.series) {
          meta["video:series"] = openGraph.video.series;
        }
      }
    }
    if (openGraph.images && openGraph.images.length) {
      for (let image of openGraph.images) {
        warnIfInvalidUrl(
          image.url,
          `The og:image tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`url\` value in the config's \`openGraph.images\` array.`
        );
        meta["og:image"] = image.url;
        if (image.alt) {
          meta["og:image:alt"] = image.alt;
        } else {
          warn(
            "OpenGraph images should use alt text that describes the image. This is important for users who are visually impaired. Please add a text value to the `alt` key of all `openGraph.images` config options to dismiss this warning."
          );
        }

        if (image.secureUrl) {
          warnIfInvalidUrl(
            image.secureUrl,
            `The og:image:secure_url tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`secureUrl\` value in the config's \`openGraph.images\` array.`
          );
          meta["og:image:secure_url"] = image.secureUrl.toString();
        }

        if (image.type) {
          meta["og:image:type"] = image.type.toString();
        }

        if (image.width) {
          meta["og:image:width"] = image.width.toString();
        }

        if (image.height) {
          meta["og:image:height"] = image.height.toString();
        }
      }
    }

    if (openGraph.videos && openGraph.videos.length) {
      for (let video of openGraph.videos) {
        warnIfInvalidUrl(
          video.url,
          `The og:video tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`url\` value in the config's \`openGraph.videos\` array.`
        );
        meta["og:video"] = video.url;
        if (video.alt) {
          meta["og:video:alt"] = video.alt;
        }

        if (video.secureUrl) {
          warnIfInvalidUrl(
            video.secureUrl,
            `The og:video:secure_url tag must be a valid, absolute URL. Relative paths will not work as expected. Check each \`secureUrl\` value in the config's \`openGraph.videos\` array.`
          );
          meta["og:video:secure_url"] = video.secureUrl.toString();
        }

        if (video.type) {
          meta["og:video:type"] = video.type.toString();
        }

        if (video.width) {
          meta["og:video:width"] = video.width.toString();
        }

        if (video.height) {
          meta["og:video:height"] = video.height.toString();
        }
      }
    }

    if (openGraph.locale) {
      meta["og:locale"] = openGraph.locale;
    }

    if (openGraph.siteName) {
      meta["og:site_name"] = openGraph.siteName;
    }
  }

  return meta;
}

function getLinks(config: SeoConfig, routeArgs?: RouteArgs) {
  const links: HtmlLinkDescriptor[] = [];
  const { canonical, languageAlternates, mobileAlternate } = config;

  if (canonical) {
    warnIfInvalidUrl(
      canonical,
      `The canonical tag must be a valid, absolute URL. Relative paths will not work as expected. 
			Check the config's \`canonical\` value.`
    );
    links.push({
      rel: "canonical",
      href: canonical,
    });
  }

  // <link rel="alternate" media="only screen and (max-width: 640px)" href="http://m.example.com/">
  // https://www.contentkingapp.com/academy/link-rel/#mobile
  if (mobileAlternate) {
    if (!mobileAlternate.href && !mobileAlternate.media) {
      warn(
        `\`mobileAlternate\` must have an \`href\` and \`media\` property. Either add the missing property 
				or remove the \`mobileAlternate\` config option.`
      );
    }

    links.push({
      rel: "alternate",
      href: mobileAlternate.href,
      media: mobileAlternate.media,
    });
  }

  if (languageAlternates && languageAlternates.length) {
    for (let languageAlternate of languageAlternates) {
      if (!languageAlternate.href || !languageAlternate.hrefLang) {
        warn(
          `\`languageAlternate\` must have an \`href\` property & the \` hrefLang\` Either add the missing property 
					or remove the \`languageAlternate\` config option.`
        );
      }

      links.push({
        rel: "alternate",
        href: languageAlternate.href,
        hrefLang: languageAlternate.hrefLang,
      });
    }
  }

  return links;
}
interface FacebookMeta {
  appId?: string;
}

interface LanguageAlternate {
  hrefLang: string;
  href: string;
}

interface MobileAlternate {
  media: string;
  href: string;
}

// https://webcode.tools/generators/open-graph/article
// https://webcode.tools/generators/open-graph/book
// https://webcode.tools/generators/open-graph/business
// https://webcode.tools/generators/open-graph/music-album
// https://webcode.tools/generators/open-graph/music-playlist
// https://webcode.tools/generators/open-graph/music-radio-station
// https://webcode.tools/generators/open-graph/music-song
// https://webcode.tools/generators/open-graph/profile
// https://webcode.tools/generators/open-graph/profile
// https://webcode.tools/generators/open-graph/video
// https://webcode.tools/generators/open-graph/video-episode
// https://webcode.tools/generators/open-graph/video-movie
// https://webcode.tools/generators/open-graph/video-tv-show
// https://webcode.tools/generators/open-graph/website

interface OpenGraphArticle {
  authors?: string[];
  expirationTime?: string;
  modifiedTime?: string;
  publishedTime?: string;
  section?: string;
  tags?: string[];
}

interface OpenGraphBook {
  authors?: string[];
  isbn?: string;
  releaseDate?: string;
  tags?: string[];
}

interface OpenGraphMedia {
  alt: string;
  height?: number;
  secureUrl?: string;
  type?: string;
  url: string;
  width?: number;
}

interface OpenGraphMeta {
  article?: OpenGraphArticle;
  book?: OpenGraphBook;
  defaultImageHeight?: number;
  defaultImageWidth?: number;
  description?: string;
  images?: OpenGraphMedia[];
  locale?: string;
  profile?: OpenGraphProfile;
  siteName?: string;
  title?: string;
  type?: string;
  url?: string;
  video?: OpenGraphVideo;
  videos?: OpenGraphMedia[];
}

interface OpenGraphProfile {
  firstName?: string;
  lastName?: string;
  gender?: string;
  username?: string;
}

interface OpenGraphVideo {
  actors?: OpenGraphVideoActors[];
  directors?: string[];
  duration?: number;
  releaseDate?: string;
  series?: string;
  tags?: string[];
  writers?: string[];
}

interface OpenGraphVideoActors {
  profile: string;
  role?: string;
}

/**
 * @see https://developers.google.com/search/docs/advanced/robots/robots_meta_tag
 */
interface RobotsOptions {
  /**
   * Set the maximum size of an image preview for this page in a search results.
   *
   * If false, Google may show an image preview of the default size.
   *
   * Accepted values are:
   *
   * - **none:** No image preview is to be shown.
   * - **standard:** A default image preview may be shown.
   * - **large:** A larger image preview, up to the width of the viewport, may
   *   be shown.
   *
   * This applies to all forms of search results (such as Google web search,
   * Google Images, Discover, Assistant). However, this limit does not apply in
   * cases where a publisher has separately granted permission for use of
   * content. For instance, if the publisher supplies content in the form of
   * in-page structured data (such as AMP and canonical versions of an article)
   * or has a license agreement with Google, this setting will not interrupt
   * those more specific permitted uses.
   *
   * If you don't want Google to use larger thumbnail images when their AMP
   * pages and canonical version of an article are shown in Search or Discover,
   * provide a value of `"standard"` or `"none"`.
   */
  maxImagePreview?: "none" | "standard" | "large";
  /**
   * The maximum of number characters to use as a textual snippet for a search
   * result. (Note that a URL may appear as multiple search results within a
   * search results page.)
   *
   * This does **not** affect image or video previews. This applies to all forms
   * of search results (such as Google web search, Google Images, Discover,
   * Assistant). However, this limit does not apply in cases where a publisher
   * has separately granted permission for use of content. For instance, if the
   * publisher supplies content in the form of in-page structured data or has a
   * license agreement with Google, this setting does not interrupt those more
   * specific permitted uses. This directive is ignored if no parseable value is
   * specified.
   *
   * Special values:
   * - 0: No snippet is to be shown. Equivalent to nosnippet.
   * - 1: Google will choose the snippet length that it believes is most
   *   effective to help users discover your content and direct users to your
   *   site.
   *
   * To specify that there's no limit on the number of characters that can be
   * shown in the snippet, `maxSnippet` should be set to `-1`.
   */
  maxSnippet?: number;
  /**
   * The maximum number of seconds for videos on this page to show in search
   * results.
   *
   * If false, Google may show a video snippet in search results and will decide
   * how long the preview may be.
   *
   * Special values:
   *
   * - 0: At most, a static image may be used, in accordance to the
   *   `maxImagePreview` setting.
   * - 1: There is no limit.
   *
   * This applies to all forms of search results (at Google: web search, Google
   * Images, Google Videos, Discover, Assistant).
   */
  maxVideoPreview?: number;
  /**
   * Do not show a cached link in search results.
   *
   * If false, Google may generate a cached page and users may access it through
   * the search results.
   */
  noArchive?: boolean;
  /**
   * Do not follow the links on this page.
   *
   * If false, Google may use the links on the page to discover those linked
   * pages.
   *
   * @see https://developers.google.com/search/docs/advanced/guidelines/qualify-outbound-links
   */
  noFollow?: boolean;
  /**
   * Do not index images on this page.
   *
   * If false, images on the page may be indexed and shown in search results.
   */
  noImageIndex?: boolean;
  /**
   * Do not show this page, media, or resource in search results.
   *
   * If false, the page, media, or resource may be indexed and shown in search
   * results.
   */
  noIndex?: boolean;
  /**
   * Do not show a text snippet or video preview in the search results for this
   * page. A static image thumbnail (if available) may still be visible, when it
   * results in a better user experience. This applies to all forms of search
   * results (at Google: web search, Google Images, Discover).
   *
   * If false, Google may generate a text snippet and video preview based on
   * information found on the page.
   */
  noSnippet?: boolean;
  /**
   * Do not offer translation of this page in search results.
   *
   * If false, Google may show a link next to the result to help users view
   * translated content on your page.
   */
  noTranslate?: boolean;
  /**
   * Do not show this page in search results after the specified date/time.
   *
   * The date/time must be specified in a widely adopted format including, but
   * not limited to [RFC 822](http://www.ietf.org/rfc/rfc0822.txt), [RFC
   * 850](http://www.ietf.org/rfc/rfc0850.txt), and [ISO
   * 8601](https://www.iso.org/iso-8601-date-and-time-format.html). The
   * directive is ignored if no valid date/time is specified.
   *
   * By default there is no expiration date for content.
   */
  unavailableAfter?: string;
}

/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
 */
interface TwitterMeta {
  /**
   * The card type. Used with all cards.
   */
  card?: TwitterCardType;
  /**
   * The @username of content creator, which may be different than the @username
   * of the site itself. Used with `summary_large_image` cards.
   */
  creator?: string | { id: string };
  /**
   * Description of content (maximum 200 characters). Used with `summary`,
   * `summary_large_image`, and `player` cards.
   */
  description?: string;
  /**
   * The @username of the website. Used with `summary`, `summary_large_image`,
   * `app`, and `player` cards
   */
  site?: string | { id: string };
  /**
   * Title of content (max 70 characters). Used with `summary`, `summary_large_image`, and `player` cards
   */
  title?: string;
  /**
   * The image to use in the card. Images must be less than 5MB in size. JPG,
   * PNG, WEBP and GIF formats are supported. Only the first frame of an
   * animated GIF will be used. SVG is not supported. Used with `summary`,
   * `summary_large_image`, and `player` cards.
   */
  image?: TwitterImageMeta;

  player?: TwitterPlayerMeta;

  app?: TwitterAppMeta;
}

type TwitterCardType = "app" | "player" | "summary" | "summary_large_image";

interface TwitterImageMeta {
  /**
   * The URL of the image to use in the card. This must be an absolute URL,
   * *not* a relative path.
   */
  url: string;
  /**
   * A text description of the image conveying the essential nature of an image
   * to users who are visually impaired. Maximum 420 characters.
   */
  alt: string;
}

interface TwitterAppMeta {
  name: string | { iPhone?: string; iPad?: string; googlePlay?: string };
  id: { iPhone?: string; iPad?: string; googlePlay?: string };
  url: { iPhone?: string; iPad?: string; googlePlay?: string };
}

interface TwitterPlayerMeta {
  /**
   * The URL to the player iframe. This must be an absolute URL, *not* a
   * relative path.
   */
  url: string;
  /**
   * The URL to raw video or audio stream. This must be an absolute URL, *not* a
   * relative path.
   */
  stream?: string;
  /**
   * Height of the player iframe in pixels.
   */
  height?: number;
  /**
   * Width of the player iframe in pixels.
   */
  width?: number;
}

export interface SeoConfig {
  bypassTemplate?: boolean;
  canonical?: string;
  defaultTitle?: string;
  description?: string;
  languageAlternates?: LanguageAlternate[];
  mobileAlternate?: MobileAlternate;
  omitGoogleBotMeta?: boolean;
  robots?: RobotsOptions;
  title?: string;
  titleTemplate?: string;
  openGraph?: OpenGraphMeta;
  facebook?: FacebookMeta;
  twitter?: TwitterMeta;
}

export interface RouteArgs {
  data: AppData;
  parentsData: RouteData;
  params: Params;
  location: Location;
}

interface SeoBaseFunction<Return> {
  (config?: SeoConfig): Return;
  (
    config: SeoConfig | ((routeArgs?: RouteArgs) => SeoConfig),
    routeArgs: RouteArgs
  ): Return;
}

interface SeoFunction
  extends SeoBaseFunction<[HtmlMetaDescriptor, HtmlLinkDescriptor[]]> {}

interface SeoMetaFunction extends SeoBaseFunction<HtmlMetaDescriptor> {}

interface SeoLinkFunction extends SeoBaseFunction<HtmlLinkDescriptor[]> {}

function resolveConfig(
  defaultConfig: SeoConfig | undefined,
  localConfig: SeoConfig | ((routeArgs?: RouteArgs) => SeoConfig) | undefined,
  routeArgs: RouteArgs | undefined
) {
  let config: SeoConfig =
    typeof localConfig === "function"
      ? localConfig(routeArgs)
      : localConfig || {};

  console.log(config);
  config = defaultConfig ? { ...defaultConfig, ...config } : config;

  return config;
}

function getSeoTitle(config: SeoConfig): string {
  let bypassTemplate = config.bypassTemplate || false;
  let templateTitle = config.titleTemplate || "";
  let updatedTitle = "";

  if (config.title) {
    updatedTitle = config.title;
    if (!bypassTemplate && templateTitle) {
      updatedTitle = templateTitle.replace(/%s/g, updatedTitle);
    }
  } else if (config.defaultTitle) {
    updatedTitle = config.defaultTitle;
  }

  return updatedTitle;
}
function validateTwitterCard(
  twitter: TwitterMeta
): TwitterCardType | undefined {
  if (!twitter.card) {
    return;
  }

  if (
    !["app", "player", "summary", "summary_large_image"].includes(twitter.card)
  ) {
    warn(`An invalid Twitter card was provided to the config and will be ignored. Make sure that \`twitter.card\` is set to one of the following:
- "app"
- "player"
- "summary"
- "summary_large_image"
Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
    return;
  }

  if (hasTwitterAppMeta(twitter)) {
    if (twitter.card !== "app") {
      warn(
        `An twitter card type of ${twitter.card} was provided to the config, but the \`twitter.app\` meta was provided. The \`twitter.app\` meta will be ignored. Either give a \`twitter:card\` value of \`"app"\` or remove the \`twitter.app\` meta to dismiss this warning. 
        Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`
      );
      // @ts-ignore
      delete twitter.app;
    } else {
      if (hasTwitterImageMeta(twitter)) {
        warn(
          `The Twitter app card type does not support the twitter:image metadata provided in your config. Remove the \`twitter.image\` config to dismiss this warning.  Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`
        );
        // @ts-ignore
        delete twitter.image;
      }
    }

    if (hasTwitterPlayerMeta(twitter)) {
      warn(`The Twitter app card type does not support the twitter:player metadata provided in your config. Remove the \`twitter.player\` config to dismiss this warning.
	Read more: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup`);
      // @ts-ignore
      delete twitter.player;
    }
    return "app";
  }
}

function warn(arg0: string) {
  if (typeof console !== "undefined") {
    console.warn("remix-seo: " + arg0);
    try {
      throw new Error("remix-seo: " + arg0);
    } catch (e) {
      console.warn(e);
    }
  }
}
function hasTwitterAppMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
  app: { name: Required<TwitterAppMeta["name"]> & TwitterAppMeta };
} {
  return Boolean(twitter.app && twitter.app.name);
}

function hasTwitterPlayerMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
  player: TwitterPlayerMeta;
} {
  return Boolean(
    twitter.player && (twitter.player.url || twitter.player.stream)
  );
}

function hasTwitterImageMeta(twitter: TwitterMeta): twitter is TwitterMeta & {
  image: { url: Required<TwitterImageMeta["url"]> } & TwitterImageMeta;
} {
  return Boolean(twitter.image && twitter.image.url);
}
function warnIfInvalidUrl(url: string, message: string) {
  try {
    new URL(url);
  } catch (e) {
    if (typeof console !== "undefined") {
      console.warn(message);
    }
  }
}
