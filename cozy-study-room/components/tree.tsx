"use client";

// TREE COMPONENT
// Displays one of 5 growth stages based on the stage prop (0–4).
// Each stage has its own sprite size so the tree is centered correctly.

type Props = {
  stage: number; // 0 = seedling, 4 = fully grown
  x: number;
  y: number;
};

const STAGE_CONFIG = [
  { src: "/assets/Luminous_tree5.png", width: 60,  height: 60,  anchorX: 30,  anchorY: -30  },
  { src: "/assets/Luminous_tree4.png", width: 200,  height: 200,  anchorX: 100,  anchorY: 90  },
  { src: "/assets/Luminous_tree3.png", width: 250,  height: 250,  anchorX: 125,  anchorY: 155  },
  { src: "/assets/Luminous_tree2.png", width: 450,  height: 450, anchorX: 225,  anchorY: 280  },
  { src: "/assets/Luminous_tree1.png", width: 530, height: 530, anchorX: 245,  anchorY: 370 },
];

export default function Tree({ stage, x, y }: Props) {
  const cfg = STAGE_CONFIG[Math.min(stage, 4)];
  return (
    <img
      src={cfg.src}
      style={{
        position: "absolute",
        left: x - cfg.anchorX,
        top:  y - cfg.anchorY,
        width: cfg.width,
        height: cfg.height,
        imageRendering: "pixelated",
        zIndex: 9,
      }}
      alt={`tree stage ${stage}`}
    />
  );
}