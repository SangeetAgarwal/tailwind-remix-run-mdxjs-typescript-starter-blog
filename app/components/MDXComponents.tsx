import type { MDXContentProps } from "mdx-bundler/client";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import AuthorLayout from "~/layouts/AuthorLayout";
import PostSimpleLayout from "~/layouts/PostSimpleLayout";
import type {
  AuthorFrontMatter,
  BlogFrontMatter,
  MdxLayoutRendererProps,
} from "~/types/mdx";
import Image from "./Image";
import CustomLink from "./Link";
import { BlogNewsletterForm } from "./NewsletterForm";
import Pre from "./Pre";
import TOCInline from "./TOCInline";

import { LRUCache } from "lru-cache";
export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({
    components,
    layout,
    children,
    ...rest
  }: {
    components: MDXContentProps;
    layout: string;
    children: React.ReactNode;
    frontMatter: BlogFrontMatter;
    authorFrontMatter: AuthorFrontMatter;
    authorDetails: AuthorFrontMatter[];
  }) => {
    // const Layout = (await import(`~/app/layouts/${layout}`)) as any;
    // return <Layout {...rest} />;
    switch (layout) {
      case "PostSimpleLayout":
        return <PostSimpleLayout children={children} {...rest} />;
      case "AuthorLayout":
        return <AuthorLayout children={children} {...rest} />;
    }
  },
};

export const MDXLayoutRenderer = ({
  mdxSource,
  layout,
  ...rest
}: MdxLayoutRendererProps) => {
  const MDXLayout = useMemo(() => {
    if (mdxComponentCache.has(mdxSource)) {
      return mdxComponentCache.get(mdxSource)!;
    }
    const component = getMDXComponent(mdxSource);
    mdxComponentCache.set(mdxSource, component);
    return component;
  }, [mdxSource]);

  // @ts-ignore
  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />;
};

const mdxComponentCache = new LRUCache<
  string,
  ReturnType<typeof getMDXComponent>
>({
  max: 1000,
});
