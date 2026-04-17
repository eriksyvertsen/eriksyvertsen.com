// Server-side readers for CMS-managed YAML collections.
// Keystatic stores content/reading, content/apps, content/kernels as .yaml files.

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

function readYaml<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return yaml.load(raw) as T;
  } catch {
    return null;
  }
}

function loadCollection<T>(dir: string): T[] {
  const fullDir = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => readYaml<T>(path.join(fullDir, f)))
    .filter((x): x is T => x !== null);
}

// ── Reading ──────────────────────────────────────────────────────────────────

export interface Book {
  title: string;
  author: string;
  category: string;
  notes: string;
  published: boolean;
  order: number;
}

export function getBooks(): Book[] {
  return loadCollection<Book>("content/reading")
    .filter((b) => b.published !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getBooksGrouped(): { name: string; books: Book[] }[] {
  const books = getBooks();
  const groups = new Map<string, Book[]>();
  for (const book of books) {
    const cat = book.category || "Uncategorized";
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(book);
  }
  return Array.from(groups.entries()).map(([name, books]) => ({ name, books }));
}

// ── Apps ─────────────────────────────────────────────────────────────────────

export interface App {
  title: string;
  url: string;
  tech: string[];
  description: string;
  published: boolean;
  order: number;
}

export function getApps(): App[] {
  return loadCollection<App>("content/apps")
    .filter((a) => a.published !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

// ── Kernels ───────────────────────────────────────────────────────────────────

export interface KernelTheme {
  title: string;
  ideas: string[];
  published: boolean;
  order: number;
}

export function getKernelThemes(): KernelTheme[] {
  return loadCollection<KernelTheme>("content/kernels")
    .filter((k) => k.published !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
