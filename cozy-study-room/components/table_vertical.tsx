import { Z } from "@/lib/zIndex";

type TableProps = {
  x: number;
  y: number;
};



export default function TableNarrow({ x, y }: TableProps) {
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
        src="/assets/table_vertical.png"
        className="w-[56px] h-[122px] pixelated"
        alt="table"
      />
    </div>
  );
}