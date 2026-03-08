"use client";

import { AnimationArrayType, SortingAlgorithmType } from "../lib/types";
import {
  MAX_ANIMATION_SPEED,
  generateRandomNumberFromInterval,
} from "../lib/utils";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// Define the context type to manage sorting algorithm state
interface SortingAlgorithmContextType {
  arrayToSort: number[];
  selectedAlgorithm: SortingAlgorithmType;
  isSorting: boolean;
  setSelectedAlgorithm: (algorithm: SortingAlgorithmType) => void;
  setIsSorting: (isSorting: boolean) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  resetArrayAndAnimation: () => void;
  runAnimation: (animations: AnimationArrayType) => void;
  isAnimationComplete: boolean;
  requiresReset: boolean;
}

// Create the context with an undefined default value
const SortingAlgorithmContext = createContext<
  SortingAlgorithmContextType | undefined
>(undefined);

// Provider component to manage sorting state and functions
export const SortingAlgorithmProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // State to manage sorting array and settings
  const [arrayToSort, setArrayToSort] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<SortingAlgorithmType>("bubble"); // Default algorithm is bubble sort
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isAnimationComplete, setIsAnimationComplete] =
    useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] =
    useState<number>(MAX_ANIMATION_SPEED);
  const requiresReset = isAnimationComplete || isSorting;

  // Effect to reset array on mount and when the window resizes
  useEffect(() => {
    resetArrayAndAnimation();
    window.addEventListener("resize", resetArrayAndAnimation);

    return () => {
      window.removeEventListener("resize", resetArrayAndAnimation);
    };
  }, []);

  // Function to generate a new array and reset animation states
  const resetArrayAndAnimation = () => {
    const contentContainer = document.getElementById("content-container");
    console.log("Reset function called");
    if (!contentContainer) return;
    const contentContainerWidth = contentContainer.clientWidth;

    const tempArray: number[] = [];
    const numLines = contentContainerWidth / 8; // Number of bars based on container width
    const containerHeight = window.innerHeight;
    const maxLineHeight = Math.max(containerHeight - 420, 100);
    
    // Generate random heights for bars
    for (let i = 0; i < numLines; i++) {
      tempArray.push(generateRandomNumberFromInterval(35, maxLineHeight));
    }

    setArrayToSort(tempArray);
    console.log("Array after reset:", tempArray.length, tempArray);
    setIsSorting(false);
    setIsAnimationComplete(false);

    // Clear all existing timeouts to avoid unwanted animations
    const highestId = window.setTimeout(() => {
      for (let i = highestId; i >= 0; i--) {
        window.clearInterval(i);
      }
    }, 0);

    // Reset bar colors
    setTimeout(() => {
      const arrLines = document.getElementsByClassName("array-line");
      for (let i = 0; i < arrLines.length; i++) {
        arrLines[i].classList.remove("change-line-color");
        arrLines[i].classList.add("default-line-color");
      }
    }, 0);
  };


  // Function to animate sorting process
  const runAnimation = (animations: AnimationArrayType) => {
    setIsSorting(true);

    const inverseSpeed = (1 / animationSpeed) * 200;
    const arrLines = document.getElementsByClassName(
      "array-line"
    ) as HTMLCollectionOf<HTMLElement>;

    // Helper function to update bar classes
    const updateClassList = (
      indexes: number[],
      addClassName: string,
      removeClassName: string
    ) => {
      indexes.forEach((index) => {
        arrLines[index].classList.add(addClassName);
        arrLines[index].classList.remove(removeClassName);
      });
    };

    // Helper function to update bar height
    const updateHeightValue = (
      lineIndex: number,
      newHeight: number | undefined
    ) => {
      arrLines[lineIndex].style.height = `${newHeight}px`;
    };

    // Loop through animations and apply changes
    animations.forEach((animation, index) => {
      setTimeout(() => {
        const [lineIndexes, isSwap] = animation;
        if (!isSwap) {
          updateClassList(
            lineIndexes,
            "change-line-color",
            "default-line-color"
          );
          setTimeout(
            () =>
              updateClassList(
                lineIndexes,
                "default-line-color",
                "change-line-color"
              ),
            inverseSpeed
          );
        } else {
          const [lineIndex, newHeight] = lineIndexes;
          updateHeightValue(lineIndex, newHeight);
        }
      }, index * inverseSpeed);
    });

    // Final animation sequence after sorting completes
    const finalTimeout = animations.length * inverseSpeed;
    setTimeout(() => {
      Array.from(arrLines).forEach((line) => {
        line.classList.add("pulse-animation", "change-line-color");
        line.classList.remove("default-line-color");
      });

      setTimeout(() => {
        Array.from(arrLines).forEach((line) => {
          line.classList.remove("pulse-animation", "change-line-color");
          line.classList.add("default-line-color");
        });
        setIsSorting(false);
        setIsAnimationComplete(true);
      }, 1000);
    }, finalTimeout);
  };

  // Context value to be provided to child components
  const value = {
    arrayToSort,
    selectedAlgorithm,
    setSelectedAlgorithm,
    isSorting,
    setIsSorting,
    animationSpeed,
    setAnimationSpeed,
    isAnimationComplete,
    resetArrayAndAnimation,
    runAnimation,
    requiresReset,
  };

  return (
    <SortingAlgorithmContext.Provider value={value}>
      {children}
    </SortingAlgorithmContext.Provider>
  );
};

// Custom hook to use the sorting algorithm context
export const useSortingAlgorithmContext = (): SortingAlgorithmContextType => {
  const context = useContext(SortingAlgorithmContext);
  if (context === undefined) {
    throw new Error(
      "useSortingAlgorithmContext must be used within a SortingAlgorithmProvider"
    );
  }
  return context;
};
