"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { useInView } from "framer-motion";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

export function Highlighter({
  children,
  action = "underline",
  color = "#3A5EFF",
  strokeWidth = 1.5,
  animationDuration = 500,
  iterations = 1,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef    = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);

  const isInView = useInView(elementRef, { once: true, margin: "-10%" });
  const shouldShow = !isView || isInView;

  useEffect(() => {
    if (!shouldShow) return;
    const element = elementRef.current;
    if (!element) return;

    const annotation = annotate(element, {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    });

    annotationRef.current = annotation;
    annotation.show();

    const observer = new ResizeObserver(() => {
      annotation.hide();
      annotation.show();
    });
    observer.observe(element);
    observer.observe(document.body);

    return () => {
      annotate(element, { type: action }).remove();
      observer.disconnect();
    };
  }, [shouldShow, action, color, strokeWidth, animationDuration, iterations, padding, multiline]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent text-[var(--text-primary)]">
      {children}
    </span>
  );
}