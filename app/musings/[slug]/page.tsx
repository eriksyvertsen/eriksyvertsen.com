import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getAllSlugs } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs("musings");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug("musings", slug);
  if (!article) return {};
  return { title: article.meta.title };
}

export default async function MusingArticle({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug("musings", slug);

  if (!article) notFound();

  return (
    <div>
      <div style={{ paddingTop: "calc(var(--unit) * 6)" }}>
        <p className="meta">
          {article.meta.date}
          {article.meta.readTime && ` · ${article.meta.readTime} min read`}
        </p>
        <div style={{ height: "calc(var(--unit) * 2)" }} />
        <h1>{article.meta.title}</h1>
      </div>
      <div style={{ height: "calc(var(--unit) * 6)" }} />
      <div className="article-body">
        <MDXRemote source={article.content} />
      </div>
    </div>
  );
}
