const STRAVA_API = "https://www.strava.com/api/v3";

// Cache the access token for the lifetime of the module (single Vercel instance).
// Across instances, Next.js fetch cache handles deduplication.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Reuse if still valid with 5-minute buffer
  if (cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.token;
  }

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    // Cache token exchange for 50 minutes (tokens last ~6h)
    next: { revalidate: 3000 },
  });

  if (!res.ok) throw new Error("Failed to refresh Strava token");
  const data = await res.json();

  cachedToken = { token: data.access_token, expiresAt: data.expires_at };
  return data.access_token;
}

export async function getActivities(perPage = 30) {
  const token = await getAccessToken();

  const res = await fetch(
    `${STRAVA_API}/athlete/activities?per_page=${perPage}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch Strava activities");
  const activities = await res.json();

  const mountainTypes = new Set([
    "BackcountrySki", "AlpineSki", "NordicSki", "Hike", "Snowshoe",
  ]);

  return activities.filter((a: { type: string }) => mountainTypes.has(a.type));
}

export async function getActivity(activityId: string) {
  const token = await getAccessToken();

  const res = await fetch(`${STRAVA_API}/activities/${activityId}`, {
    headers: { Authorization: `Bearer ${token}` },
    // Cache activity data for 1 hour — activity details rarely change
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Strava activity ${activityId} not found`);
  return res.json();
}

export async function getActivityPhotos(activityId: number | string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${STRAVA_API}/activities/${activityId}/photos?size=1024`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];
  return res.json();
}
