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
import type {
  AuthorFrontMatter,
  BlogFrontMatter,
  MdxLayoutRendererProps,
  PrevNext,
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
    blogFrontMatter: BlogFrontMatter;
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
            children={children}
            authorFrontMatter={authorFrontMatter}
          />
        );
    }
  },
};

export const MDXLayoutRenderer = ({
  mdxSource,
  layout,
  ...rest
}: MdxLayoutRendererProps) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);
  // @ts-ignore
  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />;
};
