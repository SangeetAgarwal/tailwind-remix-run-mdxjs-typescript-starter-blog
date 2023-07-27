import { Link } from "@remix-run/react";
import type { AnchorHTMLAttributes } from "react";

export default function CustomLink({
  href,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  let isInternalLink = href && href.startsWith("/");
  let isAnchorLink = href && href.startsWith("#");

  if (isInternalLink) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <Link to={href as string} {...rest} />;
  }

  if (isAnchorLink) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a href={href} {...rest} />;
  }

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target="_blank" rel="noopener noreferrer" href={href} {...rest} />;
}
