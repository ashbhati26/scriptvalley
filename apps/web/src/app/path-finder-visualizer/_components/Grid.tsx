import { twMerge } from "tailwind-merge";
import { usePathfinding } from "../hooks/usePathfinding";
import { MAX_COLS, MAX_ROWS } from "../utils/constants";
import { Tile } from "./Tile";
import { MutableRefObject, useState } from "react";
import { checkIfStartOrEnd, createNewGrid } from "../utils/helpers";

export function Grid({
  isVisulaizationRunningRef,
}: {
  isVisulaizationRunningRef: MutableRefObject<boolean>;
}) {
  const { grid, setGrid } = usePathfinding();
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (row: number, col: number) => {
    if (isVisulaizationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(true);
    const newGrid = createNewGrid(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = (row: number, col: number) => {
    if (isVisulaizationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    setIsMouseDown(false);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isVisulaizationRunningRef.current || checkIfStartOrEnd(row, col)) return;
    if (isMouseDown) {
      const newGrid = createNewGrid(grid, row, col);
      setGrid(newGrid);
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-4 pb-6">
      <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg w-full max-w-5xl overflow-auto p-4">

        <div className="flex flex-wrap items-center gap-4 mb-4 px-1">
          {[
            { color: "bg-[#3A5EFF]",       label: "Start"   },
            { color: "bg-red-500",          label: "End"     },
            { color: "bg-[#555]",           label: "Wall"    },
            { color: "bg-[#3A5EFF]/30",     label: "Visited" },
            { color: "bg-amber-400",        label: "Path"    },
            { color: "bg-[var(--bg-hover)] border border-[var(--border-medium)]", label: "Empty" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${color}`} />
              <span className="text-[10px] text-[var(--text-disabled)] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        <div
          className={twMerge(
            "flex flex-col items-center justify-center",
            `lg:min-h-[${MAX_ROWS * 12}px] md:min-h-[${MAX_ROWS * 12}px] xs:min-h-[${MAX_ROWS * 8}px] min-h-[${MAX_ROWS * 7}px]`,
            `lg:w-[${MAX_COLS * 17}px] md:w-[${MAX_COLS * 15}px] xs:w-[${MAX_COLS * 8}px] w-[${MAX_COLS * 7}px]`
          )}
        >
          {grid.map((r, rowIndex) => (
            <div key={rowIndex} className="flex">
              {r.map((tile, tileIndex) => {
                const { row, col, isStart, isEnd, isPath, isTraversed, isWall } = tile;
                return (
                  <Tile
                    key={tileIndex}
                    row={row}
                    col={col}
                    isEnd={isEnd}
                    isStart={isStart}
                    isPath={isPath}
                    isTraversed={isTraversed}
                    isWall={isWall}
                    handleMouseDown={() => handleMouseDown(row, col)}
                    handleMouseUp={() => handleMouseUp(row, col)}
                    handleMouseEnter={() => handleMouseEnter(row, col)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}