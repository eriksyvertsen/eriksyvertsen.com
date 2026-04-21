import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import yaml from "js-yaml";

const REPO = "eriksyvertsen/eriksyvertsen.com";
const CONTENT_PATH = "content/mountains";

function gh(path: string, options?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) || {}),
    },
    cache: "no-store",
  });
}

export async function GET() {
  try {
    const dirRes = await gh(`/repos/${REPO}/contents/${CONTENT_PATH}`);
    if (!dirRes.ok) return NextResponse.json({ error: "GitHub API error" }, { status: 500 });

    const files: Array<{ name: string; path: string; sha: string; download_url: string }> =
      await dirRes.json();

    const yamlFiles = files.filter(
      (f) => f.name.endsWith(".yaml") || f.name.endsWith(".yml")
    );

    const entries = await Promise.all(
      yamlFiles.map(async (file) => {
        const raw = await fetch(file.download_url, { cache: "no-store" }).then((r) => r.text());
        const data = (yaml.load(raw) || {}) as Record<string, unknown>;
        return {
          slug: file.name.replace(/\.(yaml|yml)$/, ""),
          title: String(data.title || file.name.replace(/\.(yaml|yml)$/, "")),
          order: typeof data.order === "number" ? data.order : 999,
          path: file.path,
          sha: file.sha,
        };
      })
    );

    entries.sort((a, b) => a.order - b.order);
    return NextResponse.json(entries);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { updates }: { updates: Array<{ path: string; order: number; currentOrder: number }> } =
      await req.json();

    // Only write files whose order actually changed
    const changed = updates.filter((u) => u.order !== u.currentOrder);

    if (changed.length === 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    // Sequential — parallel commits to the same branch cause SHA conflicts
    const errors: string[] = [];
    for (const { path, order } of changed) {
      try {
        // Fresh fetch right before each PUT to get the current blob SHA
        const fileRes = await gh(`/repos/${REPO}/contents/${path}`);
        if (!fileRes.ok) throw new Error(`GET failed: ${fileRes.status}`);
        const fileData: { content: string; sha: string } = await fileRes.json();

        const raw = Buffer.from(
          fileData.content.replace(/\n/g, ""),
          "base64"
        ).toString("utf-8");

        const updated = /^order:/m.test(raw)
          ? raw.replace(/^order:\s*\d+/m, `order: ${order}`)
          : `${raw.trimEnd()}\norder: ${order}\n`;

        const putRes = await gh(`/repos/${REPO}/contents/${path}`, {
          method: "PUT",
          body: JSON.stringify({
            message: `chore: update mountain display order`,
            content: Buffer.from(updated).toString("base64"),
            sha: fileData.sha,
          }),
        });

        if (!putRes.ok) {
          const err = await putRes.text();
          throw new Error(`PUT failed: ${err}`);
        }
      } catch (e) {
        errors.push(`${path}: ${String(e)}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("\n") }, { status: 500 });
    }

    // Bust the mountains page ISR cache so the new order shows immediately
    revalidatePath("/mountains");

    return NextResponse.json({ ok: true, updated: changed.length });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
