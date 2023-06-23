import { BlogNewsletterForm } from "./NewsletterForm";
import CustomLink from "./Link";
import Image from "./Image";
import type { MDXContentProps } from "mdx-bundler/client";
import PostSimple from "~/layouts/PostSimple";
import Pre from "./Pre";
import TOCInline from "./TOCInline";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import AuthorLayout from "~/layouts/AuthorLayout";
import {
  AuthorFrontMatter,
  ExtendedFrontMatter,
  PrevNext,
  Toc,
} from "~/lib/types";

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({
    components,
    layout,
    authorFrontMatter,
    children,
    ...rest
  }: {
    components: MDXContentProps;
    layout: string;
    extendedFrontMatter: ExtendedFrontMatter;
    authorFrontMatter: AuthorFrontMatter;
    authorDetails: any;
    next: PrevNext;
    prev: PrevNext;
    children: React.ReactNode;
  }) => {
    // const Layout = require(`~/layouts/${layout}`).default
    // return <Layout {...rest} />
    switch (layout) {
      case "PostSimple":
        return <PostSimple children={children} {...rest} />;
      case "AuthorLayout":
        return (
          <AuthorLayout
            authorFrontMatter={authorFrontMatter}
            children={children}
          />
        );
    }
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
  extendedFrontMatter?: ExtendedFrontMatter;
  toc?: Toc[];
  authorFrontMatter?: AuthorFrontMatter;
}) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  return (
    <MDXLayout layout={layout} components={MDXComponents as any} {...rest} />
  );
};
