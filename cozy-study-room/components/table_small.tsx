import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function TableSmall({ x, y }: Props) {
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
        src="/assets/table_small.png"
        className="w-[56px] h-[60px] pixelated"
        alt="small table"
      />
    </div>
  );
}
