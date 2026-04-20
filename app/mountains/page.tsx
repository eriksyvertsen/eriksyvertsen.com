import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import { getMountainEntries, type MountainEntry } from "@/lib/mountains";
import { getActivity, getActivityPhotos } from "@/lib/strava";
import ActivityCard from "@/components/ActivityCard";

export const metadata: Metadata = { title: "Mountains" };
export const revalidate = 3600;

export default async function MountainsPage() {
  if (!isSectionEnabled("mountains")) notFound();

  const entries = await getMountainEntries();
  const stravaReady = !!process.env.STRAVA_REFRESH_TOKEN;

  return (
    <div className="container">
      <div className="main-content">
        <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
          <h1>Mountains</h1>
          <div style={{ height: "calc(var(--unit) * 2)" }} />
          <p className="meta">Ski mountaineering, alpine routes, and trip reports.</p>
        </div>

        {!stravaReady ? (
          <p className="meta">Strava integration pending.</p>
        ) : entries.length === 0 ? (
          <p className="meta">No adventures curated yet.</p>
        ) : (
          <ActivityFeed entries={entries} />
        )}
      </div>
    </div>
  );
}

async function ActivityFeed({ entries }: { entries: MountainEntry[] }) {
  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const [activity, photos] = await Promise.all([
        getActivity(entry.stravaActivityId),
        getActivityPhotos(entry.stravaActivityId),
      ]);
      return { entry, activity, photos };
    })
  );

  return (
    <div className="activity-feed">
      {results.map((result, i) => {
        const entry = entries[i];

        if (result.status === "fulfilled") {
          const { activity, photos } = result.value;
          return (
            <ActivityCard
              key={entry.slug}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              activity={activity as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              photos={(photos as any[]) || []}
              supplementPhotos={entry.supplementPhotos}
              notes={entry.notes}
            />
          );
        }

        // Strava unavailable (rate limit, network, etc.) — show what we have
        return (
          <ActivityCardFallback key={entry.slug} entry={entry} />
        );
      })}
    </div>
  );
}

function ActivityCardFallback({ entry }: { entry: MountainEntry }) {
  return (
    <article className="activity-card">
      <div className="activity-header">
        <div>
          <h2 className="activity-title">{entry.title}</h2>
          <div className="activity-meta">
            <span className="meta">Strava data temporarily unavailable</span>
          </div>
        </div>
      </div>

      {entry.supplementPhotos.length > 0 && (
        <div className="activity-photos">
          {entry.supplementPhotos.map((url, i) => (
            <div key={i} className="activity-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${entry.title} — photo ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {entry.notes?.trim() && (
        <div className="activity-notes">
          <p>{entry.notes}</p>
        </div>
      )}
    </article>
  );
}
