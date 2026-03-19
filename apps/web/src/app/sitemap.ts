import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../packages/convex/convex/_generated/api";
import type { MetadataRoute } from "next";

const SITE_URL = "https://scriptvalley.com";

// ── Types ─────────────────────────────────────────────────────────────────────
type Lesson = {
  title: string;
  order?: number;
};

type Module = {
  slug: string;
  order?: number;
  lessons?: Lesson[];
  mcqQuestions?: unknown[];
  codingChallenges?: unknown[];
  miniProject?: { title?: string };
};

type Course = {
  slug: string;
  status: string;
  template?: "structured" | string;
  modules?: Module[];
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function lessonSlugFromTitle(title: string, idx: number): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 60);

  return base || `lesson-${idx + 1}`;
}

// ── Sitemap Generator ─────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  // Static pages
  urls.push(
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }
  );

  // Fetch all published courses
  let courses: Course[] = [];

  try {
    const result = await fetchQuery(api.courses.getAllCourses);
    courses = (result ?? []) as Course[];

    // Defensive filter
    courses = courses.filter((c) => c.status === "published");
  } catch {
    return urls;
  }

  for (const course of courses) {
    // Course page
    urls.push({
      url: `${SITE_URL}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const modules = [...(course.modules ?? [])].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    for (const mod of modules) {
      // Module page
      urls.push({
        url: `${SITE_URL}/courses/${course.slug}/${mod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });

      // Structured course logic
      if (course.template === "structured") {
        const lessons = [...(mod.lessons ?? [])].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );

        for (let li = 0; li < lessons.length; li++) {
          const lesson = lessons[li];
          const lSlug = lessonSlugFromTitle(lesson.title, li);

          urls.push({
            url: `${SITE_URL}/courses/${course.slug}/${mod.slug}/${lSlug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }

        // Assessment page logic
        const hasMCQ = (mod.mcqQuestions?.length ?? 0) > 0;
        const hasChallenges = (mod.codingChallenges?.length ?? 0) > 0;
        const hasMiniProj = !!mod.miniProject?.title;

        if (hasMCQ || hasChallenges || hasMiniProj) {
          urls.push({
            url: `${SITE_URL}/courses/${course.slug}/${mod.slug}/assessments`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      }
    }
  }

  return urls;
}