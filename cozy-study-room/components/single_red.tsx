import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function SingleRed({ x, y }: Props) {
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
        src="/assets/single_red.png"
        className="w-[108px] h-[100px] pixelated"
        alt="red book"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
