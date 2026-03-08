"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ListOrdered } from "lucide-react";
import { DOCS, DOC_GROUPS, type DocSection } from "./data/docs";

import FaqSection    from "./_components/FaqSection";
import ContactForm   from "./_components/ContactForm";
import FeedbackForm  from "./_components/FeedbackForm";
import PrivacyPolicy from "./_components/PrivacyPolicy";
import TermsOfService from "./_components/TermsOfService";

const CUSTOM_COMPONENTS: Record<string, React.ComponentType> = {
  faq:      FaqSection,
  contact:  ContactForm,
  feedback: FeedbackForm,
  privacy:  PrivacyPolicy,
  terms:    TermsOfService,
};

function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="flex flex-col gap-px">
      {DOC_GROUPS.map((group, gi) => (
        <div key={group.label} className={gi > 0 ? "mt-3" : ""}>
          <p className="text-[9px] uppercase tracking-widest text-[var(--text-disabled)] px-3 mb-1 mt-1">
            {group.label}
          </p>
          {group.ids.map((id) => {
            const section = DOCS.find((s) => s.id === id);
            if (!section) return null;
            const { label, icon: Icon } = section;
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`relative flex items-center gap-2.5 px-3 py-[7px] rounded-md text-sm text-left w-full transition-colors duration-100 ${
                  isActive
                    ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                    : "text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="docNav"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#3A5EFF] rounded-r-full"
                  />
                )}
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-[#3A5EFF]" : "text-[var(--text-disabled)]"
                  }`}
                />
                <span className="truncate text-xs">{label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function SectionContent({ section }: { section: DocSection }) {
  const { content } = section;

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">

      <div className="px-6 py-5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)]">
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
          {content.eyebrow}
        </p>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">{content.title}</h2>
        <p className="mt-2 text-sm text-[var(--text-faint)] leading-relaxed max-w-2xl">
          {content.intro}
        </p>
      </div>

      <div className="divide-y divide-[var(--border-hairline,var(--border-subtle))]">

        <div className="px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">What it does</p>
          <p className="text-sm text-[var(--text-muted)] leading-[1.8]">{content.whatItDoes}</p>
        </div>

        {content.items.length > 0 && (
          <div className="px-6 py-5">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">Key features</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border-subtle)] rounded-lg overflow-hidden border border-[var(--border-subtle)]">
              {content.items.map(({ heading, body }) => (
                <div key={heading} className="flex gap-3 px-4 py-3.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-[#3A5EFF] shrink-0 mt-[3px]" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[var(--text-secondary)] mb-0.5">{heading}</p>
                    <p className="text-xs text-[var(--text-faint)] leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <ListOrdered className="w-3.5 h-3.5 text-[var(--text-disabled)]" />
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)]">How to use it</p>
          </div>
          <ol className="flex flex-col gap-2">
            {content.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-md bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-disabled)] flex items-center justify-center shrink-0 mt-[1px]">
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="px-6 py-5 bg-[var(--bg-base)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">Why it matters</p>
          <p className="text-sm text-[var(--text-faint)] leading-[1.8] max-w-2xl">{content.whyItMatters}</p>
        </div>

        <div className="px-6 py-5">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">Highlights</p>
          <ul className="flex flex-col gap-2">
            {content.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3A5EFF] shrink-0 mt-[2px]" />
                <p className="text-sm text-[var(--text-muted)]">{h}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DocsInner() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(() => {
    const section = searchParams.get("section");
    return DOCS.find((s) => s.id === section) ? section! : "overview";
  });
  const section = DOCS.find((s) => s.id === active) ?? DOCS[0];
  const CustomComponent = CUSTOM_COMPONENTS[active];

  useEffect(() => {
    const param = searchParams.get("section");
    if (param && DOCS.find((s) => s.id === param)) {
      setActive(param);
    }
  }, [searchParams]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-5 items-start">

        <aside className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-2 sticky top-20">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] px-3 pt-1 pb-2">
            Sections
          </p>
          <Sidebar active={active} onSelect={setActive} />
        </aside>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
          >
            {CustomComponent ? (
              <CustomComponent />
            ) : (
              <SectionContent section={section} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function DocsFallback() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-5">
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-64 animate-pulse" />
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] h-64 animate-pulse" />
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] w-full pt-16 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="mt-8 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Script Valley</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Documentation</h1>
          <p className="mt-1.5 text-sm text-[var(--text-disabled)]">
            Everything you need to know about the platform.
          </p>
        </div>
        <div className="border-t border-[var(--border-subtle)] mb-6" />
      </div>

      <Suspense fallback={<DocsFallback />}>
        <DocsInner />
      </Suspense>
    </div>
  );
}