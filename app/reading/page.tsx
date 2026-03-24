"use client";

import { useState } from "react";
import readingData from "@/content/reading.json";

export default function ReadingPage() {
  return (
    <div>
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
        <h1>Reading</h1>
        <div style={{ height: "calc(var(--unit) * 2)" }} />
        <p className="meta">
          Books that shaped my thinking, loosely organized. Updated as I go.
        </p>
      </div>

      {readingData.categories.map((category) => (
        <div key={category.name} style={{ marginBottom: "calc(var(--unit) * 6)" }}>
          <h3>{category.name}</h3>
          {category.books.map((book) => (
            <ReadingItem key={book.title} book={book} />
          ))}
        </div>
      ))}
    </div>
  );
}

function ReadingItem({
  book,
}: {
  book: { title: string; author: string; notes: string };
}) {
  const [open, setOpen] = useState(false);
  const hasNotes = book.notes.length > 0;

  return (
    <div
      className="list-item"
      style={{ cursor: hasNotes ? "pointer" : "default" }}
      onClick={() => hasNotes && setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div
            className="list-item-title"
            style={{ color: hasNotes ? "var(--accent)" : "var(--text)" }}
          >
            {book.title}
          </div>
          <div className="list-item-meta">{book.author}</div>
        </div>
        {hasNotes && (
          <span style={{ color: "var(--muted)", fontSize: 14 }}>
            {open ? "\u2212" : "+"}
          </span>
        )}
      </div>

      {open && (
        <p
          style={{
            marginTop: "calc(var(--unit) * 2)",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--text)",
          }}
        >
          {book.notes}
        </p>
      )}
    </div>
  );
}
