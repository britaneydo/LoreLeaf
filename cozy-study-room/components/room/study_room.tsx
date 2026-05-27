"use client";

import { useRoomScale } from "../../hooks/useRoomScale";
import Table from "../../components/table_large";
import NarrowTableH from "../../components/table_horizontal";
import NarrowTableV from "../../components/table_vertical";
import SmallTable from "../../components/table_small";
import Plant from "../../components/plant";
import Carpet from "../../components/carpet_large";
import NarrowCarpetH from "../../components/carpet_narrow";
import NarrowCarpetV from "../../components/carpet_narrow2";
import LargeShelf from "../../components/shelf_large";
import MedShelf from "../../components/shelf_medium";
import Clock from "../../components/clock";
import Ladder from "../../components/ladder";
import SofaTop from "../../components/sofa_top";
import SofaLeft from "../../components/sofa_left";
import BookStack1 from "../../components/bookstack_1";
import BookStack2 from "../../components/bookstack_2";
import BookStack3 from "../../components/bookstack_3";
import BookStack4 from "../../components/bookstack_4";
import BookStack5 from "../../components/bookstack_5";
import BookStack6 from "../../components/bookstack_6";
import SofaSmall from "../../components/sofa_small";
import SofaBottom from "../../components/sofa_bottom";
import SingleRed from "../../components/single_red";
import SingleYellow from "../../components/single_yellow";
import TallRedLamp from "../../components/lamp_redL";
import Plant3 from "../../components/plant3";
import Tree from "../../components/tree";
import XLTableH from "../../components/table_XLH";
import Globe from "../../components/globe";
import SmallGreenLamp from "../../components/lamp_greenS";
import OrangeFlower from "../../components/orangeflower";
import PurpleFlower from "../../components/purpleflower";
import TopChair from "../../components/chair_top";
import BottomChair from "../../components/chair_bottom";
import LeftChair from "../../components/chair_left";
import RightChair from "../../components/chair_right";
import Glow from "../../components/glow";
import { useRef, useState, useEffect, useCallback } from "react";
import Avatar from "../avatar/avatar";
import AvatarSelect, { AvatarType } from "../avatar/avatar_select";
import Cat from "../cat/cat";
import { useTreeCounter } from "../../lib/useTreeCounter";
import { SEATS } from "../../lib/roomLayout";
import { isBlocked, OBSTACLES } from "../../lib/collisions";
import { findPath } from "../../lib/pathfinding";
import { TomatoButton } from "../PomodoroOverlay";

const WALL_TILE = { w: 32, h: 96 };
const SPEED = 2.5;

function SeatHitZone({
  seat,
  onGo,
  highlight,
}: {
  seat: typeof SEATS[0];
  onGo: (seat: typeof SEATS[0]) => void;
  highlight: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const glowVisible = highlight || hovered;
  return (
    <div
      className="absolute"
      style={{
        left: seat.sitX,
        top: seat.sitY,
        width: 48,
        height: 48,
        zIndex: 999,
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
      }}
      onClick={() => onGo(seat)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: glowVisible
            ? "radial-gradient(circle, rgba(255,200,80,0.6) 0%, rgba(255,150,30,0.3) 50%, transparent 75%)"
            : "transparent",
          transition: "background 0.15s ease",
          animation: highlight && !hovered ? "seatPulse 1.8s ease-in-out infinite" : "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function StudyRoom() {
  const scale = useRoomScale();
  const { stage: treeStage, addPoints } = useTreeCounter();

  const [avatarType, setAvatarType] = useState<AvatarType | null>(null);
  const [hasChosenSeat, setHasChosenSeat] = useState(false);
  const [playerX, setPlayerX] = useState(700);
  const [playerY, setPlayerY] = useState(500);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [isMoving, setIsMoving] = useState(false);
  const [frame, setFrame] = useState(0);

  const pathRef = useRef<{ x: number; y: number }[]>([]);
  const playerXRef = useRef(700);
  const playerYRef = useRef(500);
  const selectedSeatRef = useRef<typeof SEATS[0] | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation frames
  useEffect(() => {
    if (!isMoving) { setFrame(0); return; }
    const anim = setInterval(() => setFrame((f) => (f + 1) % 4), 120);
    return () => clearInterval(anim);
  }, [isMoving]);

  // Single movement interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const path = pathRef.current;
      if (path.length === 0) return;

      const target = path[0];
      const curX = playerXRef.current;
      const curY = playerYRef.current;

      const dx = target.x - curX;
      const dy = target.y - curY;

      if (Math.abs(dx) < SPEED && Math.abs(dy) < SPEED) {
        const newPath = path.slice(1);
        pathRef.current = newPath;

        if (newPath.length === 0) {
          playerXRef.current = target.x;
          playerYRef.current = target.y;
          setPlayerX(target.x);
          setPlayerY(target.y);
          setIsMoving(false);
          setFrame(0);
          const seat = selectedSeatRef.current;
          if (seat) setFacing(seat.facing);
        }
        return;
      }

      const stepX = Math.sign(dx) * Math.min(SPEED, Math.abs(dx));
      const stepY = Math.sign(dy) * Math.min(SPEED, Math.abs(dy));
      const nextX = curX + stepX;
      const nextY = curY + stepY;

      if (Math.abs(dx) > 0.5) setFacing(dx > 0 ? "right" : "left");

      const isFinalStep = path.length === 1;
      const resolvedX = (!isFinalStep && isBlocked(nextX, curY)) ? curX : nextX;
      const resolvedY = (!isFinalStep && isBlocked(curX, nextY)) ? curY : nextY;

      playerXRef.current = resolvedX;
      playerYRef.current = resolvedY;
      setPlayerX(resolvedX);
      setPlayerY(resolvedY);
    }, 16);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goToSeat = useCallback((seat: typeof SEATS[0]) => {
    selectedSeatRef.current = seat;
    const newPath = findPath(
      playerXRef.current, playerYRef.current,
      seat.sitX, seat.sitY
    );
    pathRef.current = newPath;
    setIsMoving(newPath.length > 0);
    setHasChosenSeat(true);
  }, []);

  const roomContent = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1c1917",
        overflow: "hidden",
      }}
    >
      <div
        className="relative"
        style={{
          width: 1400,
          height: 900,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* FLOOR */}
        <div className="absolute" style={{
          top: 96, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/assets/floor.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "64px 64px",
          imageRendering: "pixelated",
        }} />

        {/* SEAT HIT ZONES REMOVE COMMENT FOR DEBUGGING PURPOSES! makesseats glow upon hover + user can move seats
        {avatarType && SEATS.map((seat) => (
          <SeatHitZone key={seat.id} seat={seat} onGo={goToSeat} highlight={!hasChosenSeat} />
        ))} */}

        {/* SEAT HIT ZONES; only glow in the beginning */}
        {avatarType && !hasChosenSeat && SEATS.map((seat) => (
          <SeatHitZone key={seat.id} seat={seat} onGo={goToSeat} highlight={true} />
        ))}

        {/* Back wall with windows */}
        <div className="absolute overflow-hidden" style={{ left: 0, top: 0, width: 1400, height: WALL_TILE.h }}>
          {Array.from({ length: Math.ceil(1400 / WALL_TILE.w) }).map((_, i) => {
            const isWindow = i % 5 === 2;
            return (
              <div key={`wall-${i}`} className="absolute"
                style={{ left: i * WALL_TILE.w, top: 0, width: WALL_TILE.w, height: WALL_TILE.h }}>
                <img src="/assets/wall.png" className="absolute w-[32px] h-[96px] pixelated" />
                {isWindow && <img src="/assets/window_narrow2.png" className="absolute pixelated" style={{ top: 18, width: 32, height: 54 }} />}
              </div>
            );
          })}
        </div>

        {/* Sunlight */}
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 270, top: 70, width: 220, height: 500, opacity: 0.7, background: "linear-gradient(to bottom, rgba(255,240,200,0.25), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 730, top: 70, width: 160, height: 420, opacity: 0.5, background: "linear-gradient(to bottom, rgba(255,240,200,0.2), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />

        {/* TREE */}
        <Tree stage={treeStage} x={700} y={380} />

          {/* back wall */}
            <LargeShelf x={10}   y={20} />
            <LargeShelf x={198}  y={20} />
            <Ladder     x={80}   y={25} />
            <Clock      x={678}  y={15} />
            <Ladder     x={1100} y={25} />
            <LargeShelf x={1016} y={20} />
            <LargeShelf x={1204} y={20} />
            <Globe      x={960}  y={65} />
            <SofaTop    x={820}  y={70} />
            <SofaTop    x={450}  y={70} />
            <NarrowCarpetH x={820} y={100} />
            <NarrowCarpetH x={450} y={100} />
            <SmallTable x={580}  y={75} />
            <BookStack2 x={592}  y={70} />
            <SmallTable x={757}  y={75} />
            <BookStack5 x={757}  y={70} />
            <OrangeFlower x={410} y={80} />

            {/* corner plants */}
            <Plant x={0}    y={98} />
            <Plant x={1336} y={98} />

            {/* top-left reading nook */}
            <Carpet     x={30}  y={170} />
            <Table      x={62}  y={204} />
            <BookStack1 x={80}  y={230} />
            <BookStack3 x={130} y={200} />

            <LeftChair  x={20}  y={200} />
            <LeftChair  x={20}  y={260} />
            <RightChair x={190} y={200} />
            <RightChair x={190} y={260} />

            <Carpet     x={300} y={170} />
            <Table      x={332} y={204} />
            <BookStack3 x={350} y={255} />
            <BookStack1 x={370} y={210} />

            <TopChair    x={340} y={155} />
            <TopChair    x={410} y={155} />
            <BottomChair x={340} y={330} />
            <BottomChair x={410} y={330} />

          {/* extra tables */}
            <XLTableH x={1100} y={180} />
            <XLTableH x={900}  y={380} />

            <TopChair x={1130} y={140} />
            <TopChair x={1200} y={140} />
            <TopChair x={1270} y={140} />
            <TopChair x={930}  y={340} />
            <TopChair x={1000} y={340} />
            <TopChair x={1070} y={340} />

            <BottomChair x={1130} y={300} />
            <BottomChair x={1200} y={300} />
            <BottomChair x={1270} y={300} />
            <BottomChair x={930}  y={500} />
            <BottomChair x={1000} y={500} />
            <BottomChair x={1070} y={500} />

            <BookStack4 x={1050} y={420} />
            <BookStack5 x={930}  y={390} />
            <BookStack6 x={1150} y={200} />
            <BookStack3 x={1250} y={180} />
            <BookStack2 x={1280} y={230} />

            <Glow x={1225} y={210} size={140} color="rgba(180, 255, 160, 0.55)" opacity={0.5} />
            <SmallGreenLamp x={1205} y={185} />
            <Glow x={1025} y={410} size={140} color="rgba(180, 255, 160, 0.55)" opacity={0.5} />
            <SmallGreenLamp x={1005} y={385} />

          {/* mid-left vertical tables + sofas*/}
            <NarrowCarpetV x={70} y={530} />
            <NarrowTableV  x={80} y={530} />
            <SofaLeft      x={20} y={520} />
            <NarrowCarpetV x={70} y={380} />
            <NarrowTableV  x={80} y={380} />
            <SofaLeft      x={20} y={370} />

            <Glow x={45} y={480} size={160} color="rgba(255, 160, 60, 0.6)" opacity={0.5} />
            <TallRedLamp x={25} y={440} />

            <PurpleFlower x={90} y={360} />
            <BookStack2   x={90} y={420} />

          {/* bottom right sofa nook */}
            <Carpet     x={1150} y={670} />
            <SofaTop    x={1190} y={650} />
            <SofaLeft   x={1140} y={705} />
            <SofaSmall  x={1250} y={825} />
            <SmallTable x={1225} y={740} />
            <BookStack3 x={1230} y={730} />
            <MedShelf   x={1280} y={520} />
            <MedShelf   x={1150} y={520} />
            <MedShelf   x={1020} y={520} />
            <MedShelf   x={890}  y={520} />
            <Ladder     x={1320} y={535} />

            <Glow x={1168} y={660} size={180} color="rgba(255, 150, 60, 0.55)" opacity={0.5} />
            <TallRedLamp x={1150} y={620} />

            <Glow x={870} y={750} size={160} color="rgba(255, 150, 60, 0.55)" opacity={0.48} />
            <TallRedLamp x={850} y={715} />

            <Plant  x={1190} y={805} />
            <Plant3 x={835}  y={535} />

          {/* bottom left table */}
            <Carpet     x={150} y={660} />
            <Table      x={180} y={694} />
            <BookStack1 x={185} y={695} />
            <BookStack2 x={250} y={730} />

            <TopChair    x={190} y={645} />
            <TopChair    x={250} y={645} />
            <BottomChair x={190} y={820} />
            <BottomChair x={250} y={820} />
            <LeftChair   x={130} y={700} />
            <LeftChair   x={130} y={750} />
            <RightChair  x={310} y={700} />
            <RightChair  x={310} y={750} />

          {/* sofa + table combo */}
            <NarrowCarpetH x={900} y={750} />
            <NarrowTableH  x={902} y={740} />
            <BookStack1    x={940} y={738} />
            <SofaBottom    x={900} y={800} />
            <SofaTop       x={900} y={675} />

          {/* single tables */}
            <SingleRed    x={450} y={560} />
            <SingleRed    x={450} y={660} />
            <SingleRed    x={450} y={760} />
            <SingleYellow x={640} y={560} />
            <SingleYellow x={640} y={660} />
            <SingleYellow x={640} y={760} />
            <NarrowCarpetH x={440} y={610} />
            <NarrowCarpetH x={630} y={610} />
            <NarrowCarpetH x={440} y={710} />
            <NarrowCarpetH x={630} y={710} />
            <NarrowCarpetH x={440} y={810} />
            <NarrowCarpetH x={630} y={810} />

          {/* random books */}
            <BookStack2 x={415} y={715} />
            <BookStack3 x={560} y={810} />
            <BookStack4 x={910} y={130} />

        {/* COLLISION DEBUG — remove when done
        {OBSTACLES.map((o, i) => (
          <div key={`obs-${i}`} className="absolute pointer-events-none"
            style={{ left: o.x, top: o.y, width: o.w, height: o.h,
                     background: "rgba(255,0,0,0.15)", border: "1px solid red", zIndex: 998 }} />
        ))} */}

        {/* CAT — always wandering */}
        <Cat />

        {/* Avatar — only shown when selected */}
        {avatarType && (
          <Avatar
            x={playerX}
            y={playerY}
            frame={frame}
            facing={facing}
            isMoving={isMoving}
            avatarType={avatarType}
          />
        )}
        {/* FIND A SEAT PROMPT */}
        {avatarType && (
          <div
            style={{
              position: "absolute",
              top: 530,
              left: 700,
              transform: "translateX(-50%)",
              zIndex: 998,
              pointerEvents: "none",
              opacity: hasChosenSeat ? 0 : 1,
              transition: "opacity 0.6s ease",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#f0d8a8",
              textShadow: "0 0 12px rgba(255,180,60,0.8), 0 2px 4px rgba(0,0,0,0.8)",
              animation: "seatPromptBob 2s ease-in-out infinite",
            }}>
              ✦ find a seat ✦
            </div>
          </div>
        )}
        <style>{`
          @keyframes seatPromptBob {
            0%, 100% { transform: translateY(0px); }
            50%       { transform: translateY(-5px); }
          }
          @keyframes seatPulse {
            0%, 100% { opacity: 0.5; transform: scale(1);   }
            50%       { opacity: 1;   transform: scale(1.2); }
          }
        `}</style>

       <TomatoButton addPoints={addPoints} />

      </div>
    </div>
  );

  return (
    <>
      {roomContent}
      {!avatarType && (
        <AvatarSelect onSelect={(a) => setAvatarType(a)} />
      )}
    </>
  );
}