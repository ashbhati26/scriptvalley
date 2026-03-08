# Migration Guide — scriptvalley → monorepo

Follow these steps in order. Each step is safe to do independently.

---

## Step 1 — Install Turborepo

In the monorepo root:

```bash
npm install
```

This installs `turbo` and sets up workspaces.

---

## Step 2 — Move your existing Next.js app into apps/web/

```bash
# From your OLD repo root, copy everything into apps/web/
cp -r src/           scriptvalley-monorepo/apps/web/src/
cp -r public/        scriptvalley-monorepo/apps/web/public/
cp next.config.js    scriptvalley-monorepo/apps/web/next.config.js
cp tailwind.config.js scriptvalley-monorepo/apps/web/tailwind.config.js
cp postcss.config.js scriptvalley-monorepo/apps/web/postcss.config.js
cp middleware.ts      scriptvalley-monorepo/apps/web/middleware.ts
cp .env.local         scriptvalley-monorepo/apps/web/.env.local
```

Do NOT copy `package.json` or `node_modules` — the monorepo has its own.

---

## Step 3 — Move the convex/ folder into packages/convex/

```bash
cp -r convex/ scriptvalley-monorepo/packages/convex/convex/
cp convex.json scriptvalley-monorepo/packages/convex/convex.json
```

---

## Step 4 — Fix convex import paths in apps/web/

Every file that imports from `"../../../convex/_generated/api"` needs to be updated.

**Option A (recommended) — use a path alias in next.config.js:**

```js
// apps/web/next.config.js
const path = require("path");
const nextConfig = {
  webpack(config) {
    config.resolve.alias["@convex"] = path.resolve(__dirname, "../../packages/convex/convex");
    return config;
  },
};
module.exports = nextConfig;
```

Then update all imports to:
```ts
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
```

**Option B — relative paths:**

The pattern depends on depth. For `apps/web/src/app/notes/page.tsx`:
```ts
// Before
import { api } from "../../../convex/_generated/api";
// After
import { api } from "../../../../packages/convex/convex/_generated/api";
```

Option A is much cleaner — do that.

---

## Step 5 — Verify apps/web still runs

```bash
cd scriptvalley-monorepo
npm run dev --filter=@scriptvalley/web
# or
turbo dev --filter=@scriptvalley/web
```

Visit http://localhost:3000 — should be identical to before.

---

## Step 6 — Set up apps/admin/ (move existing admin components)

The admin panel currently lives at `/admin` in `apps/web`. Move it:

```bash
# Copy admin components to the dedicated admin app
cp -r apps/web/src/app/admin/_components/ apps/admin/src/app/_components/
cp apps/web/src/app/admin/page.tsx        apps/admin/src/app/page.tsx  # already scaffolded
```

Then copy shared globals:
```bash
cp apps/web/src/app/globals.css     apps/admin/src/app/globals.css
cp apps/web/tailwind.config.js      apps/admin/tailwind.config.js
cp apps/web/postcss.config.js       apps/admin/postcss.config.js
```

Update `.env.local` for admin app (same CONVEX_URL and CLERK keys).

After this, you can **remove** the `/admin` route from `apps/web`:
```bash
rm -rf apps/web/src/app/admin/
```

The admin panel now lives exclusively at admin.scriptvalley.com.

---

## Step 7 — Run all three apps together

```bash
# From monorepo root
turbo dev
```

| App | URL | Role required |
|-----|-----|---------------|
| web | http://localhost:3000 | any |
| instructor | http://localhost:3001 | instructor + approved |
| admin | http://localhost:3002 | admin |

---

## Step 8 — Vercel deployment

Create three separate Vercel projects pointing to the same Git repo:

| Project | Root Directory | Domain |
|---------|---------------|--------|
| scriptvalley-web | `apps/web` | scriptvalley.com |
| scriptvalley-instructor | `apps/instructor` | instructor.scriptvalley.com |
| scriptvalley-admin | `apps/admin` | admin.scriptvalley.com |

All three share the same env vars:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

---

## What's next after Phase 1

- **Phase 2** — Schema changes (instructors table, dsaSheets status field)
- **Phase 3** — New Convex files (instructors.ts, instructorSheets.ts)
- **Phase 4** — Build out apps/instructor/ UI
