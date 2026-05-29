import { Z } from "@/lib/zIndex";

type ChairProps = {
  x: number;
  y: number;
};

export default function ChairLeft({ x, y }: ChairProps) {
  return (
    <img
      src="/assets/chair_top.png"
      className="absolute w-[40px] h-[54px] pixelated"
      style={{
        left: x,
        top: y,
        zIndex: Z.chair,
        imageRendering: "pixelated",
        pointerEvents: "none",
      }}
      alt="chair"
      
    />
  );
}