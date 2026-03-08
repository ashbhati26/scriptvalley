"use client";

import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { AnimatePresence, motion } from "framer-motion";
import { Code, ListVideo, Star } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LoaderTwo } from "@/components/ui/loader";
import ProfileOverview from "./_components/ProfileOverview";
import ExecutionCard from "./_components/ExecutionCard";
import StarredCard from "./_components/StarrdCard";
import StarButton from "@/components/StarButton";

const TABS = [
  { id: "executions" as const, label: "Executions", icon: ListVideo },
  { id: "starred"    as const, label: "Starred",    icon: Star      },
];

function Empty({
  icon: Icon,
  message,
  link,
}: {
  icon: React.ElementType;
  message: string;
  link: { href: string; label: string };
}) {
  return (
    <div className="py-12 flex flex-col items-center gap-3 text-center">
      <Icon className="w-7 h-7 text-[var(--bg-active)]" />
      <p className="text-sm text-[var(--text-faint)]">{message}</p>
      <Link href={link.href} className="text-xs text-[#3A5EFF] hover:text-[#4a6aff] transition-colors">
        {link.label}
      </Link>
    </div>
  );
}

function ProfileContent() {
  const { user, isLoaded } = useUser();
  const [tab, setTab] = useState<"executions" | "starred">("executions");

  const userStats       = useQuery(api.codeExecutions.getUserStats,    { userId: user?.id ?? "" });
  const userData        = useQuery(api.users.getUser,                  { userId: user?.id ?? "" });
  const starredSnippets = useQuery(api.snippets.getStarredSnippets);
  const { results: executions, status, isLoading, loadMore } = usePaginatedQuery(
    api.codeExecutions.getUserExecutions,
    { userId: user?.id ?? "" },
    { initialNumItems: 5 },
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] w-full pt-16 pb-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        {/* Page header */}
        <div className="mt-8 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Playground</p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Profile</h1>
        </div>
        <div className="border-t border-[var(--border-subtle)] mb-6" />

        <ProfileOverview
          userStats={userStats}
          userData={userData}
          user={user ?? null}
          isReady={!!(userStats && userData && isLoaded)}
          starredCount={starredSnippets?.length ?? 0}
          executions={executions as Parameters<typeof ProfileOverview>[0]["executions"]}
        />

        {/* Tabs */}
        <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
          <div className="flex gap-px px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-input)]">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-colors duration-100 ${
                    active
                      ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="profileTab"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#3A5EFF] rounded-r-full"
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-[#3A5EFF]" : "text-[var(--text-faint)]"}`} />
                  {label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="p-4 bg-[var(--bg-base)] space-y-4"
            >
              {tab === "executions" && (
                isLoading ? (
                  <div className="py-12 flex justify-center"><LoaderTwo /></div>
                ) : executions.length === 0 ? (
                  <Empty icon={Code} message="No executions yet" link={{ href: "/", label: "Open playground →" }} />
                ) : (
                  <>
                    {executions.map((ex) => (
                      <ExecutionCard
                        key={ex._id}
                        execution={ex as Parameters<typeof ExecutionCard>[0]["execution"]}
                      />
                    ))}
                    {status === "CanLoadMore" && (
                      <div className="flex justify-center">
                        <button
                          onClick={() => loadMore(5)}
                          className="px-4 py-2 rounded-md text-xs text-[var(--text-faint)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-subtle)] transition-colors"
                        >
                          Load more
                        </button>
                      </div>
                    )}
                  </>
                )
              )}

              {tab === "starred" && (
                !starredSnippets ? (
                  <div className="py-12 flex justify-center"><LoaderTwo /></div>
                ) : starredSnippets.length === 0 ? (
                  <Empty icon={Star} message="No starred snippets" link={{ href: "/snippets", label: "Explore snippets →" }} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {starredSnippets.map((s) => (
                      <StarredCard
                        key={s._id}
                        snippet={s as Parameters<typeof StarredCard>[0]["snippet"]}
                        starButton={<StarButton snippetId={s._id} />}
                      />
                    ))}
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}