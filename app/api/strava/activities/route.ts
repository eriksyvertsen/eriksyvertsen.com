import { NextResponse } from "next/server";
import { getActivities } from "@/lib/strava";

export async function GET() {
  if (!process.env.STRAVA_REFRESH_TOKEN) {
    return NextResponse.json(
      { error: "Strava not configured" },
      { status: 503 }
    );
  }

  try {
    const activities = await getActivities();
    return NextResponse.json(activities);
  } catch (err) {
    console.error("Strava error:", err);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
