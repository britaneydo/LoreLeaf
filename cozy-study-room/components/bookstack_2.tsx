import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Bookstack1({ x, y }: Props) {
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
        src="/assets/bookstack_2.png"
        className="w-[30px] h-[36px] pixelated"
        alt="book stack"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
