import { NextRequest, NextResponse } from "next/server";

// Keystatic's built-in login redirect does not set a `scope` parameter, so
// GitHub issues a token with no scopes — which can't write to repos. This
// route intercepts /api/keystatic/github/login and adds `scope=public_repo`
// before redirecting to GitHub's OAuth page.

const keystaticRouteRegex = /^[a-zA-Z0-9-/_]+$/;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(req: NextRequest) {
  const reqUrl = req.nextUrl;
  const rawFrom = reqUrl.searchParams.get("from");
  const from =
    typeof rawFrom === "string" && keystaticRouteRegex.test(rawFrom)
      ? rawFrom
      : "/";

  const clientId = process.env.KEYSTATIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("OAuth client ID not configured", { status: 500 });
  }

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set(
    "redirect_uri",
    `${reqUrl.origin}/api/keystatic/github/oauth/callback`
  );
  url.searchParams.set("scope", "public_repo");

  if (from === "/") {
    return NextResponse.redirect(url.toString());
  }

  const state = bytesToHex(crypto.getRandomValues(new Uint8Array(10)));
  url.searchParams.set("state", state);

  const stateCookie = [
    `ks-${state}=${from}`,
    "Path=/",
    "Max-Age=86400",
    "SameSite=Lax",
    "HttpOnly",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  return NextResponse.redirect(url.toString(), {
    headers: {
      "Set-Cookie": stateCookie,
    },
  });
}
