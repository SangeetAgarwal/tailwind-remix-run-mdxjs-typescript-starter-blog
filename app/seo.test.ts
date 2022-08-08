/* eslint-disable @typescript-eslint/no-unused-vars */

import { RouteArgs, initSeo } from "./seo";

import type { SeoConfig } from "./seo";

describe("init without default options", () => {
  const { getSeo, getSeoLinks, getSeoMeta } = initSeo();

  describe("getSeo", () => {
    describe("without an SEO Config", () => {
      it("returns meta with only directives for bots", () => {
        const [meta] = getSeo();
        expect(meta).toEqual({
          googlebot: "index,follow",
          robots: "index,follow",
        });
      });
      it("returns no links", () => {
        const [, links] = getSeo();
        expect(links).toEqual([]);
      });
      it("returns the correct title tags", () => {
        const [meta, links] = getSeo({ title: "My Title" });
        expect(meta).toEqual({
          googlebot: "index,follow",
          robots: "index,follow",
          title: "My Title",
          "og:title": "My Title",
        });
        expect(links).toEqual([]);
      });
      it("does what it should", () => {
        let seo = getSeo({
          title: "Best website ever",
          description: "This is a really great website ya dork",
          titleTemplate: "%s | Cool",
          twitter: {
            image: {
              url: "https://somewhere.com/fake-path.jpg",
              alt: "fake!",
            },
          },
          bypassTemplate: false,
          robots: {
            noIndex: true,
            noFollow: true,
          },
          canonical: "https://somewhere.com",
          facebook: {
            appId: "12345",
          },
          openGraph: {
            siteName: "Best website ever, yeah!",
            url: "https://somewhere.com",
            images: [
              {
                url: "https://somewhere.com/fake-path.jpg",
                alt: "fake!",
                height: 200,
                type: "jpg",
              },
            ],
          },
        });

        // meta
        //   expect(seo[0]).toMatchInlineSnapshot(`
        // 		Object {
        // 			"description": "This is a really great website ya dork",
        // 			"fb:app_id": "12345",
        // 			"googlebot": "noindex,nofollow",
        // 			"og:description": "This is a really great website ya dork",
        // 			"og:image": "https://somewhere.com/fake-path.jpg",
        // 			"og:image:alt": "fake!",
        // 			"og:image:height": "200",
        // 			"og:image:type": "jpg",
        // 			"og:site_name": "Best website ever, yeah!",
        // 			"og:title": "Best website ever | Cool",
        // 			"og:url": "https://somewhere.com",
        // 			"robots": "noindex,nofollow",
        // 			"title": "Best website ever | Cool",
        // 			"twitter:card": "summary",
        // 			"twitter:description": "This is a really great website ya dork",
        // 			"twitter:image": "https://somewhere.com/fake-path.jpg",
        // 			"twitter:image:alt": "fake!",
        // 			"twitter:title": "Best website ever | Cool",
        // 		}
        // 	`);
        // links
        //     expect(seo[1]).toMatchInlineSnapshot(`
        // 	Array [
        // 	  Object {
        // 	    "href": "https://somewhere.com",
        // 	    "rel": "canonical",
        // 	  },
        // 	]
        // `);
      });
    });
  });
});

describe("init with default options", () => {
  const { getSeo, getSeoLinks, getSeoMeta } = initSeo({
    title: "My Title",
    description: "My Description",
    titleTemplate: "%s | Cool",
    canonical: "https://somewhere.com",
  });

  describe("getSeo", () => {
    describe("without an SEO Config", () => {
      const [meta, links] = getSeo();
      it("it returns meta based on default config", () => {
        expect(meta).toEqual({
          title: "My Title | Cool",
          description: "My Description",
          "og:description": "My Description",
          "og:title": "My Title | Cool",
          googlebot: "index,follow",
          robots: "index,follow",
        });
      });
      it("returns links based on default configs", () => {
        expect(links).toEqual([
          {
            href: "https://somewhere.com",
            rel: "canonical",
          },
        ]);
      });
      it("overrides default configs", () => {
        const [meta, links] = getSeo({ title: "About us" });
        expect(meta).toEqual({
          title: "About us | Cool",
          description: "My Description",
          "og:title": "About us | Cool",
          "og:description": "My Description",
          robots: "index,follow",
          googlebot: "index,follow",
        });
        expect(links).toEqual([
          {
            href: "https://somewhere.com",
            rel: "canonical",
          },
        ]);
      });
    });
  });
  describe("getSeoMeta", () => {
    describe("without an SEO config", () => {
      let meta = getSeoMeta();
      it("it returns meta based on default config", () => {
        expect(meta).toEqual({
          title: "My Title | Cool",
          description: "My Description",
          "og:description": "My Description",
          "og:title": "My Title | Cool",
          googlebot: "index,follow",
          robots: "index,follow",
        });
      });
    });

    it("overrides the title tags", () => {
      const [meta, links] = getSeo({ title: "About us" });
      expect(meta).toEqual({
        title: "About us | Cool",
        description: "My Description",
        "og:title": "About us | Cool",
        "og:description": "My Description",
        robots: "index,follow",
        googlebot: "index,follow",
      });
    });
  });

  describe("getSeoLinks", () => {
    describe("without an SEO config", () => {
      let links = getSeoLinks();
      it("returns links based on default config", () => {
        expect(links).toEqual([
          {
            rel: "canonical",
            href: "https://somewhere.com",
          },
        ]);
      });
    });

    it("overrides the default canonical link", () => {
      let links = getSeoLinks({ canonical: "https://somewhere-b.com" });
      expect(links).toEqual([
        {
          rel: "canonical",
          href: "https://somewhere-b.com",
        },
      ]);
    });
  });
});
