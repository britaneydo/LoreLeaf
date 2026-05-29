import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Bookstack3({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.table,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/bookstack_3.png"
        className="w-[48px] h-[40px] pixelated"
        alt="book stack"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
