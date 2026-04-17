"use client";

import { useState } from "react";
import type { KernelTheme } from "@/lib/content";

export default function KernelsList({ themes }: { themes: KernelTheme[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  return (
    <div className="container">
      <div className="main-content">
        <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
          <h1>Kernels</h1>
          <div style={{ height: "calc(var(--unit) * 2)" }} />
          <p className="meta">Foundational ideas I think might be true.</p>
        </div>

        {themes.map((theme) => {
          const isOpen = expanded.has(theme.title);
          return (
            <div key={theme.title} style={{ borderBottom: "1px solid var(--border)", padding: "calc(var(--unit) * 2) 0" }}>
              <button
                onClick={() => toggle(theme.title)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "calc(var(--unit) * 1) 0",
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: "var(--font-heading)",
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  color: "var(--text)",
                  textAlign: "left" as const,
                }}
              >
                <span>{theme.title}</span>
                <span style={{ color: "var(--muted)", fontSize: 14, fontFamily: "var(--font-body)" }}>
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <ul style={{ listStyle: "disc", paddingLeft: "calc(var(--unit) * 3)", paddingTop: "calc(var(--unit) * 1)", paddingBottom: "calc(var(--unit) * 2)" }}>
                  {(theme.ideas || []).map((idea, i) => (
                    <li key={i} style={{ marginBottom: "calc(var(--unit) * 1)", fontSize: 15, lineHeight: 1.6 }}>
                      {idea}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
