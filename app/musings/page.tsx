import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Musings",
};

export default async function MusingsPage() {
  const articles = await getArticles("musings");

  return (
    <div>
      <h1>Musings</h1>
      <div style={{ height: "calc(var(--unit) * 4)" }} />

      {articles.length === 0 ? (
        <p className="meta">No musings available yet.</p>
      ) : (
        articles.map((article) => (
          <Link
            key={article.slug}
            href={`/musings/${article.slug}`}
            style={{ textDecoration: "none", borderBottom: "none" }}
          >
            <div className="card">
              <div className="card-title">{article.title}</div>
              <div className="card-meta">{article.date}</div>
              <div className="card-desc">{article.description}</div>
              <div className="card-link">read</div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
