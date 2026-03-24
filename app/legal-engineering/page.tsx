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
  const articles = mdxArticles.length > 0 ? mdxArticles : seedArticles;

  return (
    <div>
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
        <h1>Legal Engineering</h1>
      </div>

      {articles.map((article) => (
        <div key={article.slug} className="list-item">
          <div className="list-item-title">
            <Link href={`/legal-engineering/${article.slug}`}>
              {article.title}
            </Link>
          </div>
          <div className="list-item-meta">{article.date}</div>
          {article.description && (
            <div className="list-item-desc">{article.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
