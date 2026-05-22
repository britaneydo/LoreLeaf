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
        src="/assets/sofa_small.png"
        className="w-[60px] h-[50px] pixelated"
        alt="sofa"
      />
    </div>
  );
}
