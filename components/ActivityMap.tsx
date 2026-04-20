// Server component — renders a Strava activity route map.
// If MAPBOX_TOKEN is set: uses Mapbox Static Images API (real terrain tiles).
// Otherwise: falls back to a custom SVG of the route.

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;

// ── Mapbox static image (proxied — token stays server-side) ──────────────────

function MapboxImage({ polyline }: { polyline: string }) {
  // Route through /api/map so the secret token is never in page source.
  const src = `/api/map?p=${encodeURIComponent(polyline)}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Activity route map"
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}

// ── SVG fallback ──────────────────────────────────────────────────────────────

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0,
    lat = 0,
    lng = 0;
  while (index < encoded.length) {
    let b: number,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

const SVG_W = 680;
const SVG_H = 260;
const PAD = 28;

function SVGMap({ polyline }: { polyline: string }) {
  const points = decodePolyline(polyline);
  if (points.length < 2) return null;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const minLat = Math.min(...lats),
    maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);

  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  const drawW = SVG_W - PAD * 2;
  const drawH = SVG_H - PAD * 2;
  const scaleX = drawW / lngRange;
  const scaleY = drawH / latRange;
  const scale = Math.min(scaleX, scaleY);

  const routeW = lngRange * scale;
  const routeH = latRange * scale;
  const offsetX = PAD + (drawW - routeW) / 2;
  const offsetY = PAD + (drawH - routeH) / 2;

  const toSvg = ([lat, lng]: [number, number]) => {
    const x = offsetX + ((lng - minLng) / lngRange) * routeW;
    const y = offsetY + ((maxLat - lat) / latRange) * routeH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const svgPoints = points.map(toSvg).join(" ");
  const [startX, startY] = toSvg(points[0]).split(",").map(Number);
  const [endX, endY] = toSvg(points[points.length - 1]).split(",").map(Number);

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        background: "#EAE6E0",
      }}
      aria-label="Activity route map"
    >
      <polyline
        points={svgPoints}
        fill="none"
        stroke="#B0A89E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        transform="translate(1,2)"
      />
      <polyline
        points={svgPoints}
        fill="none"
        stroke="#3D6B99"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={startX} cy={startY} r="5" fill="#3D6B99" opacity="0.9" />
      <circle cx={startX} cy={startY} r="8" fill="#3D6B99" opacity="0.2" />
      {Math.abs(endX - startX) > 4 || Math.abs(endY - startY) > 4 ? (
        <>
          <circle cx={endX} cy={endY} r="5" fill="#8A8580" opacity="0.9" />
          <circle cx={endX} cy={endY} r="8" fill="#8A8580" opacity="0.2" />
        </>
      ) : null}
    </svg>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export default function ActivityMap({
  polyline,
  summaryPolyline,
}: {
  polyline: string;
  summaryPolyline?: string;
}) {
  if (!polyline && !summaryPolyline) return null;

  if (MAPBOX_TOKEN) {
    // Prefer summary_polyline for Mapbox (shorter URL, still accurate)
    const routePolyline = summaryPolyline || polyline;
    return <MapboxImage polyline={routePolyline} />;
  }

  return <SVGMap polyline={polyline} />;
}
