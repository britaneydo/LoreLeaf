"use client";

export type AvatarType = {
  id: string;
  name: string;
  spritePath: string;
  frameWidth: number;
  frameHeight: number;
};

export const AVATAR_OPTIONS: AvatarType[] = [
  { id: "knight",          name: "Knight",   spritePath: "/assets/walking_animations/knightWalk.png",        frameWidth: 22, frameHeight: 18 },
  { id: "archer",          name: "Archer",   spritePath: "/assets/walking_animations/archerWalk.png",        frameWidth: 17, frameHeight: 15 },
  { id: "zombie",          name: "Zombie",   spritePath: "/assets/walking_animations/zombieWalk.png",        frameWidth: 14, frameHeight: 17 },
  { id: "infantry",        name: "Infantry", spritePath: "/assets/walking_animations/infantryWalk.png",      frameWidth: 18, frameHeight: 15 },
  { id: "mage",            name: "Mage",     spritePath: "/assets/walking_animations/mageWalk.png",          frameWidth: 20, frameHeight: 19 },
  { id: "spearman",        name: "Spearman", spritePath: "/assets/walking_animations/spearmanWalk.png",      frameWidth: 18, frameHeight: 17 },
  { id: "ninja",           name: "Ninja",    spritePath: "/assets/walking_animations/ninjaWalk.png",         frameWidth: 14, frameHeight: 16 },
  { id: "samurai",         name: "Samurai",  spritePath: "/assets/walking_animations/samuraiWalk.png",       frameWidth: 22, frameHeight: 18 },
  { id: "skelly",          name: "Skelly A", spritePath: "/assets/walking_animations/skeletonWalk.png",      frameWidth: 17, frameHeight: 15 },
  { id: "skelly infantry", name: "Skelly B", spritePath: "/assets/walking_animations/skellyInfantryWalk.png",frameWidth: 19, frameHeight: 15 },
  { id: "skelly knight",   name: "Skelly C", spritePath: "/assets/walking_animations/skellyKnightWalk.png",  frameWidth: 21, frameHeight: 17 },
  { id: "skelly mage",     name: "Skelly D", spritePath: "/assets/walking_animations/skellyMageWalk.png",    frameWidth: 19, frameHeight: 19 },
  { id: "skelly spearman", name: "Skelly E", spritePath: "/assets/walking_animations/skellySpearmanWalk.png",frameWidth: 18, frameHeight: 15 },
  { id: "snowman",         name: "Snowman",  spritePath: "/assets/walking_animations/snowmanWalk.png",       frameWidth: 14, frameHeight: 15 },
  { id: "viking",          name: "Viking",   spritePath: "/assets/walking_animations/vikingWalk.png",        frameWidth: 21, frameHeight: 16 },
];

const SPRITE_SCALE = 3;
// How much to inset the character grid from the frame edges (in px at display size)
const FRAME_INSET = 32;

type Props = {
  onSelect: (avatar: AvatarType) => void;
};

export default function AvatarSelect({ onSelect }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(20, 14, 8, 0.80)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Title above the panel */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "monospace",
          color: "#f5e6c8",
          fontSize: 18,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          margin: "0 0 4px",
        }}>
          Choose Your Character
        </h1>
        <p style={{
          fontFamily: "monospace",
          color: "#a89070",
          fontSize: 11,
          letterSpacing: "0.1em",
          margin: 0,
        }}>
          Select who you'd like to be in the library
        </p>
      </div>

      {/* Single panel — pixel frame as background, characters inside */}
      <div
        style={{
          position: "relative",
          // The frame image tiles/stretches — we use it as a CSS background so it
          // can grow to fit whatever width the grid needs
          backgroundImage: "url('/assets/UI_Frame.png')",
          backgroundSize: "100% 100%",    // stretch to fill the panel
          imageRendering: "pixelated",
          padding: FRAME_INSET,
          display: "inline-block",
          // Max width so it doesn't go edge-to-edge on wide screens
          maxWidth: "90vw",
        }}
      >
        {/* Character grid inside the frame */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            justifyContent: "center",
            // Constrain so the frame stays a reasonable proportion
            maxWidth: 500,
          }}
        >
          {AVATAR_OPTIONS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => onSelect(avatar)}
              className="avatar-btn"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              {/* Fixed-size box so all avatars occupy identical space regardless of frame size */}
              <div
                style={{
                  position: "relative",
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                }}
              >
                <div
                  className="avatar-sprite"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: avatar.frameWidth,
                    height: avatar.frameHeight,
                    backgroundImage: `url('${avatar.spritePath}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0px 0px",
                    imageRendering: "pixelated",
                    transform: `translate(-50%, -50%) scale(${SPRITE_SCALE})`,
                    transformOrigin: "center",
                    transition: "filter 0.1s ease",
                  }}
                />
              </div>
              {/* Name */}
              <span style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#000000",
              }}>
                {avatar.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .avatar-btn:hover .avatar-sprite {
          filter: brightness(1.4) drop-shadow(0 0 3px rgba(255,220,120,0.8));
        }
        .avatar-btn:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
}