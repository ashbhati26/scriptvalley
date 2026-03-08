"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-1.5"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8, transition: { delay: idx * 0.04 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] border border-[var(--border-subtle)] transition-colors duration-100"
                >
                  <div className="h-4 w-4 text-[var(--text-muted)]">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] border border-[var(--border-subtle)] transition-colors duration-100"
      >
        <IconLayoutNavbarCollapse className="h-4 w-4 text-[var(--text-muted)]" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseX = useMotionValue<number>(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-14 items-end gap-3 rounded-xl px-4 pb-2.5 md:flex border border-[var(--border-subtle)] bg-[var(--bg-base)]/90 backdrop-blur-md",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue<number>;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform      = useTransform(distance, [-150, 0, 150], [36, 72, 36]);
  const heightTransform     = useTransform(distance, [-150, 0, 150], [36, 72, 36]);
  const widthTransformIcon  = useTransform(distance, [-150, 0, 150], [16, 34, 16]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [16, 34, 16]);

  const width      = useSpring(widthTransform,      { mass: 0.1, stiffness: 150, damping: 12 });
  const height     = useSpring(heightTransform,     { mass: 0.1, stiffness: 150, damping: 12 });
  const widthIcon  = useSpring(widthTransformIcon,  { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] border border-[var(--border-subtle)] transition-colors duration-100"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 4, x: "-50%" }}
              transition={{ duration: 0.1 }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-[var(--border-medium)] bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] whitespace-pre text-[var(--text-secondary)] pointer-events-none"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-[var(--text-muted)]"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}