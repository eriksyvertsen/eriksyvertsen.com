import type { Metadata } from "next";
import apps from "@/content/apps.json";

export const metadata: Metadata = {
  title: "Apps",
};

export default function AppsPage() {
  return (
    <div>
      <h1>Apps</h1>
      <div style={{ height: "calc(var(--unit) * 4)" }} />

      {apps.map((app) => (
        <a
          key={app.slug}
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", borderBottom: "none" }}
        >
          <div className="card">
            <div className="card-title">{app.title}</div>
            <div className="tech-tags">
              {app.tech.map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="card-desc">{app.description}</div>
            <div className="card-link">visit_app</div>
          </div>
        </a>
      ))}
    </div>
  );
}
