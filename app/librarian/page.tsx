import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import LibrarianChat from "@/components/LibrarianChat";

export const metadata: Metadata = {
  title: "The Librarian",
  description: "Chat with my knowledge graph.",
};

export default function LibrarianPage() {
  if (!isSectionEnabled("librarian")) notFound();
  return (
    <div className="container"><div className="main-content">
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 4)" }}>
        <h1>The Librarian</h1>
        <div style={{ height: "calc(var(--unit) * 2)" }} />
        <p className="meta">
          An AI interface to my knowledge graph&mdash;1,280 pages of notes on
          venture capital, regulation, psychology, philosophy, and more.
        </p>
      </div>
      <LibrarianChat />
    </div></div>
  );
}
