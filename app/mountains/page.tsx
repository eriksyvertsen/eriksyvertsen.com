import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";
import { getMountainEntries } from "@/lib/mountains";
import { getActivity, getActivityPhotos } from "@/lib/strava";
import ActivityCard from "@/components/ActivityCard";

export const metadata: Metadata = { title: "Mountains" };
export const revalidate = 3600;

export default async function MountainsPage() {
  if (!isSectionEnabled("mountains")) notFound();

  const entries = getMountainEntries();
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
          <p className="meta">Strava integration pending. [token missing]</p>
        ) : entries.length === 0 ? (
          <p className="meta">No adventures curated yet. [entries={JSON.stringify(entries)}]</p>
        ) : (
          <ActivityFeed entries={entries} />
        )}
      </div>
    </div>
  );
}

async function ActivityFeed({
  entries,
}: {
  entries: ReturnType<typeof getMountainEntries>;
}) {
  const results = await Promise.allSettled(
    entries.map(async (entry) => {
      const [activity, photos] = await Promise.all([
        getActivity(entry.stravaActivityId),
        getActivityPhotos(entry.stravaActivityId),
      ]);
      return { entry, activity, photos };
    })
  );

  const loaded = results
    .filter(
      (r): r is PromiseFulfilledResult<{ entry: typeof entries[0]; activity: unknown; photos: unknown[] }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);

  if (loaded.length === 0) {
    return <p className="meta">Unable to load activities right now.</p>;
  }

  return (
    <div className="activity-feed">
      {loaded.map(({ entry, activity, photos }) => (
        <ActivityCard
          key={entry.slug}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          activity={activity as any}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          photos={(photos as any[]) || []}
          supplementPhotos={entry.supplementPhotos}
          notes={entry.notes}
        />
      ))}
    </div>
  );
}
