import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: parseInt(process.env.STRAVA_CLIENT_ID?.trim() ?? "", 10),
      client_secret: process.env.STRAVA_CLIENT_SECRET?.trim(),
      code,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    return NextResponse.json({
      error: "Token exchange failed",
      status: res.status,
      strava_response: errBody,
      client_id_present: !!process.env.STRAVA_CLIENT_ID,
      client_secret_present: !!process.env.STRAVA_CLIENT_SECRET,
    }, { status: 500 });
  }

  const data = await res.json();

  // Display the refresh token for the user to save
  return new Response(
    `<html>
      <body style="font-family: monospace; padding: 40px; background: #FAF8F5; color: #2C2825;">
        <h2>Strava Connected</h2>
        <p>Add this to your .env.local and Vercel env vars:</p>
        <pre style="background: #F4F1ED; padding: 20px; margin-top: 16px;">
STRAVA_CLIENT_ID=${process.env.STRAVA_CLIENT_ID}
STRAVA_CLIENT_SECRET=${process.env.STRAVA_CLIENT_SECRET}
STRAVA_REFRESH_TOKEN=${data.refresh_token}
        </pre>
        <p style="margin-top: 16px; color: #8A8580;">Then restart your dev server.</p>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
