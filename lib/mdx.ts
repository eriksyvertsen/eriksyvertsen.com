import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  readTime?: number;
}

export async function getArticles(section: string): Promise<ArticleMeta[]> {
  const dir = path.join(contentDir, section);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.mdx$/, ""),
      title: data.title || file.replace(/\.mdx$/, ""),
      date: data.date || "",
      description: data.description || "",
      readTime: data.readTime,
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticleBySlug(
  section: string,
  slug: string
): Promise<{ meta: ArticleMeta; content: string } | null> {
  const filePath = path.join(contentDir, section, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title || slug,
      date: data.date || "",
      description: data.description || "",
      readTime: data.readTime,
    },
    content,
  };
}

export async function getAllSlugs(section: string): Promise<string[]> {
  const dir = path.join(contentDir, section);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
