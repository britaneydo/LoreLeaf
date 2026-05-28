import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Plant({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.carpet,
      }}
    >
      <img
        src="/assets/globe.png"
        className="w-[48px] h-[64px] pixelated"
        alt="globe"
        style={{
        imageRendering: "pixelated",
        pointerEvents: "none",
        }}
      />
    </div>
  );
}
