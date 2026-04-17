import ActivityMap from "./ActivityMap";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + " km";
}

function formatElevation(meters: number): string {
  return Math.round(meters).toLocaleString() + "m";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function activityLabel(type: string): string {
  const labels: Record<string, string> = {
    BackcountrySki: "Backcountry Ski",
    AlpineSki: "Alpine Ski",
    NordicSki: "Nordic Ski",
    Hike: "Hike",
    Snowshoe: "Snowshoe",
    MountainBikeRide: "MTB",
    Run: "Run",
    TrailRun: "Trail Run",
  };
  return labels[type] || type;
}

// ── Photo grid ────────────────────────────────────────────────────────────────

type StravaPhoto = {
  unique_id: string;
  urls?: Record<string, string>;
  caption?: string;
};

function PhotoGrid({
  stravaPhotos,
  supplementPhotos,
  activityName,
}: {
  stravaPhotos: StravaPhoto[];
  supplementPhotos: string[];
  activityName: string;
}) {
  const stravaUrls = stravaPhotos
    .map((p) => ({ url: p.urls?.["1024"] || p.urls?.["600"] || "", caption: p.caption || "" }))
    .filter((p) => p.url);

  const suppUrls = supplementPhotos
    .filter(Boolean)
    .map((url) => ({ url, caption: "" }));

  const all = [...stravaUrls, ...suppUrls];
  if (all.length === 0) return null;

  return (
    <div className="activity-photos">
      {all.map(({ url, caption }, i) => (
        <div key={i} className="activity-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={caption || `${activityName} — photo ${i + 1}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

// ── Notes ─────────────────────────────────────────────────────────────────────

function Notes({ text }: { text: string }) {
  if (!text?.trim()) return null;
  // Render paragraphs separated by blank lines; preserve line breaks within paragraphs
  const paragraphs = text.trim().split(/\n\n+/);
  return (
    <div className="activity-notes">
      {paragraphs.map((para, i) => (
        <p key={i}>
          {para.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

interface StravaActivity {
  id: number;
  name: string;
  description?: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  elev_high?: number;
  type: string;
  sport_type?: string;
  start_date_local: string;
  map?: {
    summary_polyline?: string;
    polyline?: string;
  };
}

export default function ActivityCard({
  activity,
  photos,
  supplementPhotos,
  notes,
}: {
  activity: StravaActivity;
  photos: StravaPhoto[];
  supplementPhotos: string[];
  notes: string;
}) {
  const polyline =
    activity.map?.polyline || activity.map?.summary_polyline || "";
  const type = activity.sport_type || activity.type;

  const stats = [
    { label: "Distance", value: formatDistance(activity.distance) },
    { label: "Gain", value: formatElevation(activity.total_elevation_gain) },
    { label: "Time", value: formatTime(activity.moving_time) },
    ...(activity.elev_high && activity.elev_high > 0
      ? [{ label: "Max elev", value: formatElevation(activity.elev_high) }]
      : []),
  ];

  return (
    <article className="activity-card">
      {/* Map */}
      {polyline && (
        <div className="activity-map-wrap">
          <ActivityMap polyline={polyline} />
        </div>
      )}

      {/* Header */}
      <div className="activity-header">
        <div>
          <h2 className="activity-title">{activity.name}</h2>
          <div className="activity-meta">
            <span>{activityLabel(type)}</span>
            <span className="activity-meta-sep">·</span>
            <span>{formatDate(activity.start_date_local)}</span>
          </div>
        </div>
        <a
          href={`https://www.strava.com/activities/${activity.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="strava-link"
          aria-label="View on Strava"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          Strava
        </a>
      </div>

      {/* Stats */}
      <div className="activity-stats">
        {stats.map(({ label, value }) => (
          <div key={label} className="activity-stat">
            <div className="activity-stat-value">{value}</div>
            <div className="activity-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Strava description */}
      {activity.description?.trim() && (
        <p className="activity-description">{activity.description}</p>
      )}

      {/* Photos */}
      <PhotoGrid
        stravaPhotos={photos}
        supplementPhotos={supplementPhotos}
        activityName={activity.name}
      />

      {/* Trip notes */}
      <Notes text={notes} />
    </article>
  );
}
