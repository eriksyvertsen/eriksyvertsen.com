"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/site-config";

export default function Nav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-header-inner">
          <Link href="/" className="site-name">
            Erik Syvertsen
          </Link>
          <nav>
            <ul className="site-nav">
              {links.map(({ href, label }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`nav-link${isActive ? " active" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
