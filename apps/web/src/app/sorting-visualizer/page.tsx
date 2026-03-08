"use client";

import Button from "./_components/Button";
import { Select } from "./_components/Select";
import { Slider } from "./_components/Slider";
import { useSortingAlgorithmContext } from "./context/Visulizer";
import { SortingAlgorithmType } from "./lib/types";
import { algorithmOptions, generateAnimationArray } from "./lib/utils";

export default function Home() {
  const {
    arrayToSort,
    isSorting,
    setAnimationSpeed,
    animationSpeed,
    selectedAlgorithm,
    setSelectedAlgorithm,
    requiresReset,
    resetArrayAndAnimation,
    runAnimation,
  } = useSortingAlgorithmContext();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAlgorithm(e.target.value as SortingAlgorithmType);
  };

  const handlePlay = () => {
    if (requiresReset) { resetArrayAndAnimation(); return; }
    generateAnimationArray(selectedAlgorithm, isSorting, arrayToSort, runAnimation);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-base)]">
      <main className="flex flex-col items-center justify-start w-full px-4 py-6 mt-16">
        <div className="w-full max-w-[1020px]">

          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-0.5">Visualizer</p>
            <h1 className="text-sm font-medium text-[var(--text-primary)]">Sorting Algorithms</h1>
          </div>

          <div id="content-container" className="flex flex-col w-full">

            <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-5 py-3.5 mb-3 flex flex-wrap items-center gap-5">

              <div className="flex-1 min-w-[180px]">
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">Speed</p>
                <Slider
                  isDisabled={isSorting}
                  value={animationSpeed}
                  handleChange={(e) => setAnimationSpeed(Number(e.target.value))}
                />
              </div>

              <div className="w-px h-8 bg-[var(--border-subtle)] shrink-0 hidden sm:block" />

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2">Algorithm</p>
                <Select
                  options={algorithmOptions}
                  defaultValue={selectedAlgorithm}
                  onChange={handleSelectChange}
                  isDisabled={isSorting}
                />
              </div>

              <div className="w-px h-8 bg-[var(--border-subtle)] shrink-0 hidden sm:block" />

              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-2 select-none">Action</p>
                <div onClick={handlePlay}>
                  <Button name={requiresReset ? "Reset" : "Play"} />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg overflow-hidden">
              <div className="relative h-[300px]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-t border-[var(--border-subtle)] pointer-events-none"
                    style={{ bottom: `${(i + 1) * 25}%` }}
                  />
                ))}
                <div className="absolute bottom-0 w-full left-0 right-0 flex justify-center items-end">
                  {arrayToSort.map((value, index) => (
                    <div
                      key={index}
                      className="array-line relative w-1 mx-[1px] rounded-t-sm default-line-color"
                      style={{ height: `${value}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="px-5 py-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-disabled)] uppercase tracking-widest">
                  {arrayToSort.length} elements
                </span>
                <span className="text-[10px] text-[var(--text-disabled)] uppercase tracking-widest">
                  {algorithmOptions.find((o) => o.value === selectedAlgorithm)?.label}
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}