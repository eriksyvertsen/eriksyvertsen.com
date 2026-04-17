import Link from "next/link";
import { getArticles } from "@/lib/mdx";
import { getEnabledNavLinks } from "@/lib/site-config";

export default async function Home() {
  const navLinks = getEnabledNavLinks();
  const musingsArticles = await getArticles("musings");

  const recent = musingsArticles[0];

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
                <span className="home-nav-separator" aria-hidden="true">·</span>
              )}
            </span>
          ))}
        </nav>

        {recent && (
          <div className="home-recent">
            <div className="home-recent-label heading-font">Recent</div>
            <p className="home-recent-entry">
              <Link href={`/musings/${recent.slug}`}>{recent.title}</Link>
            </p>
            <p className="meta">
              {new Date(recent.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}{" "}
              · Musings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
