import fs from "fs";
import path from "path";

interface Extraction {
  type: string;
  content: string;
  source_page_uid: string;
  themes: string[];
  created: string;
}

interface Theme {
  name: string;
  description: string;
  status: string;
  extraction_ids: string[];
  page_count: number;
}

interface Connection {
  theme_a: string;
  theme_b: string;
  description: string;
  strength: number;
}

interface GraphState {
  themes: Record<string, Theme>;
  extractions: Record<string, Extraction>;
  connections: Connection[];
  pages: Record<string, { title: string; salience: number }>;
}

let cachedContext: string | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

export function loadGraphContext(): string {
  const now = Date.now();
  if (cachedContext && now - cacheTime < CACHE_TTL) {
    return cachedContext;
  }

  const statePath = path.join(process.cwd(), "data", "state.json");
  const raw = fs.readFileSync(statePath, "utf-8");
  const state: GraphState = JSON.parse(raw);

  const paragraphs: string[] = [];

  // Group themes by relatedness and present as prose
  const sortedThemes = Object.entries(state.themes).sort(
    (a, b) => b[1].extraction_ids.length - a[1].extraction_ids.length
  );

  for (const [tid, theme] of sortedThemes) {
    // Gather all extraction content for this theme as a prose block
    const ideas = theme.extraction_ids
      .map((eid) => state.extractions[eid])
      .filter(Boolean)
      .map((ext) => ext.content);

    if (ideas.length === 0) continue;

    // Write as a prose paragraph, not a labeled list
    paragraphs.push(
      `On ${theme.name}: ${theme.description} Specific ideas include: ${ideas.join(". ")}.`
    );
  }

  // Connections as prose
  if (state.connections.length > 0) {
    const connParts = state.connections
      .sort((a, b) => b.strength - a.strength)
      .map((conn) => {
        const ta = state.themes[conn.theme_a]?.name || conn.theme_a;
        const tb = state.themes[conn.theme_b]?.name || conn.theme_b;
        return `${ta} and ${tb} connect because ${conn.description}`;
      });

    paragraphs.push(
      `Intellectual bridges worth noting: ${connParts.join(". ")}.`
    );
  }

  cachedContext = paragraphs.join("\n\n");
  cacheTime = now;
  return cachedContext;
}
