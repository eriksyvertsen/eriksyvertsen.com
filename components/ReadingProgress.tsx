"use client";

import { useState, useEffect } from "react";

export default function ReadingProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setWidth((scrollTop / docHeight) * 100);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div className="reading-progress" style={{ width: `${width}%` }} />;
}
