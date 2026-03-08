"use client";

type ContributionDay = {
  date?: string;
  contributionCount: number;
  [k: string]: unknown;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
  [k: string]: unknown;
};

type ContributionsCalendar = {
  weeks: ContributionWeek[];
  [k: string]: unknown;
};

export function normalizeGithub(input?: string | null): string | null {
  if (!input) return null;
  try {
    if (input.includes("http")) {
      const u = new URL(input);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] || null;
    }
  } catch {}
  return input.trim().replace(/^@/, "") || null;
}

export function computeMaxStreak(data: unknown): number {
  try {
    if (!data || typeof data !== "object") return 0;
    const cal = data as ContributionsCalendar;
    if (!Array.isArray(cal.weeks)) return 0;

    const days: number[] = [];
    for (const week of cal.weeks) {
      if (!week || !Array.isArray(week.contributionDays)) continue;
      for (const day of week.contributionDays) {
        const cnt =
          typeof day?.contributionCount === "number"
            ? day.contributionCount
            : 0;
        days.push(cnt);
      }
    }

    let max = 0;
    let cur = 0;
    for (const v of days) {
      if (v > 0) {
        cur += 1;
      } else {
        cur = 0;
      }
      if (cur > max) max = cur;
    }
    return max;
  } catch {
    return 0;
  }
}

export function computeCurrentStreak(data: unknown): number {
  try {
    if (!data || typeof data !== "object") return 0;
    const cal = data as ContributionsCalendar;
    if (!Array.isArray(cal.weeks)) return 0;

    const days: number[] = [];
    for (const week of cal.weeks) {
      if (!week || !Array.isArray(week.contributionDays)) continue;
      for (const day of week.contributionDays) {
        const cnt =
          typeof day?.contributionCount === "number"
            ? day.contributionCount
            : 0;
        days.push(cnt);
      }
    }

    let cur = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i] > 0) cur += 1;
      else break;
    }
    return cur;
  } catch {
    return 0;
  }
}
