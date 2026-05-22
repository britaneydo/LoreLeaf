import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function TableVertical({ x, y }: Props) {
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
