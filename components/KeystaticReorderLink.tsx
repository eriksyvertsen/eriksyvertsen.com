"use client";

import { useEffect, useState } from "react";

// Injects a "Reorder" shortcut into the Keystatic UI when on the mountains collection.
export default function KeystaticReorderLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function check() {
      setShow(window.location.pathname.includes("/collection/mountains"));
    }
    check();
    // Re-check on client-side navigation (Keystatic uses history API)
    window.addEventListener("popstate", check);
    // Keystatic uses pushState internally — patch it
    const origPush = history.pushState.bind(history);
    history.pushState = (...args) => { origPush(...args); check(); };
    const origReplace = history.replaceState.bind(history);
    history.replaceState = (...args) => { origReplace(...args); check(); };
    return () => window.removeEventListener("popstate", check);
  }, []);

  if (!show) return null;

  return (
    <a
      href="/admin/mountains-order"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 16px",
        background: "#2563eb",
        color: "#fff",
        fontSize: "13px",
        fontFamily: "system-ui, sans-serif",
        fontWeight: 500,
        textDecoration: "none",
        borderRadius: "6px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        transition: "background 150ms ease",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = "#1d4ed8")}
      onMouseLeave={e => (e.currentTarget.style.background = "#2563eb")}
    >
      ↕ Reorder mountains
    </a>
  );
}
