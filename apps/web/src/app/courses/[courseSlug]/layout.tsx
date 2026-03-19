import { api } from "../../../../../../packages/convex/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import CourseShell from "./[moduleSlug]/_components/CourseShell";

interface Props {
  children: React.ReactNode;
  params:   Promise<{ courseSlug: string }>;
}

export default async function CourseLayout({ children, params }: Props) {
  const { courseSlug } = await params;
  const course = await fetchQuery(api.courses.getCourseBySlug, {
    slug: courseSlug,
  });

  if (!course) notFound();

  return (
    <CourseShell course={course}>
      {children}
    </CourseShell>
  );
}