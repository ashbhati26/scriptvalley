"use client";

import { FC } from "react";
import { stagger, useAnimate } from "framer-motion";

interface ButtonProps {
  name: string;
}

const Button: FC<ButtonProps> = ({ name }) => {
  const [scope, animate] = useAnimate();

  const onMouseEnter = () => {
    animate(".letter",    { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: -32 }, { duration: 0.18, delay: stagger(0.04) });
  };

  const onMouseLeave = () => {
    animate(".letter",    { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
    animate(".duplicate", { y: 0 }, { duration: 0.18, delay: stagger(0.04) });
  };

  return (
    <div ref={scope} className="flex justify-center items-center">
      <button
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="flex items-center gap-2 rounded-md px-4 h-8 text-xs font-medium
          text-[var(--text-muted)] hover:text-[var(--text-primary)]
          bg-transparent hover:bg-[var(--bg-hover)]
          transition-colors duration-100
          disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <span className="sr-only">{name}</span>
        <span className="h-8 overflow-hidden flex items-center justify-center" aria-hidden="true">
          {name.split("").map((letter, index) => (
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

export default Button;