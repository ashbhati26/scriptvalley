import { MAX_ANIMATION_SPEED, MIN_ANIMATION_SPEED } from "../lib/utils";

export const Slider = ({
  min = MIN_ANIMATION_SPEED,
  max = MAX_ANIMATION_SPEED,
  step = 10,
  value,
  handleChange,
  isDisabled = false,
}: {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-3 w-full min-w-[160px]">
      <span className="text-[10px] text-[var(--text-disabled)] shrink-0 uppercase tracking-wider">Slow</span>

      <div className="relative flex-1 flex items-center h-4">
        <div className="absolute w-full h-[2px] rounded-full bg-[var(--border-subtle)]" />
        <div
          className="absolute h-[2px] rounded-full transition-all pointer-events-none"
          style={{ width: `${pct}%`, background: "rgba(58, 94, 255, 0.4)" }}
        />
        <input
          disabled={isDisabled}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="relative w-full appearance-none bg-transparent cursor-pointer
            disabled:cursor-not-allowed disabled:opacity-30
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[var(--text-primary)]
            [&::-webkit-slider-thumb]:border-0
            [&::-webkit-slider-thumb]:shadow-none
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[var(--text-primary)]
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
          "
        />
      </div>

      <span className="text-[10px] text-[var(--text-disabled)] shrink-0 uppercase tracking-wider">Fast</span>
    </div>
  );
};