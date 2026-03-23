import { NextResponse } from "next/server";
import { getArticles } from "@/lib/mdx";
import kernelsData from "@/content/kernels.json";
import readingData from "@/content/reading.json";

export async function GET() {
  // Gather all content into a pool
  const pool: { type: string; url: string; label: string }[] = [];

  // Articles
  const legalArticles = await getArticles("legal-engineering");
  for (const a of legalArticles) {
    pool.push({
      type: "article",
      url: `/legal-engineering/${a.slug}`,
      label: a.title,
    });
  }

  const musings = await getArticles("musings");
  for (const a of musings) {
    pool.push({ type: "musing", url: `/musings/${a.slug}`, label: a.title });
  }

  // Kernels (random theme)
  for (const theme of kernelsData.themes) {
    pool.push({ type: "kernel", url: "/kernels", label: `Kernels: ${theme.name}` });
  }

  // Books
  for (const cat of readingData.categories) {
    for (const book of cat.books) {
      pool.push({ type: "book", url: "/reading", label: book.title });
    }
  }

  // Static pages as fallbacks
  pool.push({ type: "page", url: "/about", label: "About" });
  pool.push({ type: "page", url: "/apps", label: "Apps" });

  if (pool.length === 0) {
    return NextResponse.redirect(new URL("/", "https://eriksyvertsen.com"));
  }

  const pick = pool[Math.floor(Math.random() * pool.length)];
  return NextResponse.redirect(
    new URL(pick.url, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
