"use client";

import { useState } from "react";
import kernelsData from "@/content/kernels.json";

export default function KernelsPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(kernelsData.themes.map((t) => t.name)));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  return (
    <div>
      <h1>Kernels</h1>
      <div style={{ height: "calc(var(--unit) * 2)" }} />
      <p>{kernelsData.intro}</p>

      <div
        style={{
          display: "flex",
          gap: "calc(var(--unit) * 2)",
          marginBottom: "calc(var(--unit) * 4)",
        }}
      >
        <button onClick={expandAll} className="meta" style={toggleBtnStyle}>
          expand all
        </button>
        <button onClick={collapseAll} className="meta" style={toggleBtnStyle}>
          collapse all
        </button>
      </div>

      {kernelsData.themes.map((theme) => {
        const isOpen = expanded.has(theme.name);
        return (
          <div
            key={theme.name}
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "calc(var(--unit) * 2)",
              marginBottom: "calc(var(--unit) * 2)",
            }}
          >
            <button
              onClick={() => toggle(theme.name)}
              style={{
                ...themeBtnStyle,
                fontFamily: "var(--font-heading)",
              }}
            >
              <span>{theme.name}</span>
              <span
                style={{
                  color: "var(--muted)",
                  fontSize: 14,
                  fontFamily: "var(--font-body)",
                }}
              >
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>

            <div
              style={{
                maxHeight: isOpen ? "1000px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <ul
                style={{
                  listStyle: "disc",
                  paddingLeft: "calc(var(--unit) * 3)",
                  paddingTop: "calc(var(--unit) * 1)",
                  paddingBottom: "calc(var(--unit) * 2)",
                }}
              >
                {theme.ideas.map((idea, i) => (
                  <li
                    key={i}
                    style={{
                      marginBottom: "calc(var(--unit) * 1)",
                      fontSize: 15,
                      lineHeight: 1.6,
                    }}
                  >
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const toggleBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  fontSize: 13,
  color: "var(--muted)",
  letterSpacing: "0.02em",
  fontFamily: "var(--font-body)",
};

const themeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "calc(var(--unit) * 1) 0",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  color: "var(--text)",
  textAlign: "left",
};
