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
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "calc(var(--unit) * 12) 0",
      }}
    >
      <h1 style={{ marginBottom: "calc(var(--unit) * 5)" }}>Erik Syvertsen</h1>

      <nav>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "calc(var(--unit) * 1.5)",
          }}
        >
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="nav-link" style={{ fontSize: 17 }}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: "calc(var(--unit) * 10)" }}>
        <div
          className="heading-font"
          style={{
            fontSize: 13,
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "var(--muted)",
            marginBottom: "calc(var(--unit) * 2)",
          }}
        >
          Recent
        </div>
        <p style={{ marginBottom: 6 }}>
          <Link href="/legal-engineering/angellist-legal-culture-code">
            AngelList Legal Culture Code: Lazy Like a Fox
          </Link>
        </p>
        <p className="meta">January 2019 &middot; Legal Engineering</p>
      </div>
    </div>
  );
}
