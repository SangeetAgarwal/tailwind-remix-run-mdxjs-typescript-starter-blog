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
	wrapper: ({ components, layout, ...rest }: { components: any, layout: any }) => {
		// const Layout = require(`~/layouts/${layout}`).default
		// return <Layout {...rest} />
		// @ts-ignore 
		return <PostLayout {...rest} />
	},
}
export const MDXLayoutRenderer = ({ ...rest }) => {
	const { mdxSource, layout, ...remaining } = rest
	const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])
	return <MDXLayout layout={layout} components={MDXComponents as any} {...remaining} />
}