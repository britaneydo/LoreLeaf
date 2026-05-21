import { Z } from "@/lib/zIndex";

type CarpetProps = {
  x: number;
  y: number;
};



export default function Carpet({ x, y }: CarpetProps) {
  return (
    <img
      src="/assets/carpet_large.png"
      className="absolute w-[128px] h-[128px] pixelated"
      style={{
        left: x,
        top: y,
        zIndex: Z.carpet,
      }}
      alt="carpet"
    />
  );
}