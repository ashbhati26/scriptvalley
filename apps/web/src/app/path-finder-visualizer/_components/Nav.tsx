import { MutableRefObject, useState } from "react";
import { usePathfinding } from "../hooks/usePathfinding";
import { useTile } from "../hooks/useTile";
import {
  EXTENDED_SLEEP_TIME, MAZES, PathFINDING_ALGORITHMS,
  SLEEP_TIME, SPEEDS,
} from "../utils/constants";
import { resetGrid } from "../utils/resetGrid";
import { AlgorithmType, MazeType, SpeedType } from "../utils/types";
import { runMazeAlgorithm } from "../utils/runMazeAlgorithm";
import { useSpeed } from "../hooks/useSpeed";
import { PlayButton } from "./PlayButton";
import { runPathFindingAlgorithm } from "../utils/runPathFindingAlgorithm";
import { animatePath } from "../utils/animatePath";
import { CustomDropdown } from "./CustomDropdown";

export function Nav({
  isVisulaizationRunningRef,
}: {
  isVisulaizationRunningRef: MutableRefObject<boolean>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const {
    maze, setMaze, grid, setGrid,
    isGraphVisualized, setIsGraphVisualized,
    algorithm, setAlgorithm,
  } = usePathfinding();
  const { startTile, endTile } = useTile();
  const { speed, setSpeed } = useSpeed();

  const handleGenerateMaze = (maze: MazeType) => {
    if (maze === "NONE") {
      setMaze(maze);
      resetGrid({ grid, startTile, endTile });
      return;
    }
    setMaze(maze);
    setIsDisabled(true);
    runMazeAlgorithm({ maze, grid, startTile, endTile, setIsDisabled, speed });
    const newGrid = grid.slice();
    setGrid(newGrid);
    setIsGraphVisualized(false);
  };

  const handleRunVisualizer = () => {
    if (isGraphVisualized) {
      setIsGraphVisualized(false);
      resetGrid({ grid: grid.slice(), startTile, endTile });
      return;
    }
    const { traversedTiles, path } = runPathFindingAlgorithm({ algorithm, grid, startTile, endTile });
    animatePath(traversedTiles, path, startTile, endTile, speed);
    setIsDisabled(true);
    isVisulaizationRunningRef.current = true;
    setTimeout(() => {
      const newGrid = grid.slice();
      setGrid(newGrid);
      setIsGraphVisualized(true);
      setIsDisabled(false);
      isVisulaizationRunningRef.current = false;
    },
      SLEEP_TIME * (traversedTiles.length + SLEEP_TIME * 2) +
      EXTENDED_SLEEP_TIME * (path.length + 60) *
      SPEEDS.find((s) => s.value === speed)!.value
    );
  };

  return (
    <div className="flex items-center justify-center w-full px-4 py-4 mt-12">
      <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg max-w-4xl px-5 py-4 w-full flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4">

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end pb-0.5">
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">Visualizer</p>
            <p className="text-xs font-medium text-[var(--text-secondary)] leading-tight">Pathfinding</p>
          </div>
        </div>

        <div className="w-px h-8 bg-[var(--border-subtle)] shrink-0 hidden sm:block" />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 flex-1">
          <CustomDropdown label="Maze"      value={maze}      options={MAZES}                   onChange={(e) => handleGenerateMaze(e as MazeType)}                       isDisabled={isDisabled} />
          <CustomDropdown label="Algorithm" value={algorithm} options={PathFINDING_ALGORITHMS}  onChange={(e) => setAlgorithm(e as AlgorithmType)}                        isDisabled={isDisabled} />
          <CustomDropdown label="Speed"     value={speed}     options={SPEEDS}                  onChange={(e) => setSpeed(parseInt(e.toString()) as SpeedType)}           isDisabled={isDisabled} />
        </div>

        <div className="w-px h-8 bg-[var(--border-subtle)] shrink-0 hidden sm:block" />

        <div className="shrink-0 self-end">
          <PlayButton
            isDisabled={isDisabled}
            isGraphVisualized={isGraphVisualized}
            handleRunVisualizer={handleRunVisualizer}
          />
        </div>
      </div>
    </div>
  );
}