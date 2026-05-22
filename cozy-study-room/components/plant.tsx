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
        src="/assets/plant.png"
        className="w-[64px] h-[64px] pixelated"
        alt="plant"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
