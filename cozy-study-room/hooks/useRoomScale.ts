"use client";

import { useState, useEffect } from "react";

const ROOM_W = 1400;
const ROOM_H = 900;
const MARGIN = 16;

export function useRoomScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const scaleX = (window.innerWidth  - MARGIN * 2) / ROOM_W;
      const scaleY = (window.innerHeight - MARGIN * 2) / ROOM_H;
      // No upper cap — allows slight upscaling on large screens
      // No lower cap — allows shrinking as small as needed on mobile
      setScale(Math.min(scaleX, scaleY));
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}