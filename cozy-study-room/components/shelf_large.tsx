import { Z } from "@/lib/zIndex";

type TableProps = {
  x: number;
  y: number;
};



export default function ShelfLarge({ x, y }: TableProps) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.shelf,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/shelf_large.png"
        className="w-[186px] h-[102px] pixelated"
        alt="shelf"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}