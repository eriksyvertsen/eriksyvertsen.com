import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MountainEntry {
  slug: string;
  title: string;
  stravaActivityId: string;
  published: boolean;
  order: number;
  // Keystatic stores image fields as the filename; we prepend the publicPath
  supplementPhotos: string[];
  notes: string;
}

export function getMountainEntries(): MountainEntry[] {
  const dir = path.join(process.cwd(), "content/mountains");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      const { data } = matter(raw);

      // Keystatic stores image filenames relative to the `directory` option.
      // We prepend the publicPath (/mountains) to get the web URL.
      const supplementPhotos: string[] = (data.supplementPhotos || []).map(
        (p: string) => {
          if (!p) return null;
          // Already absolute path
          if (p.startsWith("/")) return p;
          return `/mountains/${p}`;
        }
      ).filter(Boolean);

      return {
        slug: f.replace(/\.(yaml|yml)$/, ""),
        title: (data.title?.value ?? data.title) || "",
        stravaActivityId: String(data.stravaActivityId || "").trim(),
        published: data.published !== false,
        order: typeof data.order === "number" ? data.order : 999,
        supplementPhotos,
        notes: data.notes || "",
      };
    })
    .filter((e) => e.published && e.stravaActivityId)
    .sort((a, b) => a.order - b.order);
}
