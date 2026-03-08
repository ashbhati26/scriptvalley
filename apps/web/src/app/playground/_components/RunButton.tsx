"use client";

import { FC } from "react";
import { stagger, useAnimate } from "framer-motion";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  name: string;
  className?: string;
}

const RunButton: FC<ButtonProps> = ({ className = "" }) => {
  const [scope, animate] = useAnimate();

  const onMouseEnter = () => {
    animate(".letter", { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
  };

  const onMouseLeave = () => {
    animate(".letter", { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
  };

  return (
    <div ref={scope} className="flex justify-center items-center">
      <button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled
        className={clsx(
          "relative flex items-center justify-center gap-1.5 overflow-hidden",
          "rounded-md text-xs font-medium",
          "text-white bg-gray-500",
          "opacity-60 cursor-not-allowed",
          className
        )}
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />

        <span className="h-8 overflow-hidden flex items-center justify-center">
          {"Work in Progress".split("").map((letter, index) => (
            <span
              className="letter-wrapper relative h-8 flex items-center justify-center"
              key={`${letter}-${index}`}
            >
              <span className="letter">
                {letter === " " ? "\u00A0" : letter}
              </span>
              <span className="absolute left-0 top-full w-full h-full flex items-center justify-center duplicate">
                {letter === " " ? "\u00A0" : letter}
              </span>
            </span>
          ))}
        </span>
      </button>
    </div>
  );
};

export default RunButton;