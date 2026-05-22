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

// Rendered sizes (2× natural px):
//   shelf_large 186×102  shelf_medium 122×114  clock 44×118  ladder 64×102  plant 64×64
//   carpet_large 184×190  carpet_narrow 124×56  carpet_narrow2 56×124
//   table_large 120×122  table_horizontal 120×60  table_vertical 56×122  table_small 56×60
//   sofa_top 124×62  sofa_left 50×128
//   bookstack_1 62×42  bookstack_3 48×40

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
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 270, top: 70, width: 220, height: 500, opacity: 0.7, background: "linear-gradient(to bottom, rgba(255,240,200,0.18), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(8px)", zIndex: 1 }} />
        <div className="absolute pointer-events-none animate-pulse" style={{ left: 730, top: 70, width: 160, height: 420, opacity: 0.5, background: "linear-gradient(to bottom, rgba(255,240,200,0.15), rgba(255,255,200,0))", transform: "skewX(-20deg)", filter: "blur(8px)", zIndex: 1 }} />

        <h1 className="absolute top-2 left-2 z-10">Library</h1>

        <Tree x={470}   y={50} />

        {/* ── BACK WALL: LargeShelf LargeShelf [ladder] MedShelf [clock] MedShelf [ladder] LargeShelf LargeShelf ── */}
        <LargeShelf x={10}   y={20} />
        <LargeShelf x={198}  y={20} />
        <Ladder     x={80}  y={25} />
        <Clock      x={678}  y={15} />
        <Ladder     x={1100}  y={25} />
        <LargeShelf x={1016} y={20} />
        <LargeShelf x={1204} y={20} />

        {/* ── CORNER PLANTS just below wall ── */}
        <Plant x={0}    y={98} />
        <Plant x={1336} y={98} />

        {/* ── TOP-LEFT reading nook: carpet 184×190, table 120×122 centred inside ── */}
        <Carpet     x={30}   y={170} />
        <Table      x={62}  y={204} />
        <BookStack1 x={80}  y={230} />
        <BookStack3 x={130} y={200} />

        {/* ── TOP-RIGHT reading nook (mirror) ── */}
        <Carpet     x={1190} y={170} />
        <Table      x={1223} y={204} />
        <BookStack3 x={1240} y={250} />
        <BookStack1 x={1250} y={200} />

        {/* ── MID-RIGHT: mirror ── */}
        <NarrowCarpetH x={1246} y={390} />
        <NarrowTableH  x={1248} y={390} />
        <BookStack3    x={1264} y={366} />

        {/* ── MID-LEFT: narrow vertical table further down the wall ── */}
        <NarrowCarpetV x={70}  y={530} />
        <NarrowTableV  x={80}  y={530} />
        <SofaLeft   x={20} y={520} />

        <NarrowCarpetV x={70}  y={380} />
        <NarrowTableV  x={80}  y={380} />
        <SofaLeft   x={20} y={370} />

        <TallRedLamp x={25} y={440} />


        {/* ── BOTTOM RIGHT SOFA NOOK ── */}
        <Carpet     x={1150} y={700} />
        <SofaTop    x={1190} y={680} />
        <SofaLeft   x={1140} y={735} />
        <SofaSmall   x={1250} y={855} />
        <SmallTable x={1225} y={770} />
        <BookStack3 x={1230} y={760} />
        <MedShelf x={1280} y={550} />
        <MedShelf x={1150} y={550} />
        <MedShelf x={1020} y={550} />
        <MedShelf x={890} y={550} />
        <Ladder x={1320} y={565} />
        <TallRedLamp x={1150} y={650} />
        <Plant x={1190}    y={835} />
        <Plant3 x={835}    y={565} />


        {/* ── BOTTOM-LEFT reading nook ── */}
        <Carpet     x={30}   y={690} />
        <Table      x={60}  y={724} />
        <BookStack1 x={65}  y={725} />
        <BookStack2 x={130} y={760} />


        {/* ── sofa n table combo near reading nook ── */}
        <NarrowCarpetH x={900} y={810} />
        <NarrowTableH  x={902} y={800} />
        <BookStack1    x={940} y={798} />
        <SofaBottom x={900} y={860} />
        <SofaTop x={900} y={735} />

        <SingleRed  x={430} y={540} />
        <SingleRed  x={430} y={640} />
        <SingleRed  x={430} y={740} />
        <SingleRed  x={430} y={840} />


        <SingleYellow  x={620} y={540} />
        <SingleYellow  x={620} y={640} />
        <SingleYellow  x={620} y={740} />
        <SingleYellow  x={620} y={840} />

        {/* ── EXTRA PLANTS mid-sides for warmth ── */}
        <Plant x={80}    y={500} />
      </div>
    </div>
  );
}