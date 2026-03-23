import type { Metadata } from "next";
import LibrarianChat from "@/components/LibrarianChat";

export const metadata: Metadata = {
  title: "The Librarian",
  description: "Chat with my knowledge graph.",
};

export default function LibrarianPage() {
  return (
    <div>
      <h1>The Librarian</h1>
      <div style={{ height: "calc(var(--unit) * 4)" }} />
      <LibrarianChat />
    </div>
  );
}
