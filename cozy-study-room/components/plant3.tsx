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
        zIndex: Z.plant,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/plant3.png"
        className="w-[52px] h-[98px] pixelated"
        alt="plant"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
