import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Legal Engineering",
};

const seedArticles = [
  {
    slug: "angellist-legal-culture-code",
    title: "AngelList Legal Culture Code: Lazy Like a Fox",
    date: "2019-01-24",
    description:
      "How AngelList Legal maximizes leverage through efficiency, taking a software development approach to legal problems.",
  },
];

export default async function LegalEngineeringPage() {
  const mdxArticles = await getArticles("legal-engineering");
  const articles =
    mdxArticles.length > 0
      ? mdxArticles
      : seedArticles;

  return (
    <div>
      <h1>Legal Engineering</h1>
      <div style={{ height: "calc(var(--unit) * 4)" }} />

      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/legal-engineering/${article.slug}`}
          style={{ textDecoration: "none", borderBottom: "none" }}
        >
          <div className="card">
            <div className="card-title">{article.title}</div>
            <div className="card-meta">{article.date}</div>
            <div className="card-desc">{article.description}</div>
            <div className="card-link">read_article</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
