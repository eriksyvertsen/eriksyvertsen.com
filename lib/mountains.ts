import yaml from "js-yaml";

const REPO = "eriksyvertsen/eriksyvertsen.com";
const CONTENT_PATH = "content/mountains";

export interface MountainEntry {
  slug: string;
  title: string;
  stravaActivityId: string;
  published: boolean;
  order: number;
  supplementPhotos: string[];
  notes: string;
}

export async function getMountainEntries(): Promise<MountainEntry[]> {
  try {
    // Fetch directory listing from GitHub (where Keystatic stores content)
    const dirRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${CONTENT_PATH}`,
      { next: { revalidate: 300 } }
    );
    if (!dirRes.ok) return [];

    const files: Array<{ name: string; download_url: string }> =
      await dirRes.json();
    const yamlFiles = files.filter(
      (f) => f.name.endsWith(".yaml") || f.name.endsWith(".yml")
    );

    const entries = await Promise.all(
      yamlFiles.map(async (file) => {
        const contentRes = await fetch(file.download_url, {
          next: { revalidate: 300 },
        });
        const raw = await contentRes.text();
        const data = (yaml.load(raw) || {}) as Record<string, unknown>;

        const supplementPhotos: string[] = ((data.supplementPhotos as string[]) || [])
          .map((p: string) => {
            if (!p) return null;
            if (p.startsWith("/")) return p;
            return `/mountains/${p}`;
          })
          .filter((p): p is string => Boolean(p));

        return {
          slug: file.name.replace(/\.(yaml|yml)$/, ""),
          title: String(data.title || ""),
          stravaActivityId: String(data.stravaActivityId || "").trim(),
          published: data.published !== false,
          order: typeof data.order === "number" ? data.order : 999,
          supplementPhotos,
          notes: data.notes || "",
        };
      })
    );

    return entries
      .filter((e) => e.published && e.stravaActivityId)
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}
