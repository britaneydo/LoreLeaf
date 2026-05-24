import { Z } from "@/lib/zIndex";

type Props = {
  x: number;
  y: number;
};

export default function Tree({ x, y }: Props) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: Z.tree,
      }}
    >
      <img
        src="/assets/Luminous_tree1.png"
        alt="tree"
        className="w-[500px] h-auto pixelated"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
