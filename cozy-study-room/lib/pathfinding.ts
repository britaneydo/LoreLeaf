import { OBSTACLES } from "./collisions";

const CELL = 20;
const COLS = Math.ceil(1400 / CELL);
const ROWS = Math.ceil(900 / CELL);
const WALL_Y = 96;

// Hard pixel boundaries for the walkable room area
const ROOM_LEFT   = 8;
const ROOM_RIGHT  = 1392;
const ROOM_TOP    = WALL_Y;
const ROOM_BOTTOM = 872;

function buildGrid(): boolean[][] {
  const grid: boolean[][] = Array.from({ length: ROWS }, () =>
    Array(COLS).fill(false)
  );

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = col * CELL;
      const y = row * CELL;

      // Block cells outside the walkable room bounds
      if (
        x < ROOM_LEFT ||
        x + CELL > ROOM_RIGHT ||
        y < ROOM_TOP ||
        y + CELL > ROOM_BOTTOM
      ) {
        grid[row][col] = true;
        continue;
      }

      // Block cells above the back wall
      if (y + CELL <= WALL_Y) { grid[row][col] = true; continue; }

      grid[row][col] = OBSTACLES.some(
        (o) =>
          x + CELL > o.x && x < o.x + o.w &&
          y + CELL > o.y && y < o.y + o.h
      );
    }
  }

  return grid;
}

const GRID = buildGrid();

function nearestWalkable(col: number, row: number): { col: number; row: number } {
  const clamp = (v: number, max: number) => Math.max(0, Math.min(max - 1, v));
  col = clamp(col, COLS);
  row = clamp(row, ROWS);
  if (!GRID[row][col]) return { col, row };
  for (let radius = 1; radius < 20; radius++) {
    for (let dc = -radius; dc <= radius; dc++) {
      for (let dr = -radius; dr <= radius; dr++) {
        if (Math.abs(dc) !== radius && Math.abs(dr) !== radius) continue;
        const nc = clamp(col + dc, COLS);
        const nr = clamp(row + dr, ROWS);
        if (!GRID[nr][nc]) return { col: nc, row: nr };
      }
    }
  }
  return { col, row };
}

type Node = { col: number; row: number; g: number; f: number; parent: Node | null };

function heuristic(ac: number, ar: number, bc: number, br: number): number {
  return Math.max(Math.abs(ac - bc), Math.abs(ar - br));
}

export function findPath(
  startX: number, startY: number,
  endX: number,   endY: number
): { x: number; y: number }[] {
  // Clamp coordinates to the room bounds before pathfinding
  const clampX = (v: number) => Math.max(ROOM_LEFT + CELL, Math.min(ROOM_RIGHT - CELL, v));
  const clampY = (v: number) => Math.max(ROOM_TOP + CELL, Math.min(ROOM_BOTTOM - CELL, v));

  const safeStartX = clampX(startX);
  const safeStartY = clampY(startY);
  const safeEndX   = clampX(endX);
  const safeEndY   = clampY(endY);

  const { col: sc, row: sr } = nearestWalkable(Math.floor(safeStartX / CELL), Math.floor(safeStartY / CELL));
  const { col: ec, row: er } = nearestWalkable(Math.floor(safeEndX   / CELL), Math.floor(safeEndY   / CELL));

  if (sc === ec && sr === er) return [{ x: endX, y: endY }];

  const open: Node[] = [];
  const closed = new Set<string>();
  const key = (c: number, r: number) => `${c},${r}`;

  open.push({ col: sc, row: sr, g: 0, f: heuristic(sc, sr, ec, er), parent: null });

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;

    if (current.col === ec && current.row === er) {
      const cells: { x: number; y: number }[] = [];
      let node: Node | null = current;
      while (node) {
        cells.unshift({ x: node.col * CELL + CELL / 2, y: node.row * CELL + CELL / 2 });
        node = node.parent;
      }
      if (cells.length > 0) cells[cells.length - 1] = { x: endX, y: endY };
      return cells;
    }

    closed.add(key(current.col, current.row));

    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        if (dc === 0 && dr === 0) continue;
        const nc = current.col + dc;
        const nr = current.row + dr;
        if (nc < 0 || nc >= COLS || nr < 0 || nr >= ROWS) continue;
        if (GRID[nr][nc]) continue;
        if (closed.has(key(nc, nr))) continue;
        if (dc !== 0 && dr !== 0 && (GRID[current.row][nc] || GRID[nr][current.col])) continue;

        const g = current.g + (dc !== 0 && dr !== 0 ? 1.414 : 1);
        const f = g + heuristic(nc, nr, ec, er);
        const existing = open.find((n) => n.col === nc && n.row === nr);
        if (existing) { if (g < existing.g) { existing.g = g; existing.f = f; existing.parent = current; } }
        else open.push({ col: nc, row: nr, g, f, parent: current });
      }
    }
  }

  return [{ x: endX, y: endY }];
}

export { GRID, CELL, COLS, ROWS };