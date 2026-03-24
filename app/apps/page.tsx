import type { Metadata } from "next";
import apps from "@/content/apps.json";

export const metadata: Metadata = {
  title: "Apps",
};

export default function AppsPage() {
  return (
    <div className="container"><div className="main-content">
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
        <h1>Apps</h1>
        <div style={{ height: "calc(var(--unit) * 2)" }} />
        <p className="meta">Things I vibe code.</p>
      </div>

      {apps.map((app) => (
        <div key={app.slug} className="list-item">
          <div className="list-item-title">
            <a href={app.url} target="_blank" rel="noopener noreferrer">
              {app.title}
            </a>
          </div>
          <div className="tech-tags" style={{ marginTop: 4 }}>
            {app.tech.map((t) => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
          <div className="list-item-desc">{app.description}</div>
        </div>
      ))}
    </div></div>
  );
}
