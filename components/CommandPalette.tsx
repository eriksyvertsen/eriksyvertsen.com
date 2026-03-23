"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const pages = [
  { label: "Home", path: "/" },
  { label: "Legal Engineering", path: "/legal-engineering" },
  { label: "Apps", path: "/apps" },
  { label: "Kernels", path: "/kernels" },
  { label: "Musings", path: "/musings" },
  { label: "Mountains", path: "/mountains" },
  { label: "Reading", path: "/reading" },
  { label: "About", path: "/about" },
  { label: "The Librarian", path: "/librarian" },
  { label: "Shuffle (random)", path: "/api/shuffle" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = pages.filter((p) =>
    p.label.toLowerCase().includes(query.toLowerCase())
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  function navigate(path: string) {
    close();
    router.push(path);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      navigate(filtered[selected].path);
    }
  }

  if (!open) return null;

  return (
    <>
      <div style={overlayStyle} onClick={close} />
      <div style={paletteStyle}>
        <input
          ref={inputRef}
          style={inputStyle}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Navigate to..."
        />
        <div style={resultsStyle}>
          {filtered.map((page, i) => (
            <div
              key={page.path}
              style={{
                ...resultStyle,
                background: i === selected ? "var(--surface)" : "transparent",
              }}
              onClick={() => navigate(page.path)}
              onMouseEnter={() => setSelected(i)}
            >
              {page.label}
              <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "'Courier New', monospace" }}>
                {page.path}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ ...resultStyle, color: "var(--muted)" }}>
              No results
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(44, 40, 37, 0.3)",
  zIndex: 90,
};

const paletteStyle: React.CSSProperties = {
  position: "fixed",
  top: "20%",
  left: "50%",
  transform: "translateX(-50%)",
  width: 480,
  maxWidth: "90vw",
  background: "var(--bg)",
  border: "1px solid var(--border)",
  zIndex: 100,
  boxShadow: "0 8px 32px rgba(44, 40, 37, 0.12)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "calc(var(--unit) * 2) calc(var(--unit) * 3)",
  border: "none",
  borderBottom: "1px solid var(--border)",
  background: "transparent",
  fontFamily: "var(--font-body)",
  fontSize: 16,
  color: "var(--text)",
  outline: "none",
};

const resultsStyle: React.CSSProperties = {
  maxHeight: 300,
  overflowY: "auto",
};

const resultStyle: React.CSSProperties = {
  padding: "calc(var(--unit) * 1.5) calc(var(--unit) * 3)",
  cursor: "pointer",
  fontSize: 15,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
