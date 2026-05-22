import { Z } from "@/lib/zIndex";

type ChairProps = {
  x: number;
  y: number;
};

export default function ChairLeft({ x, y }: ChairProps) {
  return (
    <img
      src="/assets/chair.png"
      className="absolute w-[48px] h-[48px] pixelated"
      style={{
        left: x,
        top: y,
        zIndex: Z.chair,
        imageRendering: "pixelated",
      }}
      alt="chair"
      
    />
  );
}