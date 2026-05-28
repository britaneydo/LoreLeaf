import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function CarpetNarrow2({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.carpet,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/carpet_narrow2.png"
        className="w-[56px] h-[124px] pixelated"
        alt="narrow carpet"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
