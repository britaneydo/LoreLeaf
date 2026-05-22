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
      }}
    >
      <img
        src="/assets/carpet_narrow.png"
        className="w-[124px] h-[56px] pixelated"
        alt="narrow carpet"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
