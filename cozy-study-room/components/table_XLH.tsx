import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function TableLarge({ x, y }: Props) {
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
        src="/assets/table_XLH.png"
        className="w-[240px] h-[122px] pixelated"
        alt="large table"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
