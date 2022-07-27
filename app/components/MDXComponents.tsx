import type { MDXContentProps } from 'mdx-bundler/client';
import { getMDXComponent } from 'mdx-bundler/client'
import Image from "./Image"
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import { useMemo } from 'react'
import PostLayout from '~/layouts/PostSimple'

export const MDXComponents = {
	Image,
	TOCInline,
	a: CustomLink,
	pre: Pre,
	BlogNewsletterForm: BlogNewsletterForm,
	wrapper: ({ components, layout, ...rest }: {
		components: MDXContentProps, layout: string,
		frontMatter: {
			[key: string]: any;
		};
		authorDetails: any;
		next: { title: string, slug: string, date: string, tags: string[], draft: boolean, summary: string } | null;
		prev: { title: string, slug: string, date: string, tags: string[], draft: boolean, summary: string } | null;
		children: React.ReactNode;
	}) => {
		// const Layout = require(`~/layouts/${layout}`).default
		// return <Layout {...rest} />
		return <PostLayout {...rest} />
	},
}
export const MDXLayoutRenderer = ({ mdxSource, layout, ...rest }: { mdxSource: string, layout: string, frontMatter: { [key: string]: any }, toc: [{ value: string, url: string, depth: number }] }) => {
	const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
	return <MDXLayout layout={layout} components={MDXComponents as any} {...rest} />
}