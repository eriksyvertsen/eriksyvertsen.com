import { NextRequest, NextResponse } from "next/server";

// This route intercepts the GitHub OAuth callback before Keystatic's catch-all
// handler processes it. Keystatic's handler requires `expires_in` and
// `refresh_token` fields that GitHub only returns when "Expiring user
// authorization tokens" is enabled on the OAuth App. Since that setting is not
// available for this app, we handle the callback ourselves: exchange the code
// for an access token, set the cookie directly, and redirect to /keystatic.
// GitHub OAuth App tokens don't expire, so we set a 1-year cookie maxAge.

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const from = searchParams.get("from");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    return new Response(
      `Authorization error: ${errorDescription}`,
      { status: 400 }
    );
  }

  if (!code) {
    return new Response("Missing authorization code", { status: 400 });
  }

  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.KEYSTATIC_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("OAuth credentials not configured", { status: 500 });
  }

  // Exchange code for access token
  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  );

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response("Authorization failed", { status: 401 });
  }

  // GitHub OAuth App tokens don't expire — set a 1-year cookie
  const maxAge = 365 * 24 * 60 * 60;
  const cookieValue = [
    `keystatic-gh-access-token=${tokenData.access_token}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    `Expires=${new Date(Date.now() + maxAge * 1000).toUTCString()}`,
    "SameSite=Lax",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  if (state === "close") {
    return new Response(
      "<script>localStorage.setItem('ks-refetch-installations', 'true');window.close();</script>",
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Set-Cookie": cookieValue,
        },
      }
    );
  }

  const destination = new URL(
    `/keystatic${from ? `/${from}` : ""}`,
    req.url
  );

  return NextResponse.redirect(destination, {
    status: 307,
    headers: {
      "Set-Cookie": cookieValue,
    },
  });
}
