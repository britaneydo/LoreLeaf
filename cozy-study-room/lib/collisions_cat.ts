export type Rect = { x: number; y: number; w: number; h: number };

export const OBSTACLES_CAT: Rect[] = [

  // BOUNDARY WALLS (invisible — keep cat inside the room)
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
  { x: 1100, y: 180, w: 240, h: 160 }, // XLTableH
  { x: 900,  y: 380, w: 240, h: 160 }, // XLTableH

  // BOTTOM-RIGHT SOFA NOOK
  { x: 1225, y: 740, w: 56,  h: 60  }, // SmallTable

  // BOTTOM-LEFT READING NOOK
  { x: 180,  y: 694, w: 120, h: 150 }, // Table

  // SOFA + TABLE COMBO (center bottom)
  { x: 902,  y: 740, w: 120, h: 60  }, // NarrowTableH

  // SINGLE TABLES
  { x: 450,  y: 560, w: 108, h: 100 }, // SingleRed
  { x: 450,  y: 660, w: 108, h: 100 }, // SingleRed
  { x: 450,  y: 760, w: 108, h: 100 }, // SingleRed
  { x: 640,  y: 560, w: 108, h: 106 }, // SingleYellow
  { x: 640,  y: 660, w: 108, h: 106 }, // SingleYellow
  { x: 640,  y: 760, w: 108, h: 106 }, // SingleYellow

  // CHAIRS
  { x: 1125, y: 140, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1195, y: 140, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1265, y: 140, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1125, y: 290, w: 46, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1195, y: 290, w: 46, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1265, y: 290, w: 46, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE

  { x: 924, y: 338, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 994, y: 338, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE
  { x: 1064, y: 338, w: 52, h: 50 }, // CHAIR TOP RIGHT BY XL TABLE

  { x: 405, y: 155, w: 52, h: 50 }, // CHAIR TOP-LEFT-MIDDLE BY TABLE
  { x: 335, y: 155, w: 52, h: 50 }, // CHAIR TOP-LEFT-MIDDLE BY TABLE
  { x: 405, y: 320, w: 46, h: 50 }, // CHAIR TOP-LEFT-MIDDLE BY TABLE
  { x: 335, y: 320, w: 46, h: 50 }, // CHAIR TOP-LEFT-MIDDLE BY TABLE

  { x: 10, y: 200, w: 52, h: 60 }, // CHAIR TOP-LEFT BY TABLE
  { x: 10, y: 260, w: 52, h: 60 }, // CHAIR TOP-LEFT BY TABLE
  { x: 180, y: 200, w: 52, h: 60 }, // CHAIR TOP-LEFT BY TABLE
  { x: 180, y: 260, w: 52, h: 60 }, // CHAIR TOP-LEFT BY TABLE

  { x: 185, y: 645, w: 52, h: 50 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 245, y: 645, w: 52, h: 50 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 185, y: 810, w: 46, h: 50 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 245, y: 810, w: 46, h: 50 }, // CHAIR BOTTOM-LEFT BY TABLE

  { x: 125, y: 700, w: 52, h: 60 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 125, y: 755, w: 52, h: 60 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 300, y: 700, w: 52, h: 60 }, // CHAIR BOTTOM-LEFT BY TABLE
  { x: 300, y: 755, w: 52, h: 60 }, // CHAIR BOTTOM-LEFT BY TABLE

  // SOFAS
  { x: 1250, y: 824, w: 61, h: 60 }, // 1x1 Single SOFA 
  { x: 15, y: 368, w: 56, h: 127 }, // 2x1 SOFA MIDDLE-LEFT VERTICAL
  { x: 15, y: 522, w: 56, h: 127 }, // 2x1 SOFA MIDDLE-LEFT VERTICAL

  { x: 820, y: 70, w: 122, h: 70 }, // 2x1 SOFA MIDDLE-TOP HORIZONTAL
  { x: 450, y: 70, w: 122, h: 70 }, // 2x1 SOFA MIDDLE-TOP HORIZONTAL
  { x: 1140, y: 704, w: 56, h: 130 }, // 2x1 SOFA MIDDLE-BOTTOM VERTICAL
  { x: 1190, y: 644, w: 122, h: 70 }, // 2x1 SOFA MIDDLE-BOTTOM HORIZONTAL
  { x: 900, y: 670, w: 122, h: 70 }, // 2x1 SOFA MIDDLE-BOTTOM HORIZONTAL
  { x: 900, y: 794, w: 122, h: 70 }, // 2x1 SOFA MIDDLE-BOTTOM HORIZONTAL




  // PLANTS
  { x: 835,  y: 535, w: 52,  h: 98  }, // Plant3
  { x: 1190, y: 805, w: 64,  h: 64  }, // Plant

  // SHELVES
  { x: 10,   y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 198,  y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1016, y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1204, y: 20,  w: 188, h: 80  }, // LargeShelf
  { x: 1280, y: 520, w: 120, h: 100  }, // MedShelf
  { x: 1150, y: 520, w: 120, h: 100  }, // MedShelf
  { x: 1020, y: 520, w: 120, h: 100  }, // MedShelf
  { x: 890,  y: 520, w: 120, h: 100  }, // MedShelf

  // LADDERS
  { x: 80,   y: 25,  w: 65,  h: 80  }, // Ladder
  { x: 1100, y: 25,  w: 65,  h: 80  }, // Ladder
  { x: 1320, y: 535, w: 65,  h: 80  }, // Ladder

  // BOOKS
  { x: 410,   y: 710, w: 40,  h: 50  }, // Books
  { x: 560,   y: 805, w: 50,  h: 50  }, // Books

  //LAMPS
  { x: 850,   y: 715, w: 40,  h: 85  }, // Lamps
  { x: 1150,  y: 620, w: 40,  h: 85  }, // Lamps
  { x: 25,  y: 440, w: 40,  h: 85  }, // Lamps

  // XL TABLES + CHAIRS
  { x: 1100, y: 180, w: 240, h: 100 }, // XLTableH


];

// Cat collision box — 12×10 centered on their position
const CAT_W = 12;
const CAT_H = 10;

export function isCatBlocked(x: number, y: number): boolean {
  const left   = x - CAT_W / 2;
  const right  = x + CAT_W / 2;
  const top    = y - CAT_H / 2;
  const bottom = y + CAT_H / 2;

  // check if cat's box overlap with any other obstacle box 
  return OBSTACLES_CAT.some(
    (o) =>
      right  > o.x         &&
      left   < o.x + o.w   &&
      bottom > o.y         &&
      top    < o.y + o.h
  );
}