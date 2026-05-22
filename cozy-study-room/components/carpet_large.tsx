import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function CarpetLarge({ x, y }: Props) {
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
        src="/assets/carpet_large.png"
        className="w-[184px] h-[190px] pixelated"
        alt="large carpet"
      />
    </div>
  );
}
