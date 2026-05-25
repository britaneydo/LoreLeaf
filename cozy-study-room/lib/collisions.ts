export type Rect = { x: number; y: number; w: number; h: number };

export const OBSTACLES: Rect[] = [

  // BOUNDARY WALLS (invisible — keep avatar inside the room)
  { x: -20,  y: 0,    w: 20,   h: 900  }, // left wall
  { x: 1400, y: 0,    w: 20,   h: 900  }, // right wall
  { x: 0,    y: 880,  w: 1400, h: 20   }, // bottom wall
  { x: 0,    y: -20,  w: 1400, h: 20   }, // top wall (above back wall)

  // TREE
  { x: 610,  y: 350,  w: 185,  h: 140  },

  // BACK WALL
  { x: 678,  y: 15,  w: 44,  h: 118 }, // Clock
  { x: 960,  y: 65,  w: 48,  h: 64  }, // Globe
  { x: 580,  y: 75,  w: 56,  h: 60  }, // SmallTable
  { x: 410,  y: 80,  w: 38,  h: 48  }, // OrangeFlower
  { x: 0,    y: 0,   w: 1400, h: 80  },
  { x: 758,  y: 75,  w: 56,  h: 60  },
  { x: 910,  y: 130, w: 60,  h: 40  },

  // CORNER PLANTS
  { x: 0,    y: 98,  w: 64,  h: 64  }, // Plant left
  { x: 1336, y: 98,  w: 64,  h: 64  }, // Plant right

  // TOP-LEFT READING NOOK
  { x: 62,   y: 204, w: 120, h: 122 }, // Table
  { x: 332,  y: 204, w: 120, h: 122 }, // Table

  // MID-LEFT vertical tables
  { x: 80,   y: 380, w: 56,  h: 122 }, // NarrowTableV
  { x: 80,   y: 530, w: 56,  h: 122 }, // NarrowTableV

  // XL TABLES
  { x: 1100, y: 180, w: 240, h: 100 }, // XLTableH
  { x: 900,  y: 380, w: 240, h: 100 }, // XLTableH

  // BOTTOM-RIGHT SOFA NOOK
  { x: 1225, y: 740, w: 56,  h: 60  }, // SmallTable

  // BOTTOM-LEFT READING NOOK
  { x: 180,  y: 694, w: 120, h: 122 }, // Table

  // SOFA + TABLE COMBO (center bottom)
  { x: 902,  y: 740, w: 120, h: 60  }, // NarrowTableH

  // SINGLE TABLES
  { x: 450,  y: 560, w: 108, h: 100 }, // SingleRed
  { x: 450,  y: 660, w: 108, h: 100 }, // SingleRed
  { x: 450,  y: 760, w: 108, h: 100 }, // SingleRed
  { x: 640,  y: 560, w: 108, h: 106 }, // SingleYellow
  { x: 640,  y: 660, w: 108, h: 106 }, // SingleYellow
  { x: 640,  y: 760, w: 108, h: 106 }, // SingleYellow

  // PLANTS
  { x: 835,  y: 535, w: 52,  h: 98  }, // Plant3
  { x: 1190, y: 805, w: 64,  h: 64  }, // Plant

  // SHELVES
  { x: 10,   y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 198,  y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1016, y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1204, y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1280, y: 520, w: 120, h: 60  }, // MedShelf
  { x: 1150, y: 520, w: 120, h: 60  }, // MedShelf
  { x: 1020, y: 520, w: 120, h: 60  }, // MedShelf
  { x: 890,  y: 520, w: 120, h: 60  }, // MedShelf

  // LADDERS
  { x: 80,   y: 25,  w: 65,  h: 80  }, // Ladder
  { x: 1100, y: 25,  w: 65,  h: 80  }, // Ladder
  { x: 1320, y: 535, w: 65,  h: 80  }, // Ladder

];

// Player collision box — 16×16 centered on their position
const PLAYER_W = 12;
const PLAYER_H = 12;

export function isBlocked(x: number, y: number): boolean {
  const left   = x - PLAYER_W / 2;
  const right  = x + PLAYER_W / 2;
  const top    = y - PLAYER_H / 2;
  const bottom = y + PLAYER_H / 2;

  return OBSTACLES.some(
    (o) =>
      right  > o.x         &&
      left   < o.x + o.w   &&
      bottom > o.y         &&
      top    < o.y + o.h
  );
}