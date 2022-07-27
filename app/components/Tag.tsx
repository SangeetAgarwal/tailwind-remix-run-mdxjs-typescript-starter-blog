import type { Key } from "react";
import { Link } from "@remix-run/react";
import kebabCase from "~/lib/utils/kebabCase";

const Tag = ({ text }: { text: Key | null | undefined }): JSX.Element => (
  <Link
    to={`/tags/${kebabCase(text)}`}
    className=" mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
  >
    {(text as string).split(" ").join("-")}
  </Link>
);

export default Tag;
