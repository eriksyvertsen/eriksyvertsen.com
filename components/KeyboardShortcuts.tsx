"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const shortcuts: Record<string, string> = {
  h: "/",
  l: "/legal-engineering",
  a: "/apps",
  k: "/kernels",
  u: "/musings",
  m: "/mountains",
  r: "/reading",
  b: "/about",
  i: "/librarian",
};

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [gPending, setGPending] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setShowHelp(false);
        setGPending(false);
        return;
      }

      if (e.key === "g") {
        setGPending(true);
        setTimeout(() => setGPending(false), 1500);
        return;
      }

      if (gPending && shortcuts[e.key]) {
        e.preventDefault();
        setGPending(false);
        router.push(shortcuts[e.key]);
        return;
      }

      // s for shuffle
      if (gPending && e.key === "s") {
        e.preventDefault();
        setGPending(false);
        window.location.href = "/api/shuffle";
      }
    },
    [gPending, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!showHelp) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(44, 40, 37, 0.3)",
          zIndex: 80,
        }}
        onClick={() => setShowHelp(false)}
      />
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 360,
          background: "var(--bg)",
          border: "1px solid var(--border)",
          padding: "calc(var(--unit) * 4)",
          zIndex: 85,
          boxShadow: "0 8px 32px rgba(44, 40, 37, 0.12)",
        }}
      >
        <h3 style={{ marginBottom: "calc(var(--unit) * 3)" }}>Keyboard Shortcuts</h3>
        <table style={{ width: "100%", fontSize: 14 }}>
          <tbody>
            <Row keys="Cmd+K" desc="Command palette" />
            <Row keys="g h" desc="Go home" />
            <Row keys="g l" desc="Legal engineering" />
            <Row keys="g a" desc="Apps" />
            <Row keys="g k" desc="Kernels" />
            <Row keys="g u" desc="Musings" />
            <Row keys="g m" desc="Mountains" />
            <Row keys="g r" desc="Reading" />
            <Row keys="g b" desc="About" />
            <Row keys="g i" desc="The Librarian" />
            <Row keys="g s" desc="Shuffle" />
            <Row keys="?" desc="This help" />
          </tbody>
        </table>
      </div>
    </>
  );
}

function Row({ keys, desc }: { keys: string; desc: string }) {
  return (
    <tr>
      <td
        style={{
          padding: "4px 0",
          fontFamily: "'Courier New', monospace",
          color: "var(--accent)",
          width: 80,
        }}
      >
        {keys}
      </td>
      <td style={{ padding: "4px 0", color: "var(--muted)" }}>{desc}</td>
    </tr>
  );
}
