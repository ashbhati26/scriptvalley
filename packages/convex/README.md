# @scriptvalley/convex

Shared Convex backend for all three apps.

## What goes here

Move your entire existing `convex/` folder here:

```
packages/convex/
├── convex/
│   ├── schema.ts
│   ├── _generated/        ← auto-generated, do not edit
│   ├── _helper.ts         ← requireAdmin, requireInstructor helpers
│   ├── admins.ts
│   ├── basicInfo.ts
│   ├── codeExecutions.ts
│   ├── experiences.ts
│   ├── http.ts
│   ├── notes.ts
│   ├── platforms.ts
│   ├── potd.ts
│   ├── progress.ts
│   ├── progressAdmin.ts
│   ├── roles.ts
│   ├── sheets.ts
│   ├── snippets.ts
│   ├── socials.ts
│   ├── starred.ts
│   ├── users.ts
│   ├── instructors.ts     ← NEW (Phase 2)
│   └── instructorSheets.ts ← NEW (Phase 2)
└── convex.json
```

## How each app imports it

Each app in `apps/` points to the same Convex deployment via env var:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

The `_generated/` folder is generated per-machine when you run `convex dev`.
Each app copies (or symlinks) it into their own `convex/_generated/` for type safety.
