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
        zIndex: Z.plant,
      }}
    >
      <img
        src="/assets/purpleflower.png"
        className="w-[32px] h-[54px] pixelated"
        alt="narrow carpet"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
