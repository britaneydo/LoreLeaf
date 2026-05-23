import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function SofaTop({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.sofa,
      }}
    >
      <img
        src="/assets/sofa_bottom.png"
        className="w-[124px] h-[52px] pixelated"
        alt="sofa"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
