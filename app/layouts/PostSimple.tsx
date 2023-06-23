import { Link } from "@remix-run/react";
import PageTitle from "~/components/PageTitle";
import SectionContainer from "~/components/SectionContainer";
import { ExtendedFrontMatter, PrevNext } from "~/lib/types";
import formatDate from "~/lib/utils/formatDate";

export default function PostLayout({
  extendedFrontMatter,
  authorDetails,
  next,
  prev,
  children,
}: {
  extendedFrontMatter: ExtendedFrontMatter;
  authorDetails: any;
  next: PrevNext;
  prev: PrevNext;
  children: React.ReactNode;
}): JSX.Element {
  // console.log("PostLayout", frontMatter);
  const { date, title } = extendedFrontMatter;

  return (
    <SectionContainer>
      {/* <BlogSEO url={`${siteMetadata.siteUrl}/blog/${frontMatter.slug}`} {...frontMatter} />
      <ScrollTopAndComment /> */}
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:divide-y-0 "
            style={{ gridTemplateRows: "auto 1fr" }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-dark">
                {children}
              </div>
            </div>
            {/* <Comments frontMatter={frontMatter} /> */}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      to={`/blog/${prev.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      to={`/blog/${next.slug}`}
                      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
