import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import { getApps } from "@/lib/content";

export const metadata: Metadata = { title: "Personal Apps" };

const isLink = (url?: string) => !!url && url !== "#";

export default function AppsPage() {
  if (!isSectionEnabled("apps")) notFound();

  const apps = getApps();

  return (
    <div className="container">
      <div className="main-content">
        <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
          <h1>Personal Apps</h1>
          <div style={{ height: "calc(var(--unit) * 2)" }} />
          <p className="meta">Things I vibe code.</p>
        </div>

        <div className="app-grid">
          {apps.map((app) => {
            // Internal paths (e.g. /snowpack) are proxied zones, so use plain anchors.
            const external = /^https?:/.test(app.url);
            const thumb = app.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={app.thumbnail} alt={`${app.title} screenshot`} loading="lazy" />
            ) : (
              <div className="app-card-placeholder">{app.title}</div>
            );
            return (
              <article key={app.title} className="app-card">
                {isLink(app.url) ? (
                  <a
                    href={app.url}
                    className="app-card-thumb"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={`Open ${app.title}`}
                  >
                    {thumb}
                  </a>
                ) : (
                  <div className="app-card-thumb">{thumb}</div>
                )}
                <div className="app-card-body">
                  <h2 className="app-card-title">{app.title}</h2>
                  <div className="tech-tags">
                    {(app.tech || []).map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                  <p className="app-card-desc">{app.description}</p>
                  <div className="app-card-links">
                    {isLink(app.url) && (
                      <a
                        href={app.url}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        Open app ↗
                      </a>
                    )}
                    {isLink(app.github) && (
                      <a href={app.github} target="_blank" rel="noopener noreferrer">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
