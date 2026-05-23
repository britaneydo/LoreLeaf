import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function SingleYellow({ x, y }: Props) {
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
        src="/assets/single_yellow.png"
        className="w-[108px] h-[106px] pixelated"
        alt="yellow book"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
