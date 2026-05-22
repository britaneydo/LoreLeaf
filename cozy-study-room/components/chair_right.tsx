import { Z } from "@/lib/zIndex";

type ChairProps = {
  x: number;
  y: number;
};

export default function ChairLeft({ x, y }: ChairProps) {
  return (
    <img
      src="/assets/chair_right.png"
      className="absolute w-[36px] h-[62px] pixelated"
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