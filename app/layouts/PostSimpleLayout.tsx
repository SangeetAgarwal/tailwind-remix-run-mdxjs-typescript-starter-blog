import PageTitle from "~/components/PageTitle";
import SectionContainer from "~/components/SectionContainer";
import formatDate from "~/lib/utils/formatDate";
import type { AuthorFrontMatter, BlogFrontMatter } from "~/types/mdx";

export default function PostSimpleLayout({
  frontMatter,
  authorDetails,
  children,
}: {
  frontMatter: BlogFrontMatter;
  authorDetails: AuthorFrontMatter[];
  children: React.ReactNode;
}): JSX.Element {
  return (
    <SectionContainer>
      <article>
        <div>
          <header>
            <div className="space-y-1 border-b border-gray-200 pb-10 text-center dark:border-gray-700">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    {frontMatter.date && (
                      <time dateTime={frontMatter.date}>
                        {formatDate(frontMatter.date)}
                      </time>
                    )}
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{frontMatter.title}</PageTitle>
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
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
