import { api } from "../../../../../../../../packages/convex/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import LessonContent from "../_components/LessonContent";
import AssessmentsContent from "../_components/AssessmentsContent";
import { Course, Lesson } from "../../../courseTypes";

interface Props {
  params: Promise<{
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
  }>;
}

function makeLessonSlug(lesson: Lesson, idx: number): string {
  const base = lesson.title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 60);
  return base || `lesson-${idx + 1}`;
}

export async function generateMetadata({ params }: Props) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;
  const course = (await fetchQuery(api.courses.getCourseBySlug, {
    slug: courseSlug,
  })) as Course | null;
  const mod = course?.modules?.find((m) => m.slug === moduleSlug);
  if (!mod) return { title: "Course" };
  if (lessonSlug === "assessments")
    return { title: `Assessment — ${mod.title} — ${course!.title}` };
  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const lessonIdx = lessons.findIndex(
    (l, i) => makeLessonSlug(l, i) === lessonSlug,
  );
  const lesson = lessons[lessonIdx];
  return {
    title: lesson
      ? `${lesson.title} — ${mod.title} — ${course!.title}`
      : "Lesson",
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseSlug, moduleSlug, lessonSlug } = await params;

  const course = (await fetchQuery(api.courses.getCourseBySlug, {
    slug: courseSlug,
  })) as Course | null;
  if (!course) notFound();

  // De-dup + sort modules
  const seen = new Set<string>();
  const modules = (course.modules ?? [])
    .sort((a, b) => a.order - b.order)
    .filter((m) => {
      if (seen.has(m.slug)) return false;
      seen.add(m.slug);
      return true;
    });

  const modIndex = modules.findIndex((m) => m.slug === moduleSlug);
  if (modIndex === -1) notFound();

  const mod = modules[modIndex];
  const prevMod = modules[modIndex - 1] ?? null;
  const nextMod = modules[modIndex + 1] ?? null;

  if (lessonSlug === "assessments") {
    const hasMCQ = (mod.mcqQuestions?.length ?? 0) > 0;
    const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
    const hasMiniProj = !!mod.miniProject?.title;
    if (!hasMCQ && !hasChallenges && !hasMiniProj) notFound();
    return (
      <AssessmentsContent
        courseSlug={courseSlug}
        mod={mod}
        modIndex={modIndex}
        totalModules={modules.length}
        prevMod={prevMod}
        nextMod={nextMod}
      />
    );
  }

  if (course.template !== "structured") notFound();

  const lessons = [...(mod.lessons ?? [])].sort((a, b) => a.order - b.order);
  const lessonIndex = lessons.findIndex(
    (l, i) => makeLessonSlug(l, i) === lessonSlug,
  );
  if (lessonIndex === -1) notFound();

  const lesson = lessons[lessonIndex];
  const prevLesson = lessons[lessonIndex - 1] ?? null;
  const nextLesson = lessons[lessonIndex + 1] ?? null;

  let isCompleted = false;
  try {
    const { userId } = await auth();
    if (userId) {
      type ProgressRow = { moduleSlug: string; lessonSlug: string };
      const progress = (await fetchQuery(api.courses.getLessonProgress, {
        courseSlug,
      })) as ProgressRow[];
      isCompleted = progress.some(
        (r) => r.moduleSlug === moduleSlug && r.lessonSlug === lessonSlug,
      );
    }
  } catch {
  }

  return (
    <LessonContent
      courseSlug={courseSlug}
      mod={mod}
      modIndex={modIndex}
      totalModules={modules.length}
      lesson={lesson}
      lessonIndex={lessonIndex}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      prevMod={prevMod}
      nextMod={nextMod}
      isCompleted={isCompleted}
    />
  );
}
