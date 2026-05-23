import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Ladder({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.ladder,
      }}
    >
      <img
        src="/assets/lamp_redL.png"
        className="w-[40px] h-[84px] pixelated"
        alt="ladder"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
