import type readingTime from "reading-time";
export type PrevNext = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  draft: boolean;
  summary: string;
};
export type Toc = { value: string; url: string; depth: number };
export type MdxPageLayout = "AuthorLayout" | "ListLayout" | "PostSimpleLayout";

export interface MdxFrontMatter {
  layout?: MdxPageLayout;
  title: string;
  name?: string;
  date: string;
  lastmod?: string;
  tags: string[];
  draft?: boolean;
  summary: string;
  images?: string[] | string;
  authors?: string[];
  slug: string;
}

export type ReadingTime = ReturnType<typeof readingTime>;

export interface BlogFrontMatter extends MdxFrontMatter {
  readingTime: ReadingTime;
  fileName: string;
}

export interface AuthorFrontMatter extends MdxFrontMatter {
  avatar: string;
  github?: string;
  occupation: string;
  company: string;
  email: string;
  twitter: string;
  linkedin: string;
}

export interface MdxFileData {
  mdxSource: string;
  frontMatter: BlogFrontMatter;
  toc: unknown[];
}

export interface MdxLayoutRendererProps {
  mdxSource: string;
  layout: string;
  frontMatter?: MdxFrontMatter;
  toc?: Toc[];
  [key: string]: any;
  authorFrontMatter?: MdxFrontMatter;
}
