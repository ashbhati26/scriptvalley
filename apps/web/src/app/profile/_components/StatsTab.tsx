"use client";

import {
  CheckSquare, BookOpen, BookMarked, Star,
  FileText, Briefcase, Code2, Layers,
} from "lucide-react";
import StatCard from "./StatCard";

interface Props {
  // DSA
  totalSolved:   number;
  easySolved:    number;
  medSolved:     number;
  hardSolved:    number;
  starredCount:  number;
  notesCount:    number;
  // Courses
  totalLessons:  number;
  coursesInProg: number;
  savedCount:    number;
  // Contributions
  snippetCount:  number;
  expCount:      number;
}

export default function StatsTab({
  totalSolved, easySolved, medSolved, hardSolved,
  starredCount, notesCount,
  totalLessons, coursesInProg, savedCount,
  snippetCount, expCount,
}: Props) {
  return (
    <div className="space-y-8">

      {/* DSA Practice */}
      <section>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          DSA Practice
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Total Solved"
            value={totalSolved}
            sub={`E:${easySolved}  M:${medSolved}  H:${hardSolved}`}
            icon={CheckSquare}
            color="#22c55e"
            delay={0}
          />
          <StatCard
            label="Starred"
            value={starredCount}
            sub="questions starred"
            icon={Star}
            color="#f59e0b"
            delay={0.04}
          />
          <StatCard
            label="Notes"
            value={notesCount}
            sub="questions with notes"
            icon={FileText}
            color="#3A5EFF"
            delay={0.08}
          />
        </div>
      </section>

      {/* Courses */}
      <section>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          Courses
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Lessons Done"
            value={totalLessons}
            sub="total completed"
            icon={BookOpen}
            color="#3A5EFF"
            delay={0}
          />
          <StatCard
            label="In Progress"
            value={coursesInProg}
            sub="courses started"
            icon={Layers}
            color="#8b5cf6"
            delay={0.04}
          />
          <StatCard
            label="Saved"
            value={savedCount}
            sub="courses bookmarked"
            icon={BookMarked}
            color="#0891b2"
            delay={0.08}
          />
        </div>
      </section>

      {/* Contributions */}
      <section>
        <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-3">
          Contributions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Snippets"
            value={snippetCount}
            sub="code snippets shared"
            icon={Code2}
            color="#10b981"
            delay={0}
          />
          <StatCard
            label="Experiences"
            value={expCount}
            sub="interview stories"
            icon={Briefcase}
            color="#f59e0b"
            delay={0.04}
          />
        </div>
      </section>

    </div>
  );
}