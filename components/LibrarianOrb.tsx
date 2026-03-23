"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LibrarianOrb() {
  const pathname = usePathname();

  // Don't show on the librarian page itself
  if (pathname === "/librarian") return null;

  return (
    <Link
      href="/librarian"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 36,
        height: 36,
        background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: "pointer",
        zIndex: 50,
        textDecoration: "none",
        borderBottom: "none",
      }}
      title="The Librarian"
    >
      <span style={{ color: "var(--bg)", fontSize: 16, fontFamily: "Georgia, serif" }}>
        L
      </span>
      <style>{`
        @keyframes librarian-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </Link>
  );
}
