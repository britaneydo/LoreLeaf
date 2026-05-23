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

const WALL_TILE = { w: 32, h: 96 };

const SUN_RAYS = [
  { left: 200, skew: -18, w: 90,  opacity: 0.55, delay: "0s"   },
  { left: 270, skew: -22, w: 50,  opacity: 0.35, delay: "0.8s" },
  { left: 660, skew: -18, w: 100, opacity: 0.45, delay: "0.4s" },
  { left: 740, skew: -22, w: 45,  opacity: 0.30, delay: "1.2s" },
  { left: 1120,skew: -18, w: 80,  opacity: 0.40, delay: "0.6s" },
];

export default function Room() {
  const scale = useRoomScale();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-stone-900 overflow-hidden">
      <div
        className="relative"
        style={{
          width: 1400,
          height: 900,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
      >
        {/* Floor */}
        <div
          className="absolute"
          style={{
            top: 96,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/assets/floor.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "64px 64px",
            imageRendering: "pixelated",
          }}
        />

        {/* Back wall with windows */}
        <div className="absolute overflow-hidden" style={{ left: 0, top: 0, width: 1400, height: WALL_TILE.h }}>
          {Array.from({ length: Math.ceil(1400 / WALL_TILE.w) }).map((_, i) => {
            const isWindow = i % 5 === 2;
            return (
              <div
                key={`wall-${i}`}
                className="absolute"
                style={{ left: i * WALL_TILE.w, top: 0, width: WALL_TILE.w, height: WALL_TILE.h }}
              >
                <img src="/assets/wall.png" className="absolute w-[32px] h-[96px] pixelated" />
                {isWindow && (
                  <img
                    src="/assets/window_narrow2.png"
                    className="absolute pixelated"
                    style={{ top: 18, width: 32, height: 54 }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Sunlight */}
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 270, top: 70, width: 220, height: 500, opacity: 0.7, background: "linear-gradient(to bottom, rgba(255,240,200,0.25), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 730, top: 70, width: 160, height: 420, opacity: 0.5, background: "linear-gradient(to bottom, rgba(255,240,200,0.2), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />

        {/* Middle Tree */}
        <Tree x={470} y={50} />

        {/* BACK WALL */}
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
        <SmallTable x={760}  y={75} />
        <BookStack2 x={592}  y={70} />
        <BookStack3 x={765}  y={70} />
        <OrangeFlower x={410} y={80} />

        {/* CORNER PLANTS */}
        <Plant x={0}    y={98} />
        <Plant x={1336} y={98} />

        {/* TOP-LEFT reading nook */}
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

        {/* ── EXTRA TABLES ── */}
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

        {/* SmallGreenLamp + glow */}
        <Glow x={1225} y={210} size={140} color="rgba(180, 255, 160, 0.55)" opacity={0.5} />
        <SmallGreenLamp x={1205} y={185} />

        <Glow x={1025} y={410} size={140} color="rgba(180, 255, 160, 0.55)" opacity={0.5} />
        <SmallGreenLamp x={1005} y={385} />

        {/* MID-LEFT vertical tables + sofas */}
        <NarrowCarpetV x={70} y={530} />
        <NarrowTableV  x={80} y={530} />
        <SofaLeft      x={20} y={520} />

        <NarrowCarpetV x={70} y={380} />
        <NarrowTableV  x={80} y={380} />
        <SofaLeft      x={20} y={370} />

        {/* TallRedLamp + glow */}
        <Glow x={45} y={480} size={160} color="rgba(255, 160, 60, 0.6)" opacity={0.5} />
        <TallRedLamp x={25} y={440} />

        <PurpleFlower x={90} y={360} />
        <BookStack2   x={90} y={420} />

        {/* BOTTOM RIGHT SOFA NOOK */}
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

        {/* TallRedLamp + glow */}
        <Glow x={1168} y={660} size={180} color="rgba(255, 150, 60, 0.55)" opacity={0.5} />
        <TallRedLamp x={1150} y={620} />

        {/* TallRedLamp bottom-center area */}
        <Glow x={870} y={750} size={160} color="rgba(255, 150, 60, 0.55)" opacity={0.48} />
        <TallRedLamp x={850} y={715} />

        <Plant  x={1190} y={805} />
        <Plant3 x={835}  y={535} />

        {/* BOTTOM-LEFT reading nook */}
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

        {/* Sofa + table combo */}
        <NarrowCarpetH x={900} y={750} />
        <NarrowTableH  x={902} y={740} />
        <BookStack1    x={940} y={738} />
        <SofaBottom    x={900} y={800} />
        <SofaTop       x={900} y={675} />

        {/* Single tables */}
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

        {/* Random Books */}
        <BookStack2 x={415} y={715} />
        <BookStack3 x={560} y={810} />
        <BookStack4 x={910} y={130} />

      </div>
    </div>
  );
}