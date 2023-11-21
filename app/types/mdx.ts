import type readingTime from "reading-time";
import type { ReadTimeResults } from "reading-time";
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
export interface PostProps {
  mdxSource: string;
  toc: Toc[];
  frontMatter: {
    date: string | null;
    title: any;
    description: any;
    images: any;
    readingTime: ReadTimeResults;
    slug: string | null;
    fileName: string;
  };
  authorFrontMatter: {
    name: string | null;
    avatar: string | null;
    occupation: string | null;
    company: string | null;
    email: string | null;
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
  };
  [key: string]: any;
}
