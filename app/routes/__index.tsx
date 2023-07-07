import { Link, Outlet, useLoaderData } from "@remix-run/react";

import MobileNav from "~/components/MobileNav";
import SectionContainer from "~/components/SectionContainer";
import headerNavLinks from "~/components/headerNavLinks";
import { siteMetadata } from "~/utils/siteMetadata";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Footer from "~/components/Footer";

export const loader: LoaderFunction = async () => {
  return { siteMetadata };
};
export default function Index() {
  const { siteMetadata } = useLoaderData();
  return (
    <SectionContainer>
      <header className="flex items-center justify-between py-10">
        <div>
          <Link to="/" aria-label={siteMetadata.headerTitle}>
            <div className="flex items-center justify-between">
              <div className="mr-3">
                <img src="/logo.svg" alt="My logo" />
              </div>
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            </div>
          </Link>
        </div>
        <div className="flex items-center text-base leading-5">
          <div className="hidden sm:block">
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
              >
                {link.title}
              </Link>
            ))}
          </div>
          <MobileNav />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </SectionContainer>
  );
}
