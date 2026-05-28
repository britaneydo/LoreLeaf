import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function CarpetNarrow({ x, y }: Props) {
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
        src="/assets/orangeflower.png"
        className="w-[38px] h-[48px] pixelated"
        alt="narrow carpet"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
