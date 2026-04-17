import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import { getApps } from "@/lib/content";

export const metadata: Metadata = { title: "Apps" };

export default function AppsPage() {
  if (!isSectionEnabled("apps")) notFound();

  const apps = getApps();

  return (
    <div className="container">
      <div className="main-content">
        <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
          <h1>Apps</h1>
          <div style={{ height: "calc(var(--unit) * 2)" }} />
          <p className="meta">Things I vibe code.</p>
        </div>

        {apps.map((app) => (
          <div key={app.title} className="list-item">
            <div className="list-item-title">
              {app.url && app.url !== "#" ? (
                <a href={app.url} target="_blank" rel="noopener noreferrer">{app.title}</a>
              ) : (
                app.title
              )}
            </div>
            <div className="tech-tags" style={{ marginTop: 4 }}>
              {(app.tech || []).map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
            <div className="list-item-desc">{app.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
