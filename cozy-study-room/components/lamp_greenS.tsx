import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Bookstack3({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.table,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/lamp_greenS.png"
        className="w-[32px] h-[54px] pixelated"
        alt="small green lamp"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
