import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mountains",
};

export default function MountainsPage() {
  const hasStrava = !!process.env.STRAVA_REFRESH_TOKEN;

  return (
    <div>
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
        <h1>Mountains</h1>
        <div style={{ height: "calc(var(--unit) * 2)" }} />
        <p className="meta">
          Ski mountaineering, alpine routes, and trip reports.
        </p>
      </div>

      {!hasStrava ? (
        <p className="meta">
          Strava integration pending. Connect your account to surface trip
          reports here.
        </p>
      ) : (
        <MountainsList />
      )}
    </div>
  );
}

async function MountainsList() {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/strava/activities`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return <p className="meta">Unable to load activities.</p>;
    }

    const activities = await res.json();

    if (!activities.length) {
      return <p className="meta">No mountain activities yet.</p>;
    }

    return (
      <div>
        {activities.map(
          (activity: {
            id: number;
            name: string;
            start_date: string;
            total_elevation_gain: number;
            distance: number;
            type: string;
          }) => (
            <div key={activity.id} className="list-item">
              <div className="list-item-title" style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {activity.name}
              </div>
              <div className="meta" style={{ marginTop: 4 }}>
                {new Date(activity.start_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &middot; {Math.round(activity.total_elevation_gain)}m vertical
                &middot; {(activity.distance / 1000).toFixed(1)}km
              </div>
            </div>
          )
        )}
      </div>
    );
  } catch {
    return <p className="meta">No adventures recorded yet.</p>;
  }
}
