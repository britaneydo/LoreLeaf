import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Ladder({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.ladder,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/ladder.png"
        className="w-[64px] h-[102px] pixelated"
        alt="ladder"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
