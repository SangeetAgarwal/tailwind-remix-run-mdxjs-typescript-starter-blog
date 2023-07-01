import type React from "react";
import type { AuthorFrontMatter, BlogFrontMatter } from "./mdx";
import type { PaginationType } from "./server";

export interface AuthorLayoutProps {
  children: React.ReactNode;
  authorFrontMatter: AuthorFrontMatter;
}

export interface ListLayoutProps {
  posts: BlogFrontMatter[];
  title: string;
  initialDisplayPosts?: BlogFrontMatter[];
  pagination?: PaginationType;
}

export interface PostSimpleLayoutProps {
  frontMatter: BlogFrontMatter;
  children: React.ReactNode;
  authorDetails: AuthorFrontMatter[];
}
