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
import BookStack3 from "../../components/bookstack_3";
import BookStack2 from "../../components/bookstack_2";
import SofaSmall from "../../components/sofa_small";
import SofaBottom from "../../components/sofa_bottom";
import SmallCarpetV from "../../components/carpet_smallV";
import SingleRed from "../../components/single_red";
import SingleYellow from "../../components/single_yellow";
import TallRedLamp from "../../components/lamp_redL";
import Plant2 from "../../components/plant2";
import Plant3 from "../../components/plant3";
import Tree from "../../components/tree";
import XLTableV from "../../components/table_XLV";
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

const TILE_SIZE = 64;
const WALL_TILE = { w: 32, h: 96 };
const cols = Math.ceil(1400 / TILE_SIZE);
const rows = Math.ceil(900 / TILE_SIZE);

export default function Room() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-blue-100 overflow-hidden">
      <div
        className="relative bg-blue-200 border"
        style={{
          width: 1400,
          height: 900,
          transform: "scale(0.8)",
          transformOrigin: "center",
        }}
      >
        {/* ── Floor tiles ── */}
        {Array.from({ length: cols }).map((_, x) =>
          Array.from({ length: rows }).map((_, y) => (
            <img
              key={`${x}-${y}`}
              src="/assets/floor.png"
              className="absolute w-[65px] h-[65px] pixelated"
              style={{ left: x * TILE_SIZE, top: y * TILE_SIZE }}
              alt="floor"
            />
          ))
        )}

        {/* ── Back wall with windows ── */}
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

        {/* ── Sunlight shafts ── */}
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 270, top: 70, width: 220, height: 500, opacity: 0.7, background: "linear-gradient(to bottom, rgba(255,240,200,0.2), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 730, top: 70, width: 160, height: 420, opacity: 0.5, background: "linear-gradient(to bottom, rgba(255,240,200,0.18), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(6px)", zIndex: 1 }} />

        <h1 className="absolute top-2 left-2 z-10">Library</h1>

        <Tree x={470} y={50} />

        {/* ── BACK WALL ── */}
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

        {/* ── CORNER PLANTS ── */}
        <Plant x={0}    y={98} />
        <Plant x={1336} y={98} />

        {/* ── TOP-LEFT reading nook ── */}
        <Carpet     x={30}  y={170} />
        <Table      x={62}  y={204} />
        <BookStack1 x={80}  y={230} />
        <BookStack3 x={130} y={200} />

        {/* ── TOP-RIGHT reading nook ── */}
        <Carpet     x={300} y={170} />
        <Table      x={332} y={204} />
        <BookStack3 x={350} y={255} />
        <BookStack1 x={370} y={210} />

        {/* ── EXTRA TABLES ── */}
        <XLTableH x={1100} y={180} />
        <XLTableH x={1100} y={380} />

        <TopChair x={1140} y={140} />
        <TopChair x={1200} y={140} />
        <TopChair x={1260} y={140} />
        <TopChair x={1140} y={340} />
        <TopChair x={1200} y={340} />
        <TopChair x={1260} y={340} />

        {/* SmallGreenLamp + glow — warm green-white pool of light */}
        <Glow x={1225} y={210} size={140} color="rgba(180, 255, 160, 0.55)" opacity={.7} />
        <SmallGreenLamp x={1205} y={185} />

        <Glow x={1225} y={420} size={140} color="rgba(180, 255, 160, 0.55)" opacity={.7} />
        <SmallGreenLamp x={1205} y={385} />

        {/* ── MID-LEFT vertical tables + sofas ── */}
        <NarrowCarpetV x={70} y={550} />
        <NarrowTableV  x={80} y={550} />
        <SofaLeft      x={20} y={540} />

        <NarrowCarpetV x={70} y={400} />
        <NarrowTableV  x={80} y={400} />
        <SofaLeft      x={20} y={390} />

        {/* TallRedLamp + glow — warm amber pool */}
        <Glow x={45} y={500} size={160} color="rgba(255, 160, 60, 0.6)" opacity={1} />
        <TallRedLamp x={25} y={460} />

        <PurpleFlower x={25} y={360} />

        {/* ── BOTTOM RIGHT SOFA NOOK ── */}
        <Carpet     x={1150} y={700} />
        <SofaTop    x={1190} y={680} />
        <SofaLeft   x={1140} y={735} />
        <SofaSmall  x={1250} y={855} />
        <SmallTable x={1225} y={770} />
        <BookStack3 x={1230} y={760} />
        <MedShelf   x={1280} y={550} />
        <MedShelf   x={1150} y={550} />
        <MedShelf   x={1020} y={550} />
        <MedShelf   x={890}  y={550} />
        <Ladder     x={1320} y={565} />

        {/* TallRedLamp + glow — cosy nook warmth */}
        <Glow x={1168} y={690} size={180} color="rgba(255, 150, 60, 0.55)" opacity={1} />
        <TallRedLamp x={1150} y={650} />

        {/* TallRedLamp bottom-centre area */}
        <Glow x={870} y={810} size={160} color="rgba(255, 150, 60, 0.55)" opacity={1} />
        <TallRedLamp x={850} y={775} />

        <Plant  x={1190} y={835} />
        <Plant3 x={835}  y={565} />

        {/* ── BOTTOM-LEFT reading nook ── */}
        <Carpet     x={150} y={690} />
        <Table      x={180} y={724} />
        <BookStack1 x={185} y={725} />
        <BookStack2 x={250} y={760} />

        {/* ── Sofa + table combo ── */}
        <NarrowCarpetH x={900} y={810} />
        <NarrowTableH  x={902} y={800} />
        <BookStack1    x={940} y={798} />
        <SofaBottom    x={900} y={860} />
        <SofaTop       x={900} y={735} />

        {/* ── Single books as shelf-row dividers ── */}
        <SingleRed    x={450} y={590} />
        <SingleRed    x={450} y={690} />
        <SingleRed    x={450} y={790} />
        <SingleYellow x={640} y={590} />
        <SingleYellow x={640} y={690} />
        <SingleYellow x={640} y={790} />

        {/* ── Extra plant mid-left ── */}
        <Plant x={80} y={550} />
      </div>
    </div>
  );
}