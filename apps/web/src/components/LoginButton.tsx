"use client";

import { FC } from "react";
import { SignInButton } from "@clerk/nextjs";
import clsx from "clsx";

interface ButtonProps {
  name: string;
  className?: string;
}

const LoginButton: FC<ButtonProps> = ({ name, className = "" }) => {
  return (
    <SignInButton mode="modal">
      <div>
        <button
          className={clsx(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-md text-sm font-medium",
            "text-[var(--text-primary)] bg-[var(--bg-input)] hover:bg-[var(--bg-active)]",
            "transition-colors duration-100",
            "outline-none focus:outline-none",
            className
          )}
        >
          {name}
        </button>
      </div>
    </SignInButton>
  );
};

export default LoginButton;