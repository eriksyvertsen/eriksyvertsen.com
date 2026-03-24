import Link from "next/link";

const navLinks = [
  { href: "/legal-engineering", label: "Legal Engineering" },
  { href: "/apps", label: "Apps" },
  { href: "/kernels", label: "Kernels" },
  { href: "/musings", label: "Musings" },
  { href: "/mountains", label: "Mountains" },
  { href: "/reading", label: "Reading" },
  { href: "/about", label: "About" },
];

export default function Home() {
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

        <div className="home-recent">
          <div className="home-recent-label heading-font">Recent</div>
          <p className="home-recent-entry">
            <Link href="/legal-engineering/angellist-legal-culture-code">
              AngelList Legal Culture Code: Lazy Like a Fox
            </Link>
          </p>
          <p className="meta">January 2019 · Legal Engineering</p>
        </div>
      </div>
    </div>
  );
}
