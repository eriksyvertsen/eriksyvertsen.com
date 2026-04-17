const STRAVA_API = "https://www.strava.com/api/v3";

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error("Failed to refresh Strava token");
  const data = await res.json();
  return data.access_token;
}

export async function getActivities(perPage = 30) {
  const token = await getAccessToken();

  const res = await fetch(
    `${STRAVA_API}/athlete/activities?per_page=${perPage}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) throw new Error("Failed to fetch Strava activities");
  const activities = await res.json();

  // Filter for mountain activities
  const mountainTypes = new Set([
    "BackcountrySki",
    "AlpineSki",
    "NordicSki",
    "Hike",
    "Snowshoe",
  ]);

  return activities.filter(
    (a: { type: string }) => mountainTypes.has(a.type)
  );
}

export async function getActivityPhotos(activityId: number | string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${STRAVA_API}/activities/${activityId}/photos?size=1024`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return [];
  return res.json();
}
