import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Musings",
};

export default async function MusingsPage() {
  const articles = await getArticles("musings");

  return (
    <div className="container">
      <div className="main-content">
        <div
          style={{
            padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)",
          }}
        >
          <h1>Musings</h1>
          <p className="meta" style={{ marginTop: "calc(var(--unit) * 2)" }}>
            Policy advocacy, cultural criticism, and whatever else won&rsquo;t leave me alone.
          </p>
        </div>

        {articles.map((article) => (
          <div key={article.slug} className="list-item">
            <div className="list-item-title">
              <Link href={`/musings/${article.slug}`}>
                {article.title}
              </Link>
            </div>
            <div className="list-item-meta">
              {new Date(article.date).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
              {article.readTime && ` · ${article.readTime} min read`}
            </div>
            {article.description && (
              <div className="list-item-desc">{article.description}</div>
            )}
          </div>
        ))}

        {articles.length === 0 && (
          <p className="meta">Essays coming soon.</p>
        )}
      </div>
    </div>
  );
}
