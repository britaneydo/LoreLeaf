import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Plant({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.plant,
      }}
    >
      <img
        src="/assets/plant2.png"
        className="w-[36px] h-[78px] pixelated"
        alt="plant"
      />
    </div>
  );
}
