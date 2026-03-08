import { Shield } from "lucide-react";

type PolicySection = { heading: string; body: string | string[] };

const SECTIONS: PolicySection[] = [
  {
    heading: "Information we collect",
    body: [
      "Account information: When you sign in via Google, we receive your name, email address, and profile picture. We do not store your Google password.",
      "Usage data: We store the code you run, snippets you save, DSA progress you mark, and notes you write — this is the core product data.",
      "Platform handles: If you connect GitHub or LeetCode, we store the username you provide. We use it to fetch public data from those platforms on your behalf.",
      "Analytics: We collect anonymised usage data (page views, feature usage) to understand how the platform is used. No personally identifiable information is attached to this data.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To operate the platform — running your code, tracking your DSA progress, storing your notes and snippets.",
      "To display your developer profile — combining your progress data, GitHub stats, and LeetCode stats.",
      "To improve Script Valley — understanding which features are used, what&apos;s broken, and what to build next.",
      "We do not sell your data. We do not use your data to train AI models. We do not share your data with advertisers.",
    ],
  },
  {
    heading: "Data storage",
    body: "Your data is stored securely via Convex. Code executions, snippets, notes, DSA progress, and profile data are all stored in Convex&apos;s managed database. Authentication is handled by Clerk. Both services have their own privacy policies and security practices.",
  },
  {
    heading: "Public vs. private data",
    body: "Snippets you mark as public are visible to anyone, including non-logged-in visitors. Your developer profile is publicly accessible at scriptvalley.dev/profile/[username]. Notes, private snippets, starred questions, and execution history are private and only visible to you.",
  },
  {
    heading: "GitHub and LeetCode data",
    body: "When you connect GitHub or LeetCode, we fetch publicly available data from those platforms using your username. We do not request OAuth tokens — we only read public profile and activity data. We do not write to your GitHub or LeetCode accounts.",
  },
  {
    heading: "Cookies",
    body: "We use cookies for authentication (session management via Clerk) and for anonymous analytics. We do not use tracking cookies for advertising. You can disable cookies in your browser, but authentication will not work without session cookies.",
  },
  {
    heading: "Data deletion",
    body: "You can delete your account and all associated data by contacting us via the contact form. We will process deletion requests within 7 business days. Note that public snippets may be cached by search engines and third parties — we cannot guarantee removal from those caches.",
  },
  {
    heading: "Changes to this policy",
    body: "We may update this privacy policy. If we make material changes, we will notify you via email (if we have it) or via a notice on the platform. Continued use of Script Valley after changes constitutes acceptance of the updated policy.",
  },
  {
    heading: "Contact",
    body: "For privacy-related questions or deletion requests, use the contact form on this page or email us at hello@scriptvalley.dev.",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] overflow-hidden">

      <div className="px-6 py-5 bg-[var(--bg-input)] border-b border-[var(--border-subtle)] flex items-start gap-3">
        <Shield className="w-4 h-4 text-[#3A5EFF] shrink-0 mt-[3px]" />
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-disabled)] mb-1">Legal</p>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Privacy Policy</h2>
          <p className="mt-1.5 text-sm text-[var(--text-faint)]">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
        <p className="text-sm text-[var(--text-faint)] leading-[1.8]">
          Script Valley is built on the principle that your data belongs to you.
          This policy explains what we collect, why we collect it, and how we use it.
          We&apos;ve written it to be read by humans, not lawyers.
        </p>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {SECTIONS.map(({ heading, body }, i) => (
          <div key={heading} className="px-6 py-4 flex gap-4">
            <span className="w-5 h-5 rounded-md bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[10px] font-semibold text-[var(--text-disabled)] flex items-center justify-center shrink-0 mt-[2px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">{heading}</p>
              {Array.isArray(body) ? (
                <ul className="flex flex-col gap-1.5">
                  {body.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-sm text-[var(--text-faint)] leading-relaxed">
                      <span className="w-1 h-1 rounded-full bg-[var(--text-disabled)] shrink-0 mt-2" />
                      {line}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[var(--text-faint)] leading-[1.8]">{body}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}