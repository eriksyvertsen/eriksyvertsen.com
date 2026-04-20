import { NextRequest, NextResponse } from "next/server";

// Proxy Mapbox Static Images so the secret token never appears in page source.
// Usage: /api/map?p={url-encoded-polyline}
export const runtime = "edge";

export async function GET(req: NextRequest) {
  const polyline = req.nextUrl.searchParams.get("p");
  const token = process.env.MAPBOX_TOKEN;

  if (!polyline || !token) {
    return new NextResponse(null, { status: 400 });
  }

  const color = "3d6b99";
  const encoded = encodeURIComponent(polyline);
  const url = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/path-3+${color}-1(${encoded})/auto/1360x560@2x?padding=60&access_token=${token}`;

  const res = await fetch(url);
  if (!res.ok) {
    return new NextResponse(null, { status: res.status });
  }

  const buffer = await res.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "image/png",
      // Cache at the edge for 24h — polylines don't change for a given activity
      "Cache-Control": "public, max-age=86400, s-maxage=86400, immutable",
    },
  });
}
