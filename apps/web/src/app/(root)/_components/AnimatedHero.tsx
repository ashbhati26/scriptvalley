"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const scrollTriggerSettings = {
        trigger: ".sv-main",
        start: "top 25%",
        toggleActions: "play reverse play reverse",
      };

      const leftXValues  = [-800, -900, -400];
      const rightXValues = [ 800,  900,  400];
      const leftRotationValues  = [-30, -20, -35];
      const rightRotationValues = [ 30,  20,  35];
      const yValues = [100, -150, -400];

      gsap.utils.toArray<HTMLElement>(".sv-row").forEach((row, index) => {
        const cardLeft  = row.querySelector<HTMLElement>(".card-left");
        const cardRight = row.querySelector<HTMLElement>(".card-right");
        if (!cardLeft || !cardRight) return;

        ScrollTrigger.create({
          trigger: ".sv-main",
          start: "top center",
          end: "150% bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            cardLeft.style.transform  = `translateX(${p * leftXValues[index]}px) translateY(${p * yValues[index]}px) rotate(${p * leftRotationValues[index]}deg)`;
            cardRight.style.transform = `translateX(${p * rightXValues[index]}px) translateY(${p * yValues[index]}px) rotate(${p * rightRotationValues[index]}deg)`;
          },
        });
      });

      gsap.to(".sv-line p", {
        y: 0,
        duration: 0.5,
        ease: "power1.out",
        stagger: 0.1,
        scrollTrigger: scrollTriggerSettings,
      });

      gsap.to(".sv-btn", {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power1.out",
        delay: 0.25,
        scrollTrigger: scrollTriggerSettings,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section className="sv-main min-h-screen flex flex-col items-center justify-center text-center px-4 py-32 bg-[var(--bg-base)]">

        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-6">
          Script Valley
        </p>

        <div className="space-y-1 overflow-hidden mb-8">
          {[
            "Explore the tools that",
            "power Script Valley.",
            "Dive into the docs.",
          ].map((line) => (
            <div key={line} className="sv-line overflow-hidden">
              <p className="translate-y-10 text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--text-primary)] leading-tight">
                {line}
              </p>
            </div>
          ))}
        </div>

        <div className="sv-line overflow-hidden mb-10">
          <p className="translate-y-10 text-sm text-[var(--text-faint)] max-w-sm leading-relaxed">
            Understand the system. Master the flow. Everything documented in one place.
          </p>
        </div>

        <Link
          href="/docs"
          className="sv-btn translate-y-4 opacity-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-hover)] transition-colors duration-150"
        >
          Explore Docs
          <ArrowRight className="w-3.5 h-3.5 text-[#3A5EFF]" />
        </Link>

      </section>
    </div>
  );
}