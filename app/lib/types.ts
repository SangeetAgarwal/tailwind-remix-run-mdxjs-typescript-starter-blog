import { IReadTimeResults } from "reading-time";

export type Toc = { value: string; url: string; depth: number };

export type AllFrontMatter = FrontMatter & {
  slug: string;
  date: string;
};

export type PrevNext = {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  draft: boolean;
  summary: string;
};

export type FrontMatter = {
  title: string;
  date: string;
  lastmod: string;
  draft: boolean;
  tags: string[];
  summary: string;
  images: string[];
  authors: string[];
  layout: string;
  canonicalUrl: string;
};

export type AuthorFrontMatter = {
  name: string;
  avatar: string;
  occupation: string;
  company: string;
  email: string;
  twitter: string;
  linkedin: string;
  github: string;
};

export type ExtendedFrontMatter = FrontMatter & {
  readingTime: IReadTimeResults;
  slug: string | null;
  fileName: string;
  draft: boolean;
  date: string;
};

export type Post = {
  mdxSource: string;
  toc: Toc[];
  extendedFrontMatter: ExtendedFrontMatter;
  layout: string | null;
};
