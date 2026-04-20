const STRAVA_API = "https://www.strava.com/api/v3";

// In-memory token cache — persists for the lifetime of a Vercel function instance.
// Prevents repeated OAuth POSTs within a single instance. (POST requests are never
// cached by Next.js's data cache, so this is the only mechanism we have.)
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

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
    cache: "no-store", // POST — explicitly not cacheable
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
      next: { revalidate: 3600 }, // activity list can change; 1h is fine
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
    // Activities don't change once posted. Cache permanently — only re-fetched
    // on a fresh deploy (when the data cache clears) or a new activity ID.
    next: { revalidate: false },
  });

  if (!res.ok) throw new Error(`Strava activity ${activityId}: ${res.status}`);
  return res.json();
}

export async function getActivityPhotos(activityId: number | string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${STRAVA_API}/activities/${activityId}/photos?size=1024`,
    {
      headers: { Authorization: `Bearer ${token}` },
      // Same rationale — photos don't change once an activity is posted.
      next: { revalidate: false },
    }
  );

  if (!res.ok) return [];
  return res.json();
}
