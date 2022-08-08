import type {
  ExtendedFrontMatter,
  PrevNext,
  Toc,
} from "~/lib/utils/mdx.server";

import { BlogNewsletterForm } from "./NewsletterForm";
import CustomLink from "./Link";
import Image from "./Image";
import type { MDXContentProps } from "mdx-bundler/client";
import PostLayout from "~/layouts/PostSimple";
import Pre from "./Pre";
import TOCInline from "./TOCInline";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({
    components,
    layout,
    ...rest
  }: {
    components: MDXContentProps;
    layout: string;
    extendedFrontMatter: ExtendedFrontMatter;
    authorDetails: any;
    next: PrevNext;
    prev: PrevNext;
    children: React.ReactNode;
  }) => {
    // const Layout = require(`~/layouts/${layout}`).default
    // return <Layout {...rest} />
    return <PostLayout {...rest} />;
  },
};

// TODO: Pass author details, next and prev from parent component so it is in ...rest
export const MDXLayoutRenderer = ({
  mdxSource,
  layout,
  ...rest
}: {
  mdxSource: string;
  layout: string;
  extendedFrontMatter: ExtendedFrontMatter;
  toc: Toc[];
}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return (
    <MDXLayout layout={layout} components={MDXComponents as any} {...rest} />
  );
};
