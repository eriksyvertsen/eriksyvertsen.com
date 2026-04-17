import fs from "fs";
import path from "path";

export type SectionKey =
  | "musings"
  | "mountains"
  | "about"
  | "reading"
  | "apps"
  | "kernels"
  | "librarian";

export interface SiteConfig {
  musings: boolean;
  mountains: boolean;
  about: boolean;
  reading: boolean;
  apps: boolean;
  kernels: boolean;
  librarian: boolean;
}

const DEFAULTS: SiteConfig = {
  musings: true,
  mountains: false,
  about: true,
  reading: false,
  apps: false,
  kernels: false,
  librarian: false,
};

export function getSiteConfig(): SiteConfig {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "content/site-config.json"),
      "utf-8"
    );
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function isSectionEnabled(section: SectionKey): boolean {
  return getSiteConfig()[section] ?? false;
}

export interface NavLink {
  href: string;
  label: string;
}

const ALL_NAV_LINKS: (NavLink & { section: SectionKey })[] = [
  { href: "/musings", label: "Musings", section: "musings" },
  { href: "/mountains", label: "Mountains", section: "mountains" },
  { href: "/reading", label: "Reading", section: "reading" },
  { href: "/apps", label: "Apps", section: "apps" },
  { href: "/kernels", label: "Kernels", section: "kernels" },
  { href: "/librarian", label: "Librarian", section: "librarian" },
  { href: "/about", label: "About", section: "about" },
];

export function getEnabledNavLinks(): NavLink[] {
  const config = getSiteConfig();
  return ALL_NAV_LINKS.filter(({ section }) => config[section]).map(
    ({ href, label }) => ({ href, label })
  );
}
