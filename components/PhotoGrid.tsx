"use client";

import { useState, useEffect, useCallback } from "react";

interface Photo {
  url: string;
  caption: string;
}

function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % photos.length), [photos.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="photo-lightbox"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[current].url}
        alt={photos[current].caption}
        onClick={(e) => e.stopPropagation()}
      />

      <button className="photo-lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {photos.length > 1 && (
        <>
          <button
            className="photo-lightbox-nav photo-lightbox-nav--prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            className="photo-lightbox-nav photo-lightbox-nav--next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default function PhotoGrid({
  stravaPhotos,
  supplementPhotos,
  activityName,
}: {
  stravaPhotos: Array<{ urls?: Record<string, string>; caption?: string }>;
  supplementPhotos: string[];
  activityName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const all: Photo[] = [
    ...stravaPhotos
      .map((p) => ({ url: p.urls?.["1024"] || p.urls?.["600"] || "", caption: p.caption || "" }))
      .filter((p) => p.url),
    ...supplementPhotos.filter(Boolean).map((url) => ({ url, caption: "" })),
  ];

  if (all.length === 0) return null;

  return (
    <>
      <div className="activity-photos">
        {all.map(({ url, caption }, i) => (
          <div key={i} className="activity-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={caption || `${activityName} — photo ${i + 1}`}
              loading="lazy"
              onDoubleClick={() => setLightboxIndex(i)}
              title="Double-click to expand"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={all}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
