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
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "calc(var(--unit) * 16) 0",
      }}
    >
      <h1 style={{ marginBottom: "calc(var(--unit) * 4)" }}>Erik Syvertsen</h1>

      <nav
        style={{
          display: "flex",
          gap: "calc(var(--unit) * 3)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {navLinks.map(({ href, label }, i) => (
          <span key={href} style={{ display: "flex", alignItems: "center", gap: "calc(var(--unit) * 3)" }}>
            {i > 0 && (
              <span style={{ color: "var(--border)", fontSize: 14, userSelect: "none" as const }}>
                &middot;
              </span>
            )}
            <Link
              href={href}
              className="nav-link"
              style={{ fontSize: 17 }}
            >
              {label}
            </Link>
          </span>
        ))}
      </nav>

      <div style={{ marginTop: "calc(var(--unit) * 12)" }}>
        <div
          className="heading-font"
          style={{
            fontSize: 14,
            textTransform: "uppercase" as const,
            letterSpacing: "0.08em",
            color: "var(--muted)",
            marginBottom: "calc(var(--unit) * 2)",
          }}
        >
          Recent
        </div>
        <p style={{ marginBottom: 8 }}>
          <Link href="/legal-engineering/angellist-legal-culture-code">
            AngelList Legal Culture Code: Lazy Like a Fox
          </Link>
        </p>
        <p className="meta">January 2019 &middot; Legal Engineering</p>
      </div>
    </div>
  );
}
