"use client";

import { useEffect, useState, useRef } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

const oneLiners = [
  "The map is not the territory\u2014but sometimes the map is all you have.",
  "Steer into the pain. That\u2019s where the insight lives.",
  "Accountability can\u2019t be given. It can only be taken.",
  "Every idea on the internet can find its audience.",
  "Finance is time travel for value.",
  "Intelligence: transforming information into effective action.",
  "Life optimizes for Flow or State, not both.",
];

export default function KonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const [line, setLine] = useState("");
  const sequence = useRef<string[]>([]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      sequence.current.push(e.key);
      if (sequence.current.length > KONAMI.length) {
        sequence.current.shift();
      }
      if (
        sequence.current.length === KONAMI.length &&
        sequence.current.every((k, i) => k === KONAMI[i])
      ) {
        setLine(oneLiners[Math.floor(Math.random() * oneLiners.length)]);
        setTriggered(true);
        sequence.current = [];
        setTimeout(() => setTriggered(false), 5000);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!triggered) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 72,
        right: 24,
        maxWidth: 320,
        background: "var(--text)",
        color: "var(--bg)",
        padding: "calc(var(--unit) * 2) calc(var(--unit) * 3)",
        fontSize: 14,
        lineHeight: 1.5,
        zIndex: 60,
        fontStyle: "italic",
        boxShadow: "0 4px 16px rgba(44, 40, 37, 0.2)",
      }}
      onClick={() => setTriggered(false)}
    >
      <span style={{ fontSize: 12, opacity: 0.6, display: "block", marginBottom: 4 }}>
        The Librarian whispers:
      </span>
      {line}
    </div>
  );
}
