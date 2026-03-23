"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/legal-engineering", label: "legal engineering" },
  { href: "/apps", label: "apps" },
  { href: "/kernels", label: "kernels" },
  { href: "/musings", label: "musings" },
  { href: "/mountains", label: "mountains" },
  { href: "/reading", label: "reading" },
  { href: "/about", label: "about" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-nav">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`sidebar-link${isActive ? " active" : ""}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
