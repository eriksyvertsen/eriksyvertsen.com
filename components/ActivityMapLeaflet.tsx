"use client";

import { useEffect, useRef } from "react";

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b: number, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

export default function ActivityMapLeaflet({ polyline }: { polyline: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const points = decodePolyline(polyline);
    if (points.length < 2) return;

    // Dynamically import Leaflet (browser-only)
    import("leaflet").then((L) => {
      // Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
        dragging: true,
      });

      // OpenTopoMap — topo style with contours, perfect for ski/hike
      L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution:
          'Map data: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: © <a href="https://opentopomap.org">OpenTopoMap</a>',
      }).addTo(map);

      const route = L.polyline(points, {
        color: "#3D6B99",
        weight: 3,
        opacity: 0.95,
      }).addTo(map);

      // Start marker
      L.circleMarker(points[0], {
        radius: 6,
        fillColor: "#3D6B99",
        color: "#fff",
        weight: 2,
        fillOpacity: 1,
      }).addTo(map);

      // End marker (only if point-to-point)
      const last = points[points.length - 1];
      const distFromStart = Math.hypot(last[0] - points[0][0], last[1] - points[0][1]);
      if (distFromStart > 0.001) {
        L.circleMarker(last, {
          radius: 6,
          fillColor: "#8A8580",
          color: "#fff",
          weight: 2,
          fillOpacity: 1,
        }).addTo(map);
      }

      map.fitBounds(route.getBounds(), { padding: [32, 32] });
      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, [polyline]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "300px", background: "#E8E4DF" }}
    />
  );
}
