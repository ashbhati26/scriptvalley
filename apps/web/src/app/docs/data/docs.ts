import {
  BarChart3,
  BookOpen,
  Bug,
  Code2,
  FileCode,
  FileText,
  GitBranch,
  Globe,
  HelpCircle,
  Mail,
  Shield,
  StickyNote,
  Star,
  Trophy,
} from "lucide-react";
import type { ElementType } from "react";

export type DocItem  = { heading: string; body: string };
export type DocStep  = { text: string };

export type DocSection = {
  id: string;
  label: string;
  icon: ElementType;
  /** If true, DocsPage renders the custom component instead of SectionContent */
  custom?: boolean;
  content: {
    eyebrow: string;
    title: string;
    intro: string;
    whatItDoes: string;
    steps: DocStep[];
    whyItMatters: string;
    highlights: string[];
    items: DocItem[];
  };
};

// ─── Groups shown as dividers in the sidebar ──────────────────────────────────
export const DOC_GROUPS: { label: string; ids: string[] }[] = [
  { label: "Platform",   ids: ["overview", "offer"] },
  { label: "Features",   ids: ["compiler", "snippets", "dsa", "notes", "contests", "starred", "devprofile", "visualizers"] },
  { label: "Support",    ids: ["faq", "contact", "feedback"] },
  { label: "Legal",      ids: ["privacy", "terms"] },
];

export const DOCS: DocSection[] = [
  // ── 1. Who We Are
  {
    id: "overview", label: "Who We Are", icon: BookOpen,
    content: {
      eyebrow: "Overview", title: "Who We Are",
      intro: "Script Valley is a free, unified platform built for developers who are serious about growth. Whether you're grinding DSA for interviews, experimenting with a new language, or building a portfolio that shows real activity this is the place to do all of it without switching between five different tabs.",
      whatItDoes: "Script Valley brings together every tool a developer needs in one coherent workspace. There's no upsell, no locked tier, no 'premium features' everything is free. The platform was built out of frustration with the fragmented developer tooling landscape: LeetCode for problems, GitHub for portfolio, some random online compiler for quick experiments, Notion for notes, and a dozen browser tabs to track upcoming contests. Script Valley collapses all of that into a single product with a consistent interface and a shared data model.",
      steps: [
        { text: "Visit scriptvalley.com and click Get started" },
        { text: "Sign in with your Google account — no email verification, no onboarding survey." },
        { text: "You land on your Dev Profile dashboard, which starts empty and fills as you use the platform." },
        { text: "Head to the Compiler to write your first piece of code. Pick a language, write, run." },
        { text: "Browse DSA Sheets and follow one to start tracking progress." },
        { text: "Connect your GitHub and LeetCode handles from Edit Profile → Platforms." },
        { text: "Your profile is now live and shareable at scriptvalley.com/profile/[username]." },
      ],
      whyItMatters: "Most developer tools solve one problem well and ignore everything else. Script Valley is designed around the idea that your coding practice, your progress, and your portfolio are all part of the same story and they should live together. When you solve a problem, write a note, run some code, and star a question, all of that feeds into a profile that actually reflects how you work.",
      highlights: [
        "Free, always no subscriptions, no trials, no hidden limits",
        "Single sign-on one Google login, everything syncs instantly",
        "Unified data model compiler runs, DSA progress, and profile all share the same backend",
        "Built for real use no gamification, no streaks for the sake of it, just tools that work",
      ],
      items: [
        { heading: "Who it's for", body: "Students preparing for interviews, developers who want to experiment quickly, or anyone who wants a single place to track their coding journey." },
        { heading: "How to get started", body: "Sign in with your Google account via Clerk. No setup needed the compiler, DSA tracker, and notes are ready immediately." },
        { heading: "Is it free?", body: "Yes. All core features are free forever. No credit card, no trial period, no paywalls." },
      ],
    },
  },

  // ── 2. What We Offer
  {
    id: "offer", label: "What We Offer", icon: BarChart3,
    content: {
      eyebrow: "Platform", title: "What We Offer",
      intro: "Script Valley isn't a collection of loosely connected utilities bolted together. Every feature was built to talk to every other feature. Your compiler runs feed your profile. Your DSA progress feeds your dev portfolio. Your notes live next to the problems they belong to.",
      whatItDoes: "The platform has many core features, each complete on its own but more powerful in combination. The Compiler lets you write and run code in 10+ languages, saves every run to your history, and connects to an AI assistant that fixes errors and optimises code. Snippets let you save any run as a shareable, commentable, searchable piece of code. DSA Sheets give you curated problem sets with per-topic progress tracking. Centralized Notes let you attach private markdown notes to any question. The Contest Calendar aggregates upcoming competitions from LeetCode, Codeforces, and CodeChef. Starred Questions let you bookmark problems across any sheet. And the Developer Profile combines your DSA progress, GitHub activity, and LeetCode stats into a single shareable page.",
      steps: [
        { text: "Start with the Compiler run code in any supported language, get a feel for the editor." },
        { text: "Save an interesting run as a Snippet give it a title, set it to public or private." },
        { text: "Go to DSA Sheets, browse the available sheets, and follow one that matches your preparation goal." },
        { text: "As you work through questions, mark them solved and add Notes for the ones worth remembering." },
        { text: "Check the Contest Calendar weekly to plan your competitive programming schedule." },
        { text: "Star the questions you want to revisit so they're always one click away." },
        { text: "Connect GitHub and LeetCode from Edit Profile, then share your profile URL." },
        { text: "We provide you curated interview experiences from the industry experts."}
      ],
      whyItMatters: "The best developer tools don't just save time — they create a feedback loop that makes you better over time. Script Valley is designed so that the natural act of using it solving problems, taking notes, produces a portfolio and a progress record as a side effect.",
      highlights: [
        "10+ languages in the compiler, all with syntax highlighting and execution history",
        "AI-powered debugging and optimisation built directly into the run cycle",
        "Public snippets with starring and code-block comments",
        "Dev profile that combines DSA progress, GitHub stats, and LeetCode data into one shareable URL",
      ],
      items: [
        { heading: "Online Compiler",       body: "Run code in 10+ languages instantly in the browser. No installs, no setup, no waiting." },
        { heading: "AI Debugging",          body: "One click turns a failed run into a fixed one. The AI reads your code and error, explains the problem, and returns a corrected version." },
        { heading: "Snippets",              body: "Save, share, and discover code snippets. Public or private, searchable by language, commentable with code blocks." },
        { heading: "DSA Sheets",            body: "Curated problem sets with topic breakdowns and per-question progress tracking that syncs to your dev profile." },
        { heading: "Centralized Notes",     body: "Private markdown notes attached to any DSA question. Always next to the problem they belong to." },
        { heading: "Contest Calendar",      body: "Upcoming contests from LeetCode, Codeforces, and CodeChef in one view, in your local timezone." },
        { heading: "Starred Questions",     body: "Bookmark any question from any sheet. Accessible from your dev profile for quick pre-interview review." },
        { heading: "Developer Profile",     body: "A public page combining DSA progress, GitHub contribution data, and LeetCode stats. Shareable as a portfolio." },
      ],
    },
  },

  // ── 3. Developer Profile
  {
    id: "devprofile", label: "Dev Profile", icon: BarChart3,
    content: {
      eyebrow: "Feature", title: "Developer Profile",
      intro: "Your Script Valley developer profile is a public page combining DSA sheet progress, GitHub activity, and LeetCode statistics. It builds itself as you use the platform no manual curation required.",
      whatItDoes: "The Progress section shows every DSA sheet you follow with per-topic bars and overall percentages. The GitHub section pulls your contribution heatmap, language breakdown, commit count, PR count, star count, and current streak. The LeetCode section shows your submission calendar, difficulty breakdown easy, medium, hard and acceptance rate. The profile is publicly accessible at scriptvalley.com/profile/[username].",
      steps: [
        { text: "Sign in and navigate to Edit Profile." },
        { text: "Add your display name, short bio, and profile picture." },
        { text: "Go to Edit Profile → Platforms and paste your GitHub profile URL." },
        { text: "Paste your LeetCode profile URL in the same section." },
        { text: "Save. GitHub and LeetCode data appears immediately." },
        { text: "Follow at least one DSA sheet — progress appears in the Progress section." },
        { text: "Share your profile URL with recruiters or teammates." },
        { text: "Keep solving problems, running code, starring questions the profile updates automatically." },
      ],
      whyItMatters: "A developer portfolio that requires manual maintenance rarely gets maintained. Script Valley's dev profile is different it's built passively as you use the platform. Every problem you solve feeds into a profile that's always current.",
      highlights: [
        "Three data sources — DSA progress, GitHub stats, LeetCode stats in a single view",
        "Live data — GitHub and LeetCode sections fetch fresh data on each profile load",
        "Shareable URL — public profile accessible without login at a permanent address",
        "Zero curation — the profile builds itself as you use Script Valley naturally",
      ],
      items: [
        { heading: "GitHub overview",      body: "Connect your GitHub username. Fetch contribution heatmap, language breakdown, star count, commit count, PRs, and streak data." },
        { heading: "LeetCode overview",    body: "Connect your LeetCode handle. Show submission calendar, difficulty breakdown — easy, medium, hard — and acceptance rates." },
        { heading: "DSA sheet progress",   body: "All followed sheets appear here with live progress bars by topic and overall completion percentage." },
        { heading: "How to connect",       body: "Go to Edit Profile → Platforms and paste your GitHub or LeetCode profile URL. Username extracted automatically." },
      ],
    },
  },

  // ── 4. DSA Sheets
  {
    id: "dsa", label: "DSA Sheets", icon: Trophy,
    content: {
      eyebrow: "Feature", title: "DSA Sheets & Progress Tracking",
      intro: "DSA Sheets are curated problem sets designed to take you from zero to interview-ready. Follow a sheet, work through the problems, and watch your progress update in real time.",
      whatItDoes: "Each sheet is a structured collection of topics — arrays, binary search, graphs, dynamic programming, and more. Each topic contains questions with links to the original problem. When you follow a sheet, it appears on your dev profile. Mark questions as Solved, Attempted, or Skipped. Per-topic progress bars show which areas are strong and which need more work.",
      steps: [
        { text: "Go to DSA Sheets from the dock." },
        { text: "Browse the available sheets and click Follow on one you want to work through." },
        { text: "Open the sheet to see all topics and their questions." },
        { text: "Click a question to see the link to the original problem and space for a note." },
        { text: "Mark the question Solved, Attempted, or Skipped." },
        { text: "Check the topic progress bars to identify weak areas." },
        { text: "Your overall completion percentage updates automatically on your profile." },
      ],
      whyItMatters: "When you can see you've completed 80% of trees but only 30% of graphs, you know exactly where to focus next. That data on your dev profile tells recruiters something concrete.",
      highlights: [
        "Per-topic progress bars — immediate visual feedback on where you stand",
        "Three question states — Solved, Attempted, Skipped more honest than a binary checkbox",
        "Syncs to dev profile — progress is public and visible without any extra effort",
        "Multiple sheets — follow more than one simultaneously and track them all",
      ],
      items: [
        { heading: "What's a sheet?",     body: "A curated list of DSA problems grouped by topic. Think Striver's SDE Sheet or NeetCode 150." },
        { heading: "Following a sheet",   body: "Click Follow from the explore page. Your progress then appears on your Dev Profile." },
        { heading: "Marking questions",   body: "Each question can be marked as Solved, Attempted, or Skipped. Completion percentage updates in real time." },
        { heading: "Notes per question",  body: "Attach a personal note to any question — approach, edge cases, time complexity." },
      ],
    },
  },

  // ── 5. Notes
  {
    id: "notes", label: "Notes", icon: StickyNote,
    content: {
      eyebrow: "Feature", title: "Centralized Notes",
      intro: "Notes in Script Valley live next to the problems they belong to, not in a separate app you have to switch to.",
      whatItDoes: "Notes are private to your account, accessible from /notes. The notes page has a sidebar listing every question you've added a note to. The editor supports plain text and basic markdown — headings, bold, lists, code blocks. Notes are auto-associated with the question title. You can edit or delete a note at any time.",
      steps: [
        { text: "Open any question inside a DSA sheet." },
        { text: "Click Add Note or open the existing note panel." },
        { text: "Write your approach, data structure rationale, time/space complexity." },
        { text: "Add code blocks with triple backticks to preserve implementations." },
        { text: "Save. The note is immediately available from /notes." },
        { text: "Return to /notes any time to review all notes via the sidebar." },
        { text: "Delete notes you no longer need with the delete button and confirmation dialog." },
      ],
      whyItMatters: "The first time you solve a problem, you write down why your approach works. Six weeks later, before an interview, the note is still there your reasoning, your edge cases, your code.",
      highlights: [
        "Private by default — notes are never visible to other users",
        "Markdown support — headings, lists, bold, and code blocks",
        "Sidebar navigation — browse all notes by question title without searching",
        "Linked to questions — always contextually connected to the problem they belong to",
      ],
      items: [
        { heading: "Where notes live", body: "Each note is tied to a question title. Access all notes from /notes, which has a sidebar for quick navigation." },
        { heading: "Editing",          body: "Click Edit to enter edit mode. Notes support plain text and markdown — bold, lists, code blocks." },
        { heading: "Deleting",         body: "Delete a note from the note viewer with a confirmation dialog. Deletion is permanent." },
      ],
    },
  },

  // ── 6. Starred Questions
  {
    id: "starred", label: "Starred Questions", icon: Star,
    content: {
      eyebrow: "Feature", title: "Starred / Favourite Questions",
      intro: "Star a question to save it. Starred questions appear in a dedicated list on your dev profile always accessible, always ready to review.",
      whatItDoes: "Any question inside any DSA sheet can be starred with a single click. Starred questions are saved to a private list on your account. View them from the Starred tab on your dev profile. The list shows the question title, sheet, topic, and difficulty. Unstar at any time — there's no limit. Starring is independent from question progress status.",
      steps: [
        { text: "Open any DSA sheet and browse its questions." },
        { text: "Click the star icon next to any question to add it to your favourites." },
        { text: "The star turns filled to confirm it's been saved." },
        { text: "Navigate to your Dev Profile and click the Starred tab." },
        { text: "Use the list before an interview to review challenging problems." },
        { text: "Click any question title to jump directly to the problem." },
        { text: "Click the star icon again to remove it from your list." },
      ],
      whyItMatters: "Your starred list accumulates naturally as you work through sheets and encounter problems worth remembering. By interview time, it's already waiting for you.",
      highlights: [
        "Instant starring — one click from anywhere inside a DSA sheet",
        "No limit — star as many questions as you need",
        "Separate from progress — starring and solving are independent states",
        "Always accessible — available from your dev profile's starred tab",
      ],
      items: [
        { heading: "Starring a question",      body: "Click the star icon next to any question in any DSA sheet. Saved to your list instantly." },
        { heading: "Viewing starred questions", body: "Go to your Dev Profile and open the Starred tab." },
        { heading: "Removing a star",          body: "Click the star icon again on any question to remove it." },
        { heading: "Independent from progress", body: "Starring doesn't change a question's solved/attempted/skipped status." },
      ],
    },
  },

  // ── 7. Compiler
  {
    id: "compiler", label: "Compiler", icon: Code2,
    content: {
      eyebrow: "Feature", title: "Compiler with AI Debugging",
      intro: "The Script Valley compiler is a full browser-based code execution environment with a VS Code-like editor, execution history, and an AI assistant that reads your code and your errors.",
      whatItDoes: "The compiler supports JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Swift, and Ruby. The editor uses Monaco the same engine that powers VS Code. Every time you run code, the execution is saved to your history with the language, timestamp, code, and output. If the run fails, click AI Fix to get a plain-English explanation and a corrected version. The Optimise mode takes working code and rewrites it to be cleaner, faster, or more idiomatic for the chosen language.",
      steps: [
        { text: "Navigate to the Compiler from the doc after login." },
        { text: "Select a language from the dropdown — the editor switches syntax immediately." },
        { text: "Write your code. The editor supports tab indentation, auto-closing brackets, and multi-cursor editing." },
        { text: "Click Run. Output appears in the panel below, separated into stdout and stderr." },
        { text: "If the run fails, click AI Fix. The assistant explains the error and shows a corrected version." },
        { text: "Accept the fix, or make your own changes, then run again." },
        { text: "Once the code is working, click Save as Snippet to save it to your library." },
      ],
      whyItMatters: "Having a compiler that remembers everything you've ever run is genuinely useful. The AI layer removes the friction of looking up error messages it's faster and the explanation is always specific to your code.",
      highlights: [
        "Monaco editor — same engine as VS Code, works exactly as expected",
        "Execution history — every run saved with code, language, output, and timestamp",
        "AI Fix — one click to explain an error and return a corrected version",
        "AI Optimise — refactors working code for readability or performance",
      ],
      items: [
        { heading: "Supported languages",  body: "JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Swift, Ruby with more planned." },
        { heading: "Execution history",    body: "Every run is saved to your profile. Browse your past executions, revisit the output, or save any run as a snippet." },
        { heading: "AI Fix",               body: "Click after a failed run to get an instant explanation of the error plus a corrected version of your code." },
        { heading: "AI Optimise",          body: "Ask the AI to refactor working code for readability, performance, or idiomatic style for the chosen language." },
        { heading: "Context-aware AI",     body: "The AI always sees your current code, the selected language, and the last output so you never need to copy-paste context." },
      ],
    },
  },

  // ── 8. Snippets
  {
    id: "snippets", label: "Snippets", icon: FileCode,
    content: {
      eyebrow: "Feature", title: "Code Snippets",
      intro: "Snippets are the public face of your coding work on Script Valley. Save a piece of code, give it a title, and decide whether the world can see it.",
      whatItDoes: "Any code execution in the compiler can be saved as a snippet public or private. Public snippets appear in the global library, searchable by language. Each snippet gets a dedicated URL you can share anywhere. Others can star snippets and leave code-block comments. Your starred count is shown on your developer profile.",
      steps: [
        { text: "Run any code in the Compiler." },
        { text: "Click Save as Snippet in the output panel." },
        { text: "Enter a descriptive title and choose Public or Private." },
        { text: "Copy the snippet URL from the detail page to share it." },
        { text: "Browse Public Snippets at /snippets. Filter by language." },
        { text: "Star snippets you find useful saved to your profile's starred list." },
        { text: "Leave a comment on a snippet with feedback or an alternative approach." },
      ],
      whyItMatters: "Over time, your public snippets become a portfolio of real solutions you've written, not a curated list of projects you polished for a resume.",
      highlights: [
        "Public and private — full control over visibility per snippet",
        "Shareable URLs — every snippet has a permanent, linkable address",
        "Code-block comments — discussions stay readable with inline syntax highlighting",
        "Starred count on your dev profile reflects the real usefulness of your work",
      ],
      items: [
        { heading: "Creating a snippet",  body: "Any code execution can be saved as a snippet. Give it a title, choose public or private, and it's instantly searchable." },
        { heading: "Browsing snippets",   body: "The public snippet library is filterable by language and searchable by title. No account required to browse." },
        { heading: "Starring",            body: "Star snippets you find useful. Your starred count is shown on your profile." },
        { heading: "Comments",            body: "Leave comments on public snippets. Comments support code blocks for cleaner discussions." },
      ],
    },
  },

  // ── 9. Contests
  {
    id: "contests", label: "Contests", icon: Globe,
    content: {
      eyebrow: "Feature", title: "Upcoming Contests",
      intro: "Never miss a competitive programming round again. The Script Valley contest calendar aggregates upcoming contests from LeetCode, Codeforces, and CodeChef into a single view.",
      whatItDoes: "The calendar pulls from LeetCode, Codeforces, and CodeChef and displays all upcoming contests sorted by start time. Each entry shows the contest name, platform, local start time, duration, and a direct registration link. Filter by platform to focus on what matters to you.",
      steps: [
        { text: "Navigate to Contests from the sidebar." },
        { text: "All upcoming contests load sorted by start time." },
        { text: "Use the platform filter to show only LeetCode, Codeforces, or CodeChef contests." },
        { text: "Check the start time column — times are shown in your local timezone automatically." },
        { text: "Note the duration to plan whether you have a full block available." },
        { text: "Click the Register link to open the contest's registration page directly." },
        { text: "Check back weekly — the calendar refreshes automatically." },
      ],
      whyItMatters: "Having one place that shows everything, in your timezone, with a direct link to register, removes the friction of checking three different websites every week.",
      highlights: [
        "Three platforms — LeetCode, Codeforces, CodeChef in one view",
        "Local timezone — start times automatically adjusted, no manual conversion",
        "Direct registration links — one click to the contest page",
        "Platform filtering — focus on the contests that match your preparation style",
      ],
      items: [
        { heading: "What's shown",  body: "Upcoming contests from LeetCode, Codeforces, and CodeChef in a single aggregated list." },
        { heading: "Filtering",     body: "Filter by platform. Jump to the registration page directly from the calendar." },
        { heading: "Timezones",     body: "All start times shown in your local timezone automatically. No manual conversion needed." },
      ],
    },
  },

  // ── 10. Visualizers
  {
    id: "visualizers", label: "Visualizers", icon: GitBranch,
    content: {
      eyebrow: "Tools", title: "Algorithm Visualizers",
      intro: "Interactive, step-by-step visualizations of sorting and pathfinding algorithms. Watch the algorithm work, not just the result.",
      whatItDoes: "The Sorting Visualizer lets you pick an algorithm, set array size and speed, and watch it step through comparisons and swaps in real time. The Pathfinding Visualizer gives you a grid where you draw walls, optionally generate a maze, then run a graph traversal algorithm and watch it find the shortest path.",
      steps: [
        { text: "Navigate to Sorting Visualizer or Pathfinding Visualizer from the Explore menu." },
        { text: "For sorting: choose an algorithm, set array size and speed." },
        { text: "Click Run. Watch bars highlight as they're compared and swapped." },
        { text: "For pathfinding: click and drag on the grid to draw walls." },
        { text: "Optionally choose a maze generation algorithm to auto-fill the grid." },
        { text: "Select a pathfinding algorithm — Dijkstra, A*, BFS, or DFS." },
        { text: "Click Run. Watch explored cells animate, then the final path highlight." },
      ],
      whyItMatters: "Reading about quicksort and watching quicksort are two different things. Fifteen seconds of watching BFS work is more effective than re-reading the Wikipedia page.",
      highlights: [
        "Sorting Visualizer — Bubble, Quick, Merge, Heap Sort and more",
        "Pathfinding Visualizer — Dijkstra, A*, BFS, DFS on an interactive grid",
        "Maze generation — auto-generate walls to test pathfinding on complex inputs",
        "Speed control — slow down to understand each step or watch at full speed",
      ],
      items: [
        { heading: "Sorting Visualizer",     body: "Visualize Bubble, Quick, Merge, Heap Sort and more. Control speed and array size in real time." },
        { heading: "Pathfinding Visualizer", body: "Draw walls, choose a maze generation algorithm, then run Dijkstra, A*, BFS, or DFS." },
        { heading: "Speed and size controls", body: "Both visualizers have speed controls so you can step slowly or watch at full speed." },
      ],
    },
  },

  // ── 11. FAQ
  {
    id: "faq", label: "FAQ", icon: HelpCircle, custom: true,
    content: {
      eyebrow: "Support", title: "FAQ", intro: "",
      whatItDoes: "", steps: [], whyItMatters: "", highlights: [], items: [],
    },
  },

  // ── 12. Contact
  {
    id: "contact", label: "Contact", icon: Mail, custom: true,
    content: {
      eyebrow: "Support", title: "Contact", intro: "",
      whatItDoes: "", steps: [], whyItMatters: "", highlights: [], items: [],
    },
  },

  // ── 13. Feedback / Bug
  {
    id: "feedback", label: "Report a Bug", icon: Bug, custom: true,
    content: {
      eyebrow: "Support", title: "Report a Bug", intro: "",
      whatItDoes: "", steps: [], whyItMatters: "", highlights: [], items: [],
    },
  },

  // ── 14. Privacy Policy
  {
    id: "privacy", label: "Privacy Policy", icon: Shield, custom: true,
    content: {
      eyebrow: "Legal", title: "Privacy Policy", intro: "",
      whatItDoes: "", steps: [], whyItMatters: "", highlights: [], items: [],
    },
  },

  // ── 15. Terms of Service
  {
    id: "terms", label: "Terms of Service", icon: FileText, custom: true,
    content: {
      eyebrow: "Legal", title: "Terms of Service", intro: "",
      whatItDoes: "", steps: [], whyItMatters: "", highlights: [], items: [],
    },
  },
];