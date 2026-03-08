"use client";

import { CrowdCanvas } from "../_components/skiper";
import { Highlighter } from "../_components/Highligher";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="text-center mt-32">
        <p className="leading-relaxed text-[var(--text-primary)]">
          At{" "}
          <Highlighter action="underline" color="#FF9800">
            Script Valley,
          </Highlighter>{" "}
          we only write{" "}
          <Highlighter action="highlight" color="#87CEFA">
            what truly matters
          </Highlighter>{" "}
          with purpose.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[85%] z-0 pointer-events-none">
        <CrowdCanvas src="/images/peeps/all-peep.png" rows={15} cols={7} />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
      </div>
    </section>
  );
}