import Table from "../../components/table_large";
import Tree from "../../components/tree";
import Carpet from "../../components/carpet";

const TILE_SIZE = 64;

const cols = Math.ceil(1400 / TILE_SIZE);
const rows = Math.ceil(900 / TILE_SIZE);
const WALL_TILE_WIDTH = 32;
const WALL_TILE_HEIGHT = 96;


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
                    className="absolute w-[64px] h-[64px] pixelated"
                    style={{
                        left: x * TILE_SIZE,
                        top: y * TILE_SIZE,
                    }}
                    alt="floor"
                />
            ))
        )}

        {Array.from({ length: Math.ceil(1400 / WALL_TILE_WIDTH) }).map((_, i) => (
            <img
                key={`back-${i}`}
                src="/assets/wall.png"
                className="absolute pixelated"
                style={{
                    left: i * WALL_TILE_WIDTH,
                    top: 0,
                    width: 32,
                    height: 96,
                    }}
                alt="wall-top"
                />
            ))}

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
        

        

      </div>
    </div>
  );
}