type TableProps = {
  x: number;
  y: number;
};



export default function Tablelarge({ x, y }: TableProps) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        zIndex: 5
      }}
    >
      <img
        src="/assets/table_large.png"
        className="w-[96px] h-[96px] pixelated"
        alt="table"
      />
    </div>
  );
}