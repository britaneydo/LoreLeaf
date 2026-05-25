import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function ShelfSmall({ x, y }: Props) {
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
        src="/assets/shelf_small.png"
        className="w-[60px] h-[102px] pixelated"
        alt="small shelf"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
