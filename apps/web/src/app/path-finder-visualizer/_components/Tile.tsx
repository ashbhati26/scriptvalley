import { twMerge } from "tailwind-merge";
import {
  END_TILE_STYLE, PATH_TILE_STYLE, START_TILE_STYLE,
  TILE_STYLE, TRAVERSED_TILE_STYLE, WALL_TILE_STYLE,
} from "../utils/constants";

interface MouseFunction { (row: number, col: number): void; }

export function Tile({
  row, col, isStart, isEnd, isTraversed, isWall, isPath,
  handleMouseDown, handleMouseEnter, handleMouseUp,
}: {
  row: number; col: number;
  isStart: boolean; isEnd: boolean; isTraversed: boolean; isWall: boolean; isPath: boolean;
  handleMouseDown: MouseFunction; handleMouseEnter: MouseFunction; handleMouseUp: MouseFunction;
}) {
  let tileTypeStyle;
  if (isStart)          { tileTypeStyle = START_TILE_STYLE;     }
  else if (isEnd)       { tileTypeStyle = END_TILE_STYLE;       }
  else if (isWall)      { tileTypeStyle = WALL_TILE_STYLE;      }
  else if (isPath)      { tileTypeStyle = PATH_TILE_STYLE;      }
  else if (isTraversed) { tileTypeStyle = TRAVERSED_TILE_STYLE; }
  else                  { tileTypeStyle = TILE_STYLE;           }

  return (
    <div
      id={`${row}-${col}`}
      className={twMerge(
        tileTypeStyle,
        "border border-[var(--border-subtle)] transition-colors duration-75",
        isStart     && "bg-[#3A5EFF] border-[#3A5EFF]/80",
        isEnd       && "bg-red-500/80 border-red-500/60",
        isWall      && "bg-[#555] border-[#444]",
        isPath      && "bg-amber-400/80 border-amber-400/60",
        isTraversed && "bg-[#3A5EFF]/20 border-[#3A5EFF]/10",
        !isStart && !isEnd && !isWall && !isPath && !isTraversed &&
          "bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] cursor-crosshair"
      )}
      onMouseDown={() => handleMouseDown(row, col)}
      onMouseUp={() => handleMouseUp(row, col)}
      onMouseEnter={() => handleMouseEnter(row, col)}
    />
  );
}