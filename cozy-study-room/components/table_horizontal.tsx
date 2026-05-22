import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function TableHorizontal({ x, y }: Props) {
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
        src="/assets/table_horizontal.png"
        className="w-[120px] h-[60px] pixelated"
        alt="table"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
