import { AvatarType } from "./avatar_select";

type Facing = "left" | "right";

type Props = {
  x: number;
  y: number;
  frame: number;
  facing: Facing;
  isMoving: boolean;
  avatarType: AvatarType;
};

export default function Avatar({ x, y, frame, facing, isMoving, avatarType }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: avatarType.frameWidth,
        height: avatarType.frameHeight,
        transform: `
          translate(-50%, -50%)
          scale(2.5)
          scaleX(${facing === "left" ? -1 : 1})
        `,
        backgroundImage: `url('${avatarType.spritePath}')`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${frame * avatarType.frameWidth}px 0px`,
        imageRendering: "pixelated",
        zIndex: 7,
      }}
    />
  );
}