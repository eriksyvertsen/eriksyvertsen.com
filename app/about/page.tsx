import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { isSectionEnabled } from "@/lib/site-config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = { title: "About" };

function getAboutContent(): string {
  const filePath = path.join(process.cwd(), "content/pages/about.mdx");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);
    return content;
  } catch {
    return "";
  }
}

export default async function AboutPage() {
  if (!isSectionEnabled("about")) notFound();

  const content = getAboutContent();

  return (
    <div className="container">
      <div className="main-content">
        <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
          <h1>About</h1>
        </div>
        <div className="article-body">
          <MDXRemote source={content} />
        </div>
      </div>
    </div>
  );
}
