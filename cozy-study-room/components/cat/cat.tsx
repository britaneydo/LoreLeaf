"use client";

import { useEffect, useRef, useState } from "react";
import { findPath } from "../../lib/pathfinding";
import { isBlocked } from "../../lib/collisions";

// ANIMATION CONFIG

type AnimKey =
  | "sit_down" | "sit_up" | "sit_left" | "sit_right" | "sit_left_down" | "sit_right_down"
  | "loaf_left" | "loaf_right" | "loafNap_left" | "loafNap_right" | "lay"
  | "sleepLeft" | "sleepRight"
  | "sitWash" | "standWash" | "layWash"
  | "stand"
  | "walk_right" | "walk_left" | "walk_down" | "walk_up"
  | "walk_right_down" | "walk_right_up" | "walk_left_down" | "walk_left_up";

const ANIMS: Record<AnimKey, {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps: number;
}> = {
  // Sitting
  sit_down:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_up:         { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left:       { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right:      { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_left_down:  { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  sit_right_down: { src: "/assets/cat/sit.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },

  // Resting
  loaf_left:    { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loaf_right:   { src: "/assets/cat/loaf.png",    frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_left: { src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  loafNap_right:{ src: "/assets/cat/loafNap.png", frameWidth: 32, frameHeight: 32, frames: 1, fps: 1 },
  lay:          { src: "/assets/cat/lay.png",     frameWidth: 32, frameHeight: 32, frames: 6, fps: 5 },

  // Sleeping
  sleepLeft:  { src: "/assets/cat/sleepLeft.png",  frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },
  sleepRight: { src: "/assets/cat/sleepRight.png", frameWidth: 32, frameHeight: 32, frames: 2, fps: 3 },

  // Washing
  sitWash:   { src: "/assets/cat/sitWash.png",   frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  standWash: { src: "/assets/cat/standWash.png", frameWidth: 32, frameHeight: 32, frames: 9, fps: 8 },
  layWash:   { src: "/assets/cat/layWash.png",   frameWidth: 32, frameHeight: 32, frames: 7, fps: 8 },

  // Standing
  stand: { src: "/assets/cat/stand.png", frameWidth: 32, frameHeight: 32, frames: 8, fps: 6 },

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

// Which frame index corresponds to each static pose
// sit.png:     front(0), back(1), left(2), right(3), left-down(4), right-down(5)
// loaf.png:    left(0), right(1)
// loafNap.png: left(0), right(1)
const STATIC_FRAMES: Partial<Record<AnimKey, number>> = {
  sit_down:       0,
  sit_up:         1,
  sit_left:       2,
  sit_right:      3,
  sit_left_down:  4,
  sit_right_down: 5,
  loaf_left:      0,
  loaf_right:     1,
  loafNap_left:   0,
  loafNap_right:  1,
};

// DISPLAY CONFIG

const DISPLAY_SCALE = 1.8;
const CAT_SPEED     = 0.6;

// BEHAVIOUR CONFIG

const ROOM_LEFT   = 80;
const ROOM_RIGHT  = 1320;
const ROOM_TOP    = 110;
const ROOM_BOTTOM = 860;

const DIAG_THRESHOLD = 0.4;

// Behaviours
type IdleBehaviour = { anim: AnimKey; minMs: number; maxMs: number };
const IDLE_BEHAVIOURS: IdleBehaviour[] = [
  { anim: "loaf_left",    minMs: 5000,  maxMs: 12000 },
  { anim: "loaf_right",   minMs: 5000,  maxMs: 12000 },
  { anim: "loaf_left",    minMs: 4000,  maxMs: 10000 }, // weighted heavier
  { anim: "loafNap_left", minMs: 6000,  maxMs: 14000 },
  { anim: "loafNap_right",minMs: 6000,  maxMs: 14000 },
  { anim: "lay",          minMs: 4000,  maxMs: 10000 },
  { anim: "sleepLeft",    minMs: 8000,  maxMs: 20000 },
  { anim: "sleepRight",   minMs: 8000,  maxMs: 20000 },
  { anim: "sitWash",      minMs: 4000,  maxMs: 9000  },
  { anim: "standWash",    minMs: 3000,  maxMs: 7000  },
  { anim: "layWash",      minMs: 4000,  maxMs: 9000  },
  { anim: "stand",        minMs: 2000,  maxMs: 5000  },
];

// How often the cat decides to walk somewhere (lower = lazier cat)
const WALK_CHANCE = 0.1;


// HELPERS

function randomWalkTarget() {
  for (let i = 0; i < 40; i++) {
    const x = ROOM_LEFT  + Math.random() * (ROOM_RIGHT  - ROOM_LEFT);
    const y = ROOM_TOP   + Math.random() * (ROOM_BOTTOM - ROOM_TOP);
    if (!isBlocked(x, y)) return { x, y };
  }
  return { x: 700, y: 500 };
}

function walkAnimForDirection(dx: number, dy: number): AnimKey {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  const total = adx + ady;
  if (total === 0) return "walk_down";
  const xRatio = adx / total;
  const yRatio = ady / total;
  const isDiag = xRatio > DIAG_THRESHOLD && yRatio > DIAG_THRESHOLD;
  if (isDiag) {
    if (dx > 0 && dy > 0) return "walk_right_down";
    if (dx > 0 && dy < 0) return "walk_right_up";
    if (dx < 0 && dy > 0) return "walk_left_down";
    return "walk_left_up";
  }
  if (adx > ady) return dx > 0 ? "walk_right" : "walk_left";
  return dy > 0 ? "walk_down" : "walk_up";
}

// pick a sit pose matching the direction the cat last walked
function sitAnimForDirection(lastWalkAnim: AnimKey): AnimKey {
  if (lastWalkAnim === "walk_right")      return "sit_right";
  if (lastWalkAnim === "walk_left")       return "sit_left";
  if (lastWalkAnim === "walk_up")         return "sit_up";
  if (lastWalkAnim === "walk_right_down") return "sit_right_down";
  if (lastWalkAnim === "walk_left_down")  return "sit_left_down";
  return "sit_down";
}

// pick a loaf pose — faces left or right based on last direction
function loafForDirection(lastWalkAnim: AnimKey, nap: boolean): AnimKey {
  const facingRight = lastWalkAnim === "walk_right" || lastWalkAnim === "walk_right_down" || lastWalkAnim === "walk_right_up";
  if (nap) return facingRight ? "loafNap_right" : "loafNap_left";
  return facingRight ? "loaf_right" : "loaf_left";
}

function sleepFn(ms: number) {
  return new Promise<void>(res => setTimeout(res, ms));
}

function waitUntil(condition: () => boolean, timeoutMs: number) {
  return new Promise<void>(res => {
    const start = Date.now();
    const id = setInterval(() => {
      if (condition() || Date.now() - start > timeoutMs) {
        clearInterval(id);
        res();
      }
    }, 100);
  });
}

// COMPONENT

export default function Cat({ playerX, playerY }: { playerX: number; playerY: number }) {
  const [pos,   setPos]   = useState({ x: 500, y: 300 });
  const [anim,  setAnim]  = useState<AnimKey>("loaf_left");
  const [frame, setFrame] = useState(0);

  const posRef         = useRef({ x: 500, y: 300 });
  const animRef        = useRef<AnimKey>("loaf_left");
  const pathRef        = useRef<{ x: number; y: number }[]>([]);
  const lastWalkRef    = useRef<AnimKey>("walk_down");
  const playerXRef     = useRef(playerX);
  const playerYRef     = useRef(playerY);

  useEffect(() => { playerXRef.current = playerX; }, [playerX]);
  useEffect(() => { playerYRef.current = playerY; }, [playerY]);

  const setAnimSafe = (a: AnimKey) => {
    animRef.current = a;
    setAnim(a);
    setFrame(STATIC_FRAMES[a] ?? 0);
  };

  // animation frame ticker
  useEffect(() => {
    if (anim in STATIC_FRAMES) return;
    setFrame(0);
    const cfg = ANIMS[anim];
    const id = setInterval(
      () => setFrame(f => (f + 1) % cfg.frames),
      Math.round(1000 / cfg.fps)
    );
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

      // collision detection
      const nx = cx + Math.sign(dx) * Math.min(CAT_SPEED, Math.abs(dx));
      const ny = cy + Math.sign(dy) * Math.min(CAT_SPEED, Math.abs(dy));
      const isFinal = path.length === 1;

      let rx = cx;
      let ry = cy;

      if (isFinal) {
        rx = nx;
        ry = ny;
      } else if (!isBlocked(nx, ny)) {
        rx = nx;
        ry = ny;
      } else if (!isBlocked(nx, cy)) {
        rx = nx;
        ry = cy;
      } else if (!isBlocked(cx, ny)) {
        rx = cx;
        ry = ny;
      }

      posRef.current = { x: rx, y: ry };
      setPos({ x: rx, y: ry });
    }, 16);
    return () => clearInterval(id);
  }, []);

  // Brain
  useEffect(() => {
    let cancelled = false;

    async function think() {
      await sleepFn(1500 + Math.random() * 2000);

      while (!cancelled) {
        // sit briefly on arrival, facing the direction cat came from
        const sitAnim = sitAnimForDirection(lastWalkRef.current);
        setAnimSafe(sitAnim);
        await sleepFn(800 + Math.random() * 1200);
        if (cancelled) break;

        // decide: walk somewhere, or settle into a stationary behaviour
        if (Math.random() < WALK_CHANCE) {
          // walk to a new spot
          const goToPlayer = Math.random() < 0.25;
          let target: { x: number; y: number };
          if (goToPlayer) {
            const angle = Math.random() * Math.PI * 2;
            const dist  = 50 + Math.random() * 60;
            target = {
              x: Math.max(ROOM_LEFT,  Math.min(ROOM_RIGHT,  playerXRef.current + Math.cos(angle) * dist)),
              y: Math.max(ROOM_TOP,   Math.min(ROOM_BOTTOM, playerYRef.current + Math.sin(angle) * dist)),
            };
          } else {
            target = randomWalkTarget();
          }
          pathRef.current = findPath(posRef.current.x, posRef.current.y, target.x, target.y);
          await waitUntil(() => pathRef.current.length === 0, 20000);
          if (cancelled) break;
        } else {
          // settle into a longer stationary behaviour
          let behaviour = IDLE_BEHAVIOURS[Math.floor(Math.random() * IDLE_BEHAVIOURS.length)];
          let chosenAnim = behaviour.anim;
          if (chosenAnim === "loaf_left" || chosenAnim === "loaf_right") {
            chosenAnim = loafForDirection(lastWalkRef.current, false);
          } else if (chosenAnim === "loafNap_left" || chosenAnim === "loafNap_right") {
            chosenAnim = loafForDirection(lastWalkRef.current, true);
          }
          const durationMs = behaviour.minMs + Math.random() * (behaviour.maxMs - behaviour.minMs);
          setAnimSafe(chosenAnim);
          await sleepFn(durationMs);
          if (cancelled) break;
        }
      }
    }

    think();
    return () => { cancelled = true; };
  }, []);

  const cfg = ANIMS[anim];
  const isStatic = anim in STATIC_FRAMES;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: cfg.frameWidth,
        height: cfg.frameHeight,
        transform: `translate(-50%, -50%) scale(${DISPLAY_SCALE})`,
        transformOrigin: "center",
        backgroundImage: `url('${cfg.src}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: isStatic
          ? `-${(STATIC_FRAMES[anim] ?? 0) * cfg.frameWidth}px 0px`
          : `-${frame * cfg.frameWidth}px 0px`,
        imageRendering: "pixelated",
        zIndex: 6,
      }}
    />
  );
}