// ActivityMap — renders a Strava activity route on a real topo map.
// Uses Leaflet (client-side) with OpenTopoMap tiles. No API key required.
// Falls back to a static SVG if no polyline is available.

import dynamic from "next/dynamic";

const ActivityMapLeaflet = dynamic(() => import("./ActivityMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "#E8E4DF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ),
});

export default function ActivityMap({
  polyline,
  summaryPolyline,
}: {
  polyline: string;
  summaryPolyline?: string;
}) {
  const route = polyline || summaryPolyline || "";
  if (!route) return null;
  return <ActivityMapLeaflet polyline={route} />;
}
