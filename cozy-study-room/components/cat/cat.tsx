"use client";

import { useEffect, useRef, useState } from "react";
import { findPath } from "../../lib/pathfinding";
import { isCatBlocked } from "../../lib/collisions_cat";

// ANIMATION CONFIG

type AnimKey =
  | "sit_down" | "sit_up" | "sit_left" | "sit_right" | "sit_left_down" | "sit_right_down"
  | "loaf_left" | "loaf_right" | "loafNap_left" | "loafNap_right"
  | "lay_down" | "lay_up" | "lay_left" | "lay_right" | "lay_left_down" | "lay_right_down"
  | "sleepLeft" | "sleepRight"
  | "sitWash" | "standWash" | "layWash"
  | "stand_down" | "stand_up" | "stand_left" | "stand_right"
  | "stand_left_down" | "stand_right_down" | "stand_right_up" | "stand_left_up"
  | "walk_right" | "walk_left" | "walk_down" | "walk_up"
  | "walk_right_down" | "walk_right_up" | "walk_left_down" | "walk_left_up";

const ANIMS: Record<AnimKey, { src: string; frameWidth: number; frameHeight: number; frames: number; fps: number }> = {
  // Sitting
  sit_down:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_up:         { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right:      { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left_down:  { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right_down: { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },

  // Loafing
  loaf_left:     { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loaf_right:    { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_left:  { src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_right: { src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },

  // Laying
  lay_down:       { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_up:         { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_left:       { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_right:      { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_left_down:  { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_right_down: { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },

  // Sleeping
  sleepLeft:  { src: "/assets/cat/sleepLeft.png",  frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },
  sleepRight: { src: "/assets/cat/sleepRight.png", frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },

  // Washing
  sitWash:   { src: "/assets/cat/sitWash.png",   frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  standWash: { src: "/assets/cat/standWash.png", frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  layWash:   { src: "/assets/cat/layWash.png",   frameWidth: 32, frameHeight: 32, frames: 7, fps: 8 },

  // Standing
  stand_down:       { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_up:         { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left:       { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right:      { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left_down:  { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right_down: { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right_up:   { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left_up:    { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },

  // Walking
  walk_right:      { src: "/assets/cat/walkRight.png",     frameWidth: 32, frameHeight: 32, frames: 8, fps: 12 },
  walk_left:       { src: "/assets/cat/walkLeft.png",      frameWidth: 32, frameHeight: 32, frames: 8, fps: 12 },
  walk_down:       { src: "/assets/cat/walkDown.png",      frameWidth: 32, frameHeight: 32, frames: 4, fps: 10 },
  walk_up:         { src: "/assets/cat/walkUp.png",        frameWidth: 32, frameHeight: 32, frames: 4, fps: 10 },
  walk_right_down: { src: "/assets/cat/walkRightDown.png", frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_right_up:   { src: "/assets/cat/walkRightUp.png",   frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_left_down:  { src: "/assets/cat/walkLeftDown.png",  frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_left_up:    { src: "/assets/cat/walkLeftUp.png",    frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
};

// frame index for each static pose within its spritesheet
const STATIC_FRAMES: Partial<Record<AnimKey, number>> = {
  sit_down: 0,  sit_up: 1,  sit_left: 2,  sit_right: 3,  sit_left_down: 4,  sit_right_down: 5,
  stand_down: 0, stand_up: 1, stand_left: 2, stand_right: 3,
  stand_left_down: 4, stand_right_down: 5, stand_right_up: 6, stand_left_up: 7,
  lay_down: 0,  lay_up: 1,  lay_left: 2,  lay_right: 3,  lay_left_down: 4,  lay_right_down: 5,
  loaf_left: 0,  loaf_right: 1,
  loafNap_left: 0, loafNap_right: 1,
};

// Deduplicated list of unique sprite src files
const UNIQUE_SRCS = [...new Set(Object.values(ANIMS).map(a => a.src))];

// DISPLAY & BEHAVIOUR CONFIG

const DISPLAY_SCALE  = 1.8;
const CAT_SPEED      = 0.6;
const DIAG_THRESHOLD = 0.4;
const ROOM_LEFT      = 80;
const ROOM_RIGHT     = 1320;
const ROOM_TOP       = 110;
const ROOM_BOTTOM    = 860;

// smaller number = lazier cat
const WALK_CHANCE = 0.1;

type IdleBehaviour = { anim: AnimKey; minMs: number; maxMs: number };
const IDLE_BEHAVIOURS: IdleBehaviour[] = [
  { anim: "loaf_left",     minMs: 5000, maxMs: 12000 },
  { anim: "loaf_left",     minMs: 4000, maxMs: 10000 }, // weighted heavier
  { anim: "loaf_right",    minMs: 5000, maxMs: 12000 },
  { anim: "loafNap_left",  minMs: 6000, maxMs: 14000 },
  { anim: "loafNap_right", minMs: 6000, maxMs: 14000 },
  { anim: "lay_down",      minMs: 4000, maxMs: 10000 },
  { anim: "sleepLeft",     minMs: 8000, maxMs: 20000 },
  { anim: "sleepRight",    minMs: 8000, maxMs: 20000 },
  { anim: "sitWash",       minMs: 4000, maxMs: 9000  },
  { anim: "standWash",     minMs: 3000, maxMs: 7000  },
  { anim: "layWash",       minMs: 4000, maxMs: 9000  },
  { anim: "stand_down",    minMs: 2000, maxMs: 5000  },
];

// HELPERS

function randomWalkTarget() {
  for (let i = 0; i < 40; i++) {
    const x = ROOM_LEFT  + Math.random() * (ROOM_RIGHT  - ROOM_LEFT);
    const y = ROOM_TOP   + Math.random() * (ROOM_BOTTOM - ROOM_TOP);
    if (!isCatBlocked(x, y)) return { x, y };
  }
  return { x: 700, y: 500 };
}

function walkAnimForDirection(dx: number, dy: number): AnimKey {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const total = adx + ady;
  if (total === 0) return "walk_down";
  const isDiag = (adx / total) > DIAG_THRESHOLD && (ady / total) > DIAG_THRESHOLD;
  if (isDiag) {
    if (dx > 0 && dy > 0) return "walk_right_down";
    if (dx > 0 && dy < 0) return "walk_right_up";
    if (dx < 0 && dy > 0) return "walk_left_down";
    return "walk_left_up";
  }
  if (adx > ady) return dx > 0 ? "walk_right" : "walk_left";
  return dy > 0 ? "walk_down" : "walk_up";
}

function sitForDir(d: AnimKey): AnimKey {
  if (d === "walk_right")      return "sit_right";
  if (d === "walk_left")       return "sit_left";
  if (d === "walk_up")         return "sit_up";
  if (d === "walk_right_down") return "sit_right_down";
  if (d === "walk_left_down")  return "sit_left_down";
  return "sit_down";
}

function standForDir(d: AnimKey): AnimKey {
  if (d === "walk_right")      return "stand_right";
  if (d === "walk_left")       return "stand_left";
  if (d === "walk_up")         return "stand_up";
  if (d === "walk_right_down") return "stand_right_down";
  if (d === "walk_right_up")   return "stand_right_up";
  if (d === "walk_left_down")  return "stand_left_down";
  if (d === "walk_left_up")    return "stand_left_up";
  return "stand_down";
}

function layForDir(d: AnimKey): AnimKey {
  if (d === "walk_up")         return "lay_up";
  if (d === "walk_left")       return "lay_left";
  if (d === "walk_right")      return "lay_right";
  if (d === "walk_left_down")  return "lay_left_down";
  if (d === "walk_right_down") return "lay_right_down";
  return "lay_down";
}

function loafForDir(d: AnimKey, nap: boolean): AnimKey {
  const right = d === "walk_right" || d === "walk_right_down" || d === "walk_right_up";
  if (nap) return right ? "loafNap_right" : "loafNap_left";
  return right ? "loaf_right" : "loaf_left";
}

function sleep(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}

function waitUntil(condition: () => boolean, timeoutMs: number) {
  return new Promise<void>(res => {
    const start = Date.now();
    const id = setInterval(() => {
      if (condition() || Date.now() - start > timeoutMs) { clearInterval(id); res(); }
    }, 100);
  });
}

// COMPONENT

export default function Cat() {
  const [pos,   setPos]   = useState({ x: 500, y: 450 });
  const [anim,  setAnim]  = useState<AnimKey>("loaf_left");
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);

  const posRef      = useRef({ x: 500, y: 450 });
  const animRef     = useRef<AnimKey>("loaf_left");
  const frameRef    = useRef(0);
  const pathRef     = useRef<{ x: number; y: number }[]>([]);
  const lastWalkRef = useRef<AnimKey>("walk_down");
  const stuckRef    = useRef({ x: 500, y: 450, ticks: 0 });

  // Preload all sprites; only start the brain once every image has loaded.
  // We also keep hidden <img> tags in the DOM (see render) so the browser
  // never evicts them from its cache between animation switches.
  useEffect(() => {
    const srcs = UNIQUE_SRCS;
    let loaded = 0;
    srcs.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded === srcs.length) setReady(true);
      };
      img.src = src;
    });
  }, []);

  const setAnimSafe = (a: AnimKey) => {
    const staticFrame = STATIC_FRAMES[a] ?? 0;
    animRef.current = a;
    frameRef.current = staticFrame;
    setAnim(a);
    setFrame(staticFrame);
  };

  // frame ticker
  useEffect(() => {
    if (anim in STATIC_FRAMES) return;
    frameRef.current = 0;
    setFrame(0);
    const cfg = ANIMS[anim];
    const id = setInterval(() => {
      const next = (frameRef.current + 1) % cfg.frames;
      frameRef.current = next;
      setFrame(next);
    }, Math.round(1000 / cfg.fps));
    return () => clearInterval(id);
  }, [anim]);

  // movement loop
  useEffect(() => {
    const id = setInterval(() => {
      const path = pathRef.current;
      if (path.length === 0) return;

      const target = path[0];
      const { x: cx, y: cy } = posRef.current;
      const dx = target.x - cx;
      const dy = target.y - cy;

      if (Math.abs(dx) < CAT_SPEED && Math.abs(dy) < CAT_SPEED) {
        const rest = path.slice(1);
        pathRef.current = rest;
        if (rest.length === 0) {
          posRef.current = { x: target.x, y: target.y };
          setPos({ x: target.x, y: target.y });
        }
        return;
      }

      const newAnim = walkAnimForDirection(dx, dy);
      if (animRef.current !== newAnim) {
        lastWalkRef.current = newAnim;
        animRef.current = newAnim;
        setAnim(newAnim);
      }

      const nx = cx + Math.sign(dx) * Math.min(CAT_SPEED, Math.abs(dx));
      const ny = cy + Math.sign(dy) * Math.min(CAT_SPEED, Math.abs(dy));
      let rx = cx, ry = cy;
      if      (!isCatBlocked(nx, ny)) { rx = nx; ry = ny; }
      else if (!isCatBlocked(nx, cy)) { rx = nx; }
      else if (!isCatBlocked(cx, ny)) { ry = ny; }

      posRef.current = { x: rx, y: ry };
      setPos({ x: rx, y: ry });

      const s = stuckRef.current;
      if (Math.abs(rx - s.x) < 0.5 && Math.abs(ry - s.y) < 0.5) {
        if (++s.ticks > 120) { pathRef.current = []; s.ticks = 0; }
      } else {
        s.x = rx; s.y = ry; s.ticks = 0;
      }
    }, 16);
    return () => clearInterval(id);
  }, []);

  // brain of cat; only runs once all sprites are loaded
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function transitionToSit() {
      setAnimSafe(sitForDir(lastWalkRef.current));
      await sleep(800 + Math.random() * 1000);
    }

    function resolveDirection(a: AnimKey): AnimKey {
      if (a === "loaf_left"    || a === "loaf_right")    return loafForDir(lastWalkRef.current, false);
      if (a === "loafNap_left" || a === "loafNap_right") return loafForDir(lastWalkRef.current, true);
      if (a === "stand_down") return standForDir(lastWalkRef.current);
      if (a === "lay_down")   return layForDir(lastWalkRef.current);
      return a;
    }

    async function think() {
      await sleep(1500 + Math.random() * 2000);
      await transitionToSit();

      while (!cancelled) {
        if (Math.random() < WALK_CHANCE) {
          const target = randomWalkTarget();
          if (!isCatBlocked(target.x, target.y)) {
            pathRef.current = findPath(posRef.current.x, posRef.current.y, target.x, target.y);
            await waitUntil(() => pathRef.current.length === 0, 20000);
          }
          if (cancelled) break;
          await transitionToSit();
        } else {
          const b = IDLE_BEHAVIOURS[Math.floor(Math.random() * IDLE_BEHAVIOURS.length)];
          const chosenAnim = resolveDirection(b.anim);
          setAnimSafe(chosenAnim);
          await sleep(b.minMs + Math.random() * (b.maxMs - b.minMs));
          if (cancelled) break;
          await transitionToSit();
        }
        if (cancelled) break;
      }
    }

    think();
    return () => { cancelled = true; };
  }, [ready]);

  const cfg = ANIMS[anim];
  const isStatic = anim in STATIC_FRAMES;
  const bgX = (isStatic ? (STATIC_FRAMES[anim] ?? 0) : frame) * cfg.frameWidth;

  return (
    <>
      {/* Hidden imgs keep every sprite pinned in the browser's memory cache.
          Without these, some browsers evict background-image resources between
          animation switches, causing blink even after preloading. */}
      {UNIQUE_SRCS.map(src => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          style={{ position: "fixed", opacity: 0, pointerEvents: "none", width: 1, height: 1, top: -9999, left: -9999 }}
        />
      ))}

      <div style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: cfg.frameWidth,
        height: cfg.frameHeight,
        transform: `translate(-50%, -50%) scale(${DISPLAY_SCALE})`,
        transformOrigin: "center",
        backgroundImage: `url('${cfg.src}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${bgX}px 0px`,
        imageRendering: "pixelated",
        zIndex: 6,
      }} />
    </>
  );
}