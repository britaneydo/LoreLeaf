import Table from "../../components/table_large";
import NarrowTable from "../../components/table_vertical";
import Tree from "../../components/tree";
import Carpet from "../../components/carpet";
import LargeShelf from "../../components/shelf_large";
import SmallShelf from "../../components/shelf_small";

const TILE_SIZE = 64;

const cols = Math.ceil(1400 / TILE_SIZE);
const rows = Math.ceil(900 / TILE_SIZE);

const WALL_TILE = { w: 32, h: 96 };
const WINDOW_TILE = { w: 30, h: 54 };


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
  

        {Array.from({ length: cols }).map((_, x) =>
            Array.from({ length: rows }).map((_, y) => (
                <img
                    key={`${x}-${y}`}
                    src="/assets/floor.png"
                    className="absolute w-[65px] h-[65px] pixelated"
                    style={{
                        left: x * TILE_SIZE,
                        top: y * TILE_SIZE,
                    }}
                    alt="floor"
                />
            ))
        )}

        {Array.from({ length: Math.ceil(1400 / WALL_TILE.w) }).map((_, i) => {
            const isWindow = i % 5 === 2;

            return (
                <div
                key={`back-${i}`}
                className="absolute"
                style={{
                    left: i * WALL_TILE.w,
                    top: 0,
                    width: WALL_TILE.w,
                    height: WALL_TILE.h,
                }}
                >
                {/* base wall */}
                <img
                    src="/assets/wall.png"
                    className="absolute w-[32px] h-[96px] pixelated"
                />

                {/* window overlay */}
                {isWindow && (
                    <img
                    src="/assets/window_narrow2.png"
                    className="absolute pixelated"
                    style={{
                        top: 18, // adjust vertical placement inside wall
                        width: 32,
                        height: 54,
                    }}
                    />
                )}
                </div>
            );
            })}

            {/* SUNLIGHT */}
                <div
                className="absolute pointer-events-none animate-pulse"
                style={{
                    left: 270,
                    top: 70,
                    width: 220,
                    height: 500,
                    opacity: 0.7,
                    background:
                    "linear-gradient(to bottom, rgba(255, 240, 200, 0.18), rgba(255,255,200,0))",
                    transform: "skewX(-20deg)",
                    filter: "blur(8px)",
                    zIndex: 1,
                }}
                />

        <h1 className="absolute top-2 left-2 z-10">
          Library
        </h1>

        <Tree />

        <Carpet x={73} y={143} />
        <Table x={90} y={150} />

        <Carpet x={1203} y={143} />
        <Table x={1220} y={150} />

        <Carpet x={73} y={743} />
        <Table x={90} y={750} />

        <Carpet x={1203} y={743} />
        <Table x={1220} y={750} />

        <NarrowTable x={110} y={340} />
        <NarrowTable x={110} y={530} />


        <LargeShelf x={10} y={25} />
        <LargeShelf x={170} y={25} />
        <LargeShelf x={1250} y={25} />
        <LargeShelf x={1090} y={25} />

        <SmallShelf x={1045} y={45} />
        <SmallShelf x={1003} y={45} />
        

        

      </div>
    </div>
  );
}