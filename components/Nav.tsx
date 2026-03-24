"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/legal-engineering", label: "Legal Engineering" },
  { href: "/apps", label: "Apps" },
  { href: "/kernels", label: "Kernels" },
  { href: "/musings", label: "Musings" },
  { href: "/mountains", label: "Mountains" },
  { href: "/reading", label: "Reading" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  // Hide nav on homepage — homepage has its own navigation
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
              {links.map(({ href, label }, i) => {
                const isActive = pathname.startsWith(href);
                return (
                  <li key={href} style={{ display: "flex", alignItems: "center", gap: "calc(var(--unit) * 2.5)" }}>
                    {i > 0 && <span className="nav-separator">&middot;</span>}
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
