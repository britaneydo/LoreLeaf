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
      }}
    >
      <img
        src="/assets/bookstack_1.png"
        className="w-[62px] h-[42px] pixelated"
        alt="book stack"
      />
    </div>
  );
}
