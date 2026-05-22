import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function ShelfMedium({ x, y }: Props) {
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
        src="/assets/shelf_medium.png"
        className="w-[122px] h-[114px] pixelated"
        alt="medium shelf"
      />
    </div>
  );
}
