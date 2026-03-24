import Link from "next/link";
import { getArticles } from "@/lib/mdx";

const navLinks = [
  { href: "/legal-engineering", label: "Legal Engineering" },
  { href: "/apps", label: "Apps" },
  { href: "/kernels", label: "Kernels" },
  { href: "/musings", label: "Musings" },
  { href: "/mountains", label: "Mountains" },
  { href: "/reading", label: "Reading" },
  { href: "/about", label: "About" },
];

export default async function Home() {
  const legalArticles = await getArticles("legal-engineering");
  const musingsArticles = await getArticles("musings");

  const allArticles = [
    ...legalArticles.map((a) => ({ ...a, section: "Legal Engineering", path: "legal-engineering" })),
    ...musingsArticles.map((a) => ({ ...a, section: "Musings", path: "musings" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recent = allArticles[0];

  return (
    <div className="home-landing">
      <div className="home-content">
        <h1 className="home-title">Erik Syvertsen</h1>

        <nav className="home-nav" aria-label="Main navigation">
          {navLinks.map(({ href, label }, i) => (
            <span key={href}>
              <Link href={href} className="nav-link home-nav-link">
                {label}
              </Link>
              {i < navLinks.length - 1 && (
                <span className="home-nav-separator" aria-hidden="true">
                  ·
                </span>
              )}
            </span>
          ))}
        </nav>

        {recent && (
          <div className="home-recent">
            <div className="home-recent-label heading-font">Recent</div>
            <p className="home-recent-entry">
              <Link href={`/${recent.path}/${recent.slug}`}>
                {recent.title}
              </Link>
            </p>
            <p className="meta">
              {new Date(recent.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}{" "}
              · {recent.section}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
