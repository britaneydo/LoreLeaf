export type Facing = "left" | "right";

export type Seat = {
  id: string;
  x: number;
  y: number;
  sitX: number;
  sitY: number;
  facing: Facing;
};

export const SEATS: Seat[] = [
  // TOP LEFT READING NOOK (first table cluster)
  {
    id: "topLeft-1",
    x: 20,
    y: 200,
    sitX: 55,
    sitY: 220,
    facing: "right",
  },
  {
    id: "topLeft-2",
    x: 190,
    y: 200,
    sitX: 190,
    sitY: 220,
    facing: "left",
  },
  {
    id: "topLeft-3",
    x: 20,
    y: 260,
    sitX: 55,
    sitY: 280,
    facing: "right",
  },
  {
    id: "topLeft-4",
    x: 190,
    y: 260,
    sitX: 190,
    sitY: 280,
    facing: "left",
  },

  // SECOND READING NOOK (middle-left cluster)
  {
    id: "midLeft-1",
    x: 120,
    y: 700,
    sitX: 60,
    sitY: 405,
    facing: "right",
  },
  {
    id: "midLeft-2",
    x: 130,
    y: 750,
    sitX: 60,
    sitY: 555,
    facing: "right",
  },
  {
    id: "midLeft-3",
    x: 310,
    y: 700,
    sitX: 60,
    sitY: 600,
    facing: "right",
  },

  // TOP CENTER TABLE CLUSTER
  {
    id: "topCenter-1",
    x: 340,
    y: 155,
    sitX: 365,
    sitY: 170,
    facing: "right",
  },
  {
    id: "topCenter-2",
    x: 410,
    y: 155,
    sitX: 435,
    sitY: 170,
    facing: "right",
  },

  // RIGHT SIDE LARGE TABLES
  {
    id: "rightTop-1",
    x: 1130,
    y: 140,
    sitX: 1155,
    sitY: 155,
    facing: "right",
  },
  {
    id: "rightTop-2",
    x: 1200,
    y: 140,
    sitX: 1225,
    sitY: 155,
    facing: "right",
  },
  {
    id: "rightTop-3",
    x: 1270,
    y: 140,
    sitX: 1295,
    sitY: 155,
    facing: "right",
  },

  {
    id: "rightBottom-1",
    x: 930,
    y: 500,
    sitX: 955,
    sitY: 355,
    facing: "right",
  },
  {
    id: "rightBottom-2",
    x: 1000,
    y: 500,
    sitX: 1025,
    sitY: 355,
    facing: "right",
  },
  {
    id: "rightBottom-3",
    x: 1070,
    y: 500,
    sitX: 1095,
    sitY: 355,
    facing: "right",
  },

  // BOTTOM LEFT BIG NOOK
  {
    id: "botLeft-1",
    x: 120,
    y: 700,
    sitX: 165,
    sitY: 720,
    facing: "right",
  },
  {
    id: "botLeft-2",
    x: 130,
    y: 750,
    sitX: 165,
    sitY: 770,
    facing: "right",
  },
  {
    id: "botLeft-3",
    x: 310,
    y: 700,
    sitX: 310,
    sitY: 720,
    facing: "left",
  },
  {
    id: "botLeft-4",
    x: 310,
    y: 750,
    sitX: 310,
    sitY: 770,
    facing: "left",
  },
  {
    id: "botLeft-5",
    x: 310,
    y: 750,
    sitX: 215,
    sitY: 660,
    facing: "right",
  },
  {
    id: "botLeft-6",
    x: 310,
    y: 750,
    sitX: 275,
    sitY: 660,
    facing: "right",
  },

  // TOP SOFAS
  {
    id: "sofatop-1",
    x: 310,
    y: 750,
    sitX: 490,
    sitY: 95,
    facing: "right",
  },
  {
    id: "sofatop-2",
    x: 310,
    y: 750,
    sitX: 545,
    sitY: 95,
    facing: "right",
  },
  {
    id: "sofatop-3",
    x: 310,
    y: 750,
    sitX: 860,
    sitY: 95,
    facing: "right",
  },
  {
    id: "sofatop-4",
    x: 310,
    y: 750,
    sitX: 915,
    sitY: 95,
    facing: "right",
  },

  // BOTTOM SOFAS
  {
    id: "bottomsofa-1",
    x: 310,
    y: 750,
    sitX: 940,
    sitY: 700,
    facing: "right",
  },
  {
    id: "bottomsofa-2",
    x: 310,
    y: 750,
    sitX: 990,
    sitY: 700,
    facing: "right",
  },
  {
    id: "bottomsofa-3",
    x: 310,
    y: 750,
    sitX: 1230,
    sitY: 675,
    facing: "right",
  },
  {
    id: "bottomsofa-4",
    x: 310,
    y: 750,
    sitX: 1280,
    sitY: 675,
    facing: "right",
  },
  {
    id: "bottomsofa-5",
    x: 310,
    y: 750,
    sitX: 1180,
    sitY: 730,
    facing: "right",
  },
  {
    id: "bottomsofa-6",
    x: 310,
    y: 750,
    sitX: 1180,
    sitY: 780,
    facing: "right",
  },


];