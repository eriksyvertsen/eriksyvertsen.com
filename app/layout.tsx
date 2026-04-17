import type { Metadata } from "next";
import Nav from "@/components/Nav";
import LibrarianOrb from "@/components/LibrarianOrb";
import CommandPalette from "@/components/CommandPalette";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import KonamiCode from "@/components/KonamiCode";
import { getEnabledNavLinks } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Erik Syvertsen",
    template: "%s — Erik Syvertsen",
  },
  description:
    "Legal engineering, vibe coding, foundational ideas, and mountain adventures.",
  metadataBase: new URL("https://eriksyvertsen.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = getEnabledNavLinks();

  return (
    <html lang="en">
      <body>
        <Nav links={navLinks} />
        <main>{children}</main>
        <LibrarianOrb />
        <CommandPalette />
        <KeyboardShortcuts />
        <KonamiCode />
      </body>
    </html>
  );
}
