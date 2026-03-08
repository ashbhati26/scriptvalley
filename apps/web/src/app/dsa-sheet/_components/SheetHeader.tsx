interface Sheet {
  name: string;
  description?: string;
  note?: string[];
  credit?: {
    name: string;
    profile: string;
  };
}

export default function SheetHeader({ sheet }: { sheet: Sheet }) {
  return (
    <div className="mb-8 space-y-4">

      {/* Flat page header */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
          DSA Sheet
        </p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">{sheet.name}</h1>
        {sheet.description && (
          <p
            className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl"
            dangerouslySetInnerHTML={{ __html: sheet.description }}
          />
        )}
      </div>

      {/* Note block */}
      {sheet.note && sheet.note.length > 0 && (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
            <span className="text-[10px] uppercase tracking-widest text-red-400/70">Note</span>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {sheet.note.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-faint)]">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--text-disabled)] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credit */}
      {sheet.credit && (
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">
          Credit{" "}
          <a
            href={sheet.credit.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
          >
            {sheet.credit.name}
          </a>
        </p>
      )}
    </div>
  );
}