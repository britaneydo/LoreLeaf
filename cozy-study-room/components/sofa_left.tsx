import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function SofaLeft({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.sofa,
        pointerEvents: "none",
      }}
    >
      <img
        src="/assets/sofa_left.png"
        className="w-[50px] h-[128px] pixelated"
        alt="sofa"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
