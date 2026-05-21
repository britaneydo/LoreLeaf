import { Z } from "@/lib/zIndex";

type TableProps = {
  x: number;
  y: number;
};



export default function Tablelarge({ x, y }: TableProps) {
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
        src="/assets/shelf_large.png"
        className="w-[150px] h-[90px] pixelated"
        alt="shelf"
      />
    </div>
  );
}