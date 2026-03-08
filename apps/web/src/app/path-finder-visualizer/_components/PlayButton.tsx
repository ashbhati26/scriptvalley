"use client";

import { MouseEventHandler } from "react";
import { stagger, useAnimate } from "framer-motion";

interface PlayButtonProps {
  isDisabled: boolean;
  isGraphVisualized: boolean;
  handleRunVisualizer: MouseEventHandler<HTMLButtonElement>;
}

export function PlayButton({ handleRunVisualizer, isDisabled, isGraphVisualized }: PlayButtonProps) {
  const [scope, animate] = useAnimate();

  const onMouseEnter = () => {
    animate(".letter",    { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
  };

  const onMouseLeave = () => {
    animate(".letter",    { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
  };

  const label = isGraphVisualized ? "Reset" : "Play";

  return (
    <div ref={scope} className="flex justify-center items-center">
      <button
        disabled={isDisabled}
        onClick={handleRunVisualizer}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex items-center gap-1.5 h-8 px-4 rounded-md text-xs font-medium
          text-[var(--text-muted)] hover:text-[var(--text-primary)]
          bg-transparent hover:bg-[var(--bg-hover)]
          transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="sr-only">{label}</span>
        <span className="h-8 overflow-hidden flex items-center justify-center" aria-hidden="true">
          {label.split("").map((letter, index) => (
            <span className="relative h-8 flex items-center justify-center" key={`${letter}-${index}`}>
              <span className="letter">{letter === " " ? "\u00A0" : letter}</span>
              <span className="absolute left-0 top-full w-full h-full flex items-center justify-center duplicate">
                {letter === " " ? "\u00A0" : letter}
              </span>
            </span>
          ))}
        </span>
      </button>
    </div>
  );
}