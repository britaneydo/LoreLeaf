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
        src="/assets/table_XLV.png"
        className="w-[120px] h-[244px] pixelated"
        alt="large table"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
