"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../packages/convex/convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSkeleton     from "./_components/ProfileSkeleton";
import ProfileIdentityCard from "./_components/ProfileIdentityCard";
import OverviewTab         from "./_components/OverviewTab";
import StatsTab            from "./_components/StatsTab";

type Tab = "overview" | "stats";

type Attempt = {
  attempted:  boolean;
  difficulty: string;
};

type LessonCountMap = Record<string, number>;

type SavedCourse = {
  courseSlug: string;
  savedAt:    number;
};

type StarredQuestion = {
  questionTitle: string;
};

type Experience = {
  _id: string;
};

type Snippet = {
  _id: string;
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [tab, setTab]      = useState<Tab>("overview");

  const userId = user?.id ?? "";
  const skip   = !isLoaded || !userId;

  const profile   = useQuery(api.users.getUser,                 skip ? "skip" : { userId });
  const socials   = useQuery(api.socials.getUserSocialLinks,    skip ? "skip" : { userId });
  const platforms = useQuery(api.platforms.getUserPlatformData, skip ? "skip" : { userId });

  const attempts     = useQuery(api.progress.getAllAttempts,            skip ? "skip" : { userId });
  const lessonCounts = useQuery(api.courses.getAllLessonProgressCounts,  skip ? "skip" : undefined);
  const savedCourses = useQuery(api.courses.getSavedCourses,            skip ? "skip" : undefined);
  const starredList  = useQuery(api.starred.getStarredByUser,           skip ? "skip" : { userId });
  const notesCount   = useQuery(api.notes.getNotesCount,                skip ? "skip" : { userId });
  const experiences  = useQuery(api.experiences.getUserExperiences,      skip ? "skip" : undefined);
  const snippets     = useQuery(api.snippets.getUserSnippets,            skip ? "skip" : undefined);

  if (!isLoaded || profile === undefined) return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-faint)]">Sign in to view your profile</p>
      </div>
    );
  }

  const attempted   = ((attempts ?? []) as Attempt[]).filter((a) => a.attempted);
  const totalSolved = attempted.length;
  const easySolved  = attempted.filter((a) => a.difficulty?.toLowerCase() === "easy").length;
  const medSolved   = attempted.filter((a) => a.difficulty?.toLowerCase() === "medium").length;
  const hardSolved  = attempted.filter((a) => a.difficulty?.toLowerCase() === "hard").length;

  const counts       = (lessonCounts ?? {}) as LessonCountMap;
  const totalLessons  = Object.values(counts).reduce((s, v) => s + v, 0);
  const coursesInProg = Object.values(counts).filter((v) => v > 0).length;
  const savedCount    = ((savedCourses ?? []) as SavedCourse[]).length;
  const starredCount  = ((starredList  ?? []) as StarredQuestion[]).length;
  const snippetCount  = ((snippets     ?? []) as Snippet[]).length;
  const expCount      = ((experiences  ?? []) as Experience[]).length;

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 mt-8 space-y-8">

        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">
            Account
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Profile</h1>
        </div>

        <ProfileIdentityCard
          user={{
            fullName:  user.fullName,
            imageUrl:  user.imageUrl,
            firstName: user.firstName,
            email:     user.primaryEmailAddress?.emailAddress ?? null,
          }}
          profile={profile ?? null}
          socials={socials ?? null}
          platforms={platforms ?? null}
        />

        <div className="flex gap-px p-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] w-fit">
          {(["overview", "stats"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-[var(--bg-active)] text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {t === "overview" ? "Overview" : "Activity Stats"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
          >
            {tab === "overview" ? (
              <OverviewTab
                totalSolved={totalSolved}
                easySolved={easySolved}
                medSolved={medSolved}
                hardSolved={hardSolved}
                totalLessons={totalLessons}
                coursesInProg={coursesInProg}
              />
            ) : (
              <StatsTab
                totalSolved={totalSolved}
                easySolved={easySolved}
                medSolved={medSolved}
                hardSolved={hardSolved}
                starredCount={starredCount}
                notesCount={notesCount ?? 0}
                totalLessons={totalLessons}
                coursesInProg={coursesInProg}
                savedCount={savedCount}
                snippetCount={snippetCount}
                expCount={expCount}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}