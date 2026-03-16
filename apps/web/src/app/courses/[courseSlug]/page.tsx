import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import ModuleContent from "./[moduleSlug]/_components/ModuleContent";

interface CourseModule {
  order: number;
  title: string;
  slug: string;
  content: string;
}

interface Course {
  title: string;
  slug: string;
  modules: CourseModule[];
}

interface Props {
  params: Promise<{ courseSlug: string; moduleSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { courseSlug, moduleSlug } = await params;
  const course = await fetchQuery(api.courses.getCourseBySlug, { slug: courseSlug }) as Course | null;
  const mod = course?.modules?.find((m) => m.slug === moduleSlug);
  return {
    title: mod ? `${mod.title} — ${course!.title}` : "Course",
  };
}

export default async function ModulePage({ params }: Props) {
  const { courseSlug, moduleSlug } = await params;

  const course = await fetchQuery(api.courses.getCourseBySlug, { slug: courseSlug }) as Course | null;
  if (!course) notFound();

  // De-duplicate modules by slug to avoid React key warnings
  const seen = new Set<string>();
  const modules = (course.modules ?? []).filter((m) => {
    if (seen.has(m.slug)) return false;
    seen.add(m.slug);
    return true;
  });

  const modIndex = modules.findIndex((m) => m.slug === moduleSlug);
  if (modIndex === -1) notFound();

  const mod     = modules[modIndex];
  const prevMod = modules[modIndex - 1] ?? null;
  const nextMod = modules[modIndex + 1] ?? null;

  return (
    <ModuleContent
      courseSlug={courseSlug}
      mod={mod}
      modIndex={modIndex}
      totalModules={modules.length}
      prevMod={prevMod}
      nextMod={nextMod}
      isStructured={true}
    />
  );
}