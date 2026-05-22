import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Clock({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.shelf,
      }}
    >
      <img
        src="/assets/clock.png"
        className="w-[44px] h-[118px] pixelated"
        alt="grandfather clock"
      />
    </div>
  );
}
