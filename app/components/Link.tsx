import { Link } from "@remix-run/react";

const CustomLink = ({
  children,
  href,
  ...rest
}: {
  children: any;
  href: string;
}): JSX.Element => {
  const isInternalLink = href && href.startsWith("/");
  const isAnchorLink = href && href.startsWith("#");

  if (isInternalLink) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (isAnchorLink) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return (
    <a target="_blank" rel="noopener noreferrer" href={href} {...rest}>
      {children}
    </a>
  );
};

export default CustomLink;
