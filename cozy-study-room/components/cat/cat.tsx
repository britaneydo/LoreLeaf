"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { findPath } from "../../lib/pathfinding";
import { isCatBlocked } from "../../lib/collisions_cat";
import type { CatState } from "../../lib/useSharedCat";

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
  sit_down:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_up:         { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right:      { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left_down:  { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right_down: { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loaf_left:      { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loaf_right:     { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_left:   { src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_right:  { src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_down:       { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_up:         { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_left:       { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_right:      { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_left_down:  { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay_right_down: { src: "/assets/cat/lay.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sleepLeft:      { src: "/assets/cat/sleepLeft.png",  frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },
  sleepRight:     { src: "/assets/cat/sleepRight.png", frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },
  sitWash:        { src: "/assets/cat/sitWash.png",   frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  standWash:      { src: "/assets/cat/standWash.png", frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  layWash:        { src: "/assets/cat/layWash.png",   frameWidth: 32, frameHeight: 32, frames: 7, fps: 8 },
  stand_down:       { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_up:         { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left:       { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right:      { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left_down:  { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right_down: { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_right_up:   { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  stand_left_up:    { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  walk_right:       { src: "/assets/cat/walkRight.png",     frameWidth: 32, frameHeight: 32, frames: 8, fps: 12 },
  walk_left:        { src: "/assets/cat/walkLeft.png",      frameWidth: 32, frameHeight: 32, frames: 8, fps: 12 },
  walk_down:        { src: "/assets/cat/walkDown.png",      frameWidth: 32, frameHeight: 32, frames: 4, fps: 10 },
  walk_up:          { src: "/assets/cat/walkUp.png",        frameWidth: 32, frameHeight: 32, frames: 4, fps: 10 },
  walk_right_down:  { src: "/assets/cat/walkRightDown.png", frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_right_up:    { src: "/assets/cat/walkRightUp.png",   frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_left_down:   { src: "/assets/cat/walkLeftDown.png",  frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
  walk_left_up:     { src: "/assets/cat/walkLeftUp.png",    frameWidth: 32, frameHeight: 32, frames: 6, fps: 12 },
};

const STATIC_FRAMES: Partial<Record<AnimKey, number>> = {
  sit_down: 0, sit_up: 1, sit_left: 2, sit_right: 3, sit_left_down: 4, sit_right_down: 5,
  stand_down: 0, stand_up: 1, stand_left: 2, stand_right: 3,
  stand_left_down: 4, stand_right_down: 5, stand_right_up: 6, stand_left_up: 7,
  lay_down: 0, lay_up: 1, lay_left: 2, lay_right: 3, lay_left_down: 4, lay_right_down: 5,
  loaf_left: 0, loaf_right: 1, loafNap_left: 0, loafNap_right: 1,
};

const UNIQUE_SRCS = [...new Set(Object.values(ANIMS).map(a => a.src))];

const DISPLAY_SCALE  = 1.8;
const CAT_SPEED      = 0.6;
const DIAG_THRESHOLD = 0.4;
const ROOM_LEFT      = 80;
const ROOM_RIGHT     = 1320;
const ROOM_TOP       = 110;
const ROOM_BOTTOM    = 860;
const WALK_CHANCE    = 0.2;
const BROADCAST_MS   = 50;

type IdleBehaviour = { anim: AnimKey; minMs: number; maxMs: number };
const IDLE_BEHAVIOURS: IdleBehaviour[] = [
  { anim: "loaf_left",     minMs: 5000, maxMs: 12000 },
  { anim: "loaf_left",     minMs: 4000, maxMs: 10000 },
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

// Seeded PRNG, same seed produces same sequence on every client
function mulberry32(seed: number) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function walkAnimForDirection(dx: number, dy: number): AnimKey {
  const adx = Math.abs(dx), ady = Math.abs(dy), total = adx + ady;
  if (total === 0) return "walk_down";
  const isDiag = (adx/total) > DIAG_THRESHOLD && (ady/total) > DIAG_THRESHOLD;
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
function sleepMs(ms: number) { return new Promise<void>(res => setTimeout(res, ms)); }
function waitUntil(condition: () => boolean, timeoutMs: number) {
  return new Promise<void>(res => {
    const start = Date.now();
    const id = setInterval(() => {
      if (condition() || Date.now() - start > timeoutMs) { clearInterval(id); res(); }
    }, 100);
  });
}

type CatProps = {
  isHost: boolean;
  sharedState: CatState;
  onHostStateChange: (s: CatState) => void;
};

export default function Cat({ isHost, sharedState, onHostStateChange }: CatProps) {
  const [anim,  setAnim]  = useState<AnimKey>("loaf_left");
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  // Host refs
  const posRef      = useRef({ x: 700, y: 500 });
  const animRef     = useRef<AnimKey>("loaf_left");
  const frameRef    = useRef(0);
  const pathRef     = useRef<{ x: number; y: number }[]>([]);
  const lastWalkRef = useRef<AnimKey>("walk_down");
  const stuckRef    = useRef({ x: 700, y: 500, ticks: 0 });

  // Non-host interpolation refs
  const snap0Ref = useRef<{ x: number; y: number; t: number } | null>(null);
  const snap1Ref = useRef<{ x: number; y: number; t: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const moveDivTo = useCallback((x: number, y: number) => {
    if (divRef.current) {
      divRef.current.style.left = `${x}px`;
      divRef.current.style.top  = `${y}px`;
    }
  }, []);

  // When we become host, seed posRef from the last known sharedState so the
  // brain starts walking from the cat's actual position, not (700, 500).
  const isHostRef = useRef(false);
  useEffect(() => {
    const justBecameHost = isHost && !isHostRef.current;
    isHostRef.current = isHost;

    if (justBecameHost) {
      const x = sharedState.x || 700;
      const y = sharedState.y || 500;
      posRef.current   = { x, y };
      stuckRef.current = { x, y, ticks: 0 };
      moveDivTo(x, y);
      // Also clear any stale path so the brain doesn't try to resume
      // a path that was computed relative to the old host's position.
      pathRef.current = [];
      const nextAnim = sharedState.anim in ANIMS
        ? (sharedState.anim as AnimKey) : "loaf_left";
      animRef.current  = nextAnim;
      frameRef.current = STATIC_FRAMES[nextAnim] ?? 0;
      setAnim(nextAnim);
      setFrame(STATIC_FRAMES[nextAnim] ?? 0);
    }
  }, [isHost, sharedState, moveDivTo]);

  // Receive broadcast (non-host)
  useEffect(() => {
    if (isHost) return;
    const nextAnim = sharedState.anim in ANIMS
      ? (sharedState.anim as AnimKey) : "loaf_left";
    snap0Ref.current = snap1Ref.current;
    snap1Ref.current = { x: sharedState.x, y: sharedState.y, t: Date.now() };
    setAnim(nextAnim);
    setFrame(sharedState.frame);
  }, [isHost, sharedState]);

  // Non-host rAF interpolation, writes directly to DOM, zero React re-renders
  useEffect(() => {
    if (isHost) return;
    function tick() {
      const s1 = snap1Ref.current;
      const s0 = snap0Ref.current;
      if (s1) {
        if (s0 && s1.t !== s0.t) {
          const t = Math.min((Date.now() - s0.t) / (s1.t - s0.t), 1.0);
          moveDivTo(s0.x + (s1.x - s0.x) * t, s0.y + (s1.y - s0.y) * t);
        } else {
          moveDivTo(s1.x, s1.y);
        }
      }
      rafIdRef.current = requestAnimationFrame(tick);
    }
    rafIdRef.current = requestAnimationFrame(tick);
    return () => { if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current); };
  }, [isHost, moveDivTo]);

  // Sprite preload
  useEffect(() => {
    let loaded = 0;
    UNIQUE_SRCS.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => { if (++loaded === UNIQUE_SRCS.length) setReady(true); };
      img.src = src;
    });
  }, []);

  const setAnimSafe = useCallback((a: AnimKey) => {
    const f = STATIC_FRAMES[a] ?? 0;
    animRef.current = a; frameRef.current = f;
    setAnim(a); setFrame(f);
  }, []);

  // Frame ticker (host only)
  useEffect(() => {
    if (!isHost || anim in STATIC_FRAMES) return;
    const cfg = ANIMS[anim];
    const id = setInterval(() => {
      const next = (frameRef.current + 1) % cfg.frames;
      frameRef.current = next; setFrame(next);
    }, Math.round(1000 / cfg.fps));
    return () => clearInterval(id);
  }, [isHost, anim]);

  // Movement loop (host only)
  useEffect(() => {
    if (!isHost) return;
    const id = setInterval(() => {
      const path = pathRef.current;
      if (!path.length) return;
      const target = path[0];
      const { x: cx, y: cy } = posRef.current;
      const dx = target.x - cx, dy = target.y - cy;
      if (Math.abs(dx) < CAT_SPEED && Math.abs(dy) < CAT_SPEED) {
        const rest = path.slice(1);
        pathRef.current = rest;
        if (!rest.length) { posRef.current = { x: target.x, y: target.y }; moveDivTo(target.x, target.y); }
        return;
      }
      const newAnim = walkAnimForDirection(dx, dy);
      if (animRef.current !== newAnim) { lastWalkRef.current = newAnim; animRef.current = newAnim; setAnim(newAnim); }
      const nx = cx + Math.sign(dx) * Math.min(CAT_SPEED, Math.abs(dx));
      const ny = cy + Math.sign(dy) * Math.min(CAT_SPEED, Math.abs(dy));
      let rx = cx, ry = cy;
      if      (!isCatBlocked(nx, ny)) { rx = nx; ry = ny; }
      else if (!isCatBlocked(nx, cy)) { rx = nx; }
      else if (!isCatBlocked(cx, ny)) { ry = ny; }
      posRef.current = { x: rx, y: ry };
      moveDivTo(rx, ry);
      const s = stuckRef.current;
      if (Math.abs(rx - s.x) < 0.5 && Math.abs(ry - s.y) < 0.5) {
        if (++s.ticks > 120) { pathRef.current = []; s.ticks = 0; }
      } else { s.x = rx; s.y = ry; s.ticks = 0; }
    }, 16);
    return () => clearInterval(id);
  }, [isHost, moveDivTo]);

  // Broadcast (host only)
  useEffect(() => {
    if (!isHost) return;
    const id = setInterval(() => {
      onHostStateChange({
        x: posRef.current.x, y: posRef.current.y,
        anim: animRef.current, frame: frameRef.current,
        updated_at: Date.now(),
      });
    }, BROADCAST_MS);
    return () => clearInterval(id);
  }, [isHost, onHostStateChange]);

  // Cat brain (host only)
  useEffect(() => {
    if (!ready || !isHost) return;
    let cancelled = false;

    // Use a seeded RNG so if we ever want to sync brains across clients
    // in future we can, for now only host runs this
    const rng = mulberry32(Date.now() & 0xffffffff);

    function randomWalkTarget() {
      for (let i = 0; i < 40; i++) {
        const x = ROOM_LEFT  + rng() * (ROOM_RIGHT  - ROOM_LEFT);
        const y = ROOM_TOP   + rng() * (ROOM_BOTTOM - ROOM_TOP);
        if (!isCatBlocked(x, y)) return { x, y };
      }
      return { x: 700, y: 500 };
    }

    async function transitionToSit() {
      setAnimSafe(sitForDir(lastWalkRef.current));
      await sleepMs(800 + rng() * 1000);
    }
    function resolveDirection(a: AnimKey): AnimKey {
      if (a === "loaf_left"    || a === "loaf_right")    return loafForDir(lastWalkRef.current, false);
      if (a === "loafNap_left" || a === "loafNap_right") return loafForDir(lastWalkRef.current, true);
      if (a === "stand_down") return standForDir(lastWalkRef.current);
      if (a === "lay_down")   return layForDir(lastWalkRef.current);
      return a;
    }
    async function think() {
      await sleepMs(1500 + rng() * 2000);
      await transitionToSit();
      while (!cancelled) {
        if (rng() < WALK_CHANCE) {
          const target = randomWalkTarget();
          if (!isCatBlocked(target.x, target.y)) {
            pathRef.current = findPath(posRef.current.x, posRef.current.y, target.x, target.y);
            await waitUntil(() => pathRef.current.length === 0, 20000);
          }
          if (cancelled) break;
          await transitionToSit();
        } else {
          const b = IDLE_BEHAVIOURS[Math.floor(rng() * IDLE_BEHAVIOURS.length)];
          setAnimSafe(resolveDirection(b.anim));
          await sleepMs(b.minMs + rng() * (b.maxMs - b.minMs));
          if (cancelled) break;
          await transitionToSit();
        }
      }
    }
    think();
    return () => { cancelled = true; };
  }, [ready, isHost, setAnimSafe]);

  const cfg      = ANIMS[anim];
  const isStatic = anim in STATIC_FRAMES;
  const bgX      = (isStatic ? (STATIC_FRAMES[anim] ?? 0) : frame) * cfg.frameWidth;

  return (
    <>
      {UNIQUE_SRCS.map(src => (
        <img key={src} src={src} alt="" aria-hidden="true"
          style={{ position:"fixed", opacity:0, pointerEvents:"none", width:1, height:1, top:-9999, left:-9999 }}
        />
      ))}
      <div
        ref={divRef}
        style={{
          position:           "absolute",
          left:               700,
          top:                500,
          width:              cfg.frameWidth,
          height:             cfg.frameHeight,
          transform:          `translate(-50%, -50%) scale(${DISPLAY_SCALE})`,
          transformOrigin:    "center",
          backgroundImage:    `url('${cfg.src}')`,
          backgroundRepeat:   "no-repeat",
          backgroundPosition: `-${bgX}px 0px`,
          imageRendering:     "pixelated",
          zIndex:             6,
          // CSS transition fills the 50ms gap between broadcasts smoothly
          transition:         !isHost ? "left 45ms linear, top 45ms linear" : "none",
        }}
      />
    </>
  );
}