"use client";

import { usePathname } from "next/navigation";

export default function LibrarianOrb() {
  const pathname = usePathname();
  if (pathname === "/librarian") return null;

  return (
    <>
      <style>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(61, 107, 153, 0.4); }
          50% { transform: scale(1.06); box-shadow: 0 0 0 8px rgba(61, 107, 153, 0); }
        }
        .librarian-orb {
          animation: orb-pulse 2.8s ease-in-out infinite;
        }
        .librarian-orb:hover {
          animation: none;
          transform: scale(1.1);
        }
      `}</style>
      <a
        href="https://www.thelibrarian.live"
        target="_blank"
        rel="noopener noreferrer"
        className="librarian-orb"
        title="The Librarian"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #5a8fc4, var(--accent) 60%, var(--accent-hover))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 50,
          textDecoration: "none",
          border: "none",
          transition: "transform 200ms ease",
        }}
      />

    </>
  );
}
