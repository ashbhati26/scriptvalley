import { ChangeEvent } from "react";

export function Select({
  value, onChange, options, label, isDisabled,
}: {
  value: string | number;
  label: string;
  onChange: (value: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; name: string }[];
  isDisabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]"
        htmlFor={label}
      >
        {label}
      </label>
      <div className="relative">
        <select
          disabled={isDisabled}
          id={label}
          value={value}
          onChange={onChange}
          className="w-full min-w-[140px] h-8 appearance-none
            bg-[var(--bg-input)] hover:bg-[var(--bg-active)]
            border border-transparent
            text-[var(--text-secondary)] text-xs rounded-md px-3 pr-8
            outline-none cursor-pointer
            transition-colors duration-100
            disabled:opacity-30 disabled:pointer-events-none"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
            >
              {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
          <svg className="w-3 h-3 text-[var(--text-faint)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}