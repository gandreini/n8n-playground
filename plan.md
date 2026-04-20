# n8n Prototype Playground — Implementation Plan

## Context

The n8n design team's shared prototype repo currently has a single prototype at `app/page.tsx`. This plan restructures it into a multi-user playground with namespace isolation, a discoverable homepage, templates, documentation, and developer tooling. Requirements doc: `docs/brainstorms/playground-setup-requirements.md`.

---

## Phase 1: Directory Restructure

**Goal:** Move the existing prototype into the namespace convention.

| Action | File | Details |
|--------|------|---------|
| Create | `app/prototypes/giulio/workflow-editor/page.tsx` | Copy current `app/page.tsx` verbatim |
| Create | `app/prototypes/giulio/workflow-editor/metadata.json` | `{ title: "Workflow Editor", author: "giulio", date: "2025-03-20", featured: true }` |
| Replace | `app/page.tsx` | Temporary: server component with `redirect('/prototypes/giulio/workflow-editor')` |

**Why imports still work:** `@/*` resolves to project root (tsconfig.json), so `@/lib/store`, `@/components/n8n/*` etc. resolve identically from the new location.

**Verify:** `pnpm dev` → `/prototypes/giulio/workflow-editor` renders the prototype. Root `/` redirects to it. `pnpm build` passes.

---

## Phase 2: PrototypeShell + Templates

**Goal:** Create the children-accepting layout wrapper and two starter templates.

| Action | File | Details |
|--------|------|---------|
| Create | `components/n8n/prototype-shell.tsx` | Client component: flex layout with `<Sidebar />` + `{children}`. Same structure as `AppLayout` (line 42-49 of `app-layout.tsx`) but renders children instead of switching on `currentScreen`. Hides sidebar when not needed (optional prop). |
| Create | `app/prototypes/_templates/blank/page.tsx` | Minimal: just an `<h1>` and `<p>` placeholder |
| Create | `app/prototypes/_templates/blank/metadata.json` | `{ title: "Blank", template: true }` |
| Create | `app/prototypes/_templates/n8n-app/page.tsx` | `"use client"` — imports and wraps content in `<PrototypeShell>` |
| Create | `app/prototypes/_templates/n8n-app/metadata.json` | `{ title: "n8n App Shell", template: true }` |

**Note:** `_templates` directory is private in Next.js App Router (underscore prefix = excluded from routing).

**Verify:** Templates exist. `/prototypes/_templates/blank` returns 404 (not routable). Existing prototype unaffected.

---

## Phase 3: Shared Utilities (`lib/prototypes.ts`)

**Goal:** Single module for filesystem scanning and prototype creation, used by homepage and API route.

| Export | Purpose |
|--------|---------|
| `PrototypeMetadata` type | Matches `metadata.json` schema |
| `PrototypeEntry` type | Metadata + `slug`, `path`, `hasPage` |
| `scanPrototypes()` | Reads `app/prototypes/*/*/metadata.json`, skips `_`-prefixed dirs, skips malformed JSON with `console.warn` |
| `scanTemplates()` | Reads `app/prototypes/_templates/*/metadata.json` |
| `scanComponents()` | Recursive `.tsx` scan of `components/n8n/` and `components/shadcn/`, returns `{ name, path, category }[]` |
| `createPrototype()` | Shared creation logic: mkdir, write metadata.json, copy template page.tsx (or skip for external). Used by API route AND slash command. |

**Key detail:** All `fs` paths use `path.join(process.cwd(), ...)`. Server-side only.

**Verify:** Import in a scratch server component — `scanPrototypes()` returns the workflow-editor entry, `scanTemplates()` returns 2 templates, `scanComponents()` returns ~60+ items.

---

## Phase 4: Playground Homepage

**Goal:** Replace the redirect with the real homepage — 4 tabs, search, creation actions.

### Architecture
- `app/page.tsx` — **Server Component**. Exports its own `metadata` with `title: 'n8n Playground'` (overrides root layout's "n8n - Workflow Automation"). Calls `scanPrototypes()`, `scanTemplates()`, `scanComponents()`. Passes data + `isDev` to client component. On prod: static generation (fs runs at build time). On dev: dynamic (fs runs per request).
- `components/playground/homepage.tsx` — **Client component**. Tab switching, search filtering, create/link modals.
- `components/playground/prototype-list.tsx` — Prototypes tab: grouped by month using `date-fns` (already installed). External entries show `ExternalLink` icon + `target="_blank"`.
- `components/playground/vision-list.tsx` — Vision tab: flat list of `featured: true` entries.
- `components/playground/template-list.tsx` — Templates tab with "Use this template" (dev only).
- `components/playground/component-list.tsx` — Components tab: grouped by category (n8n / ui).

### Logo extraction
- Extract `N8nLogo` from `components/n8n/sidebar.tsx` (lines 21-29) into `components/n8n/shared/n8n-logo.tsx`
- Update sidebar to import from the shared location
- Homepage imports the same logo

### UI details
- Tabs: shadcn `Tabs` component (`components/shadcn/tabs.tsx`)
- Create modal: shadcn `Dialog` + form fields (name, description, username, template select)
- Link external modal: shadcn `Dialog` + form (name, description, username, URL)
- Use template modal: shadcn `Dialog` + form (username, prototype name)
- **Username persistence:** All modals include a username field. On first use, user types it. Value is saved to `localStorage` and prefilled in all subsequent modals. This mirrors the terminal path where username comes from `claude.local.md`.
- Search: plain `<input>` filtering by title/author across all tabs
- Styling: n8n design tokens from `globals.css` (neutrals, orange brand color)
- "New" and "Link external" buttons hidden when `isDev === false`

**Verify:** `pnpm dev` → `/` shows homepage. All 4 tabs work. Search filters. "New" and "Link external" buttons visible. Prototypes tab shows "Workflow Editor" grouped under correct month. Components tab shows n8n + ui components. `pnpm build` generates static homepage.

---

## Phase 5: API Route

**Goal:** Enable browser-based prototype creation.

| Action | File |
|--------|------|
| Create | `app/api/create-prototype/route.ts` |

- `POST` handler
- Guard: `process.env.NODE_ENV !== 'development'` → 403
- Parse body: `{ name, description, username, template?, externalUrl? }`
- Validate: name and username required
- Call `createPrototype()` from `lib/prototypes.ts`
- Return `{ success: true, path }` or `{ error }` with appropriate status

**Verify:** `curl -X POST localhost:3000/api/create-prototype -d '{"name":"test","username":"giulio","description":"test"}'` → creates `app/prototypes/giulio/test/`. Homepage "New" button creates a prototype. External link creation works. `pnpm build` → route exists but returns 403.

---

## Phase 6: Documentation

Modeled on Brian Lovin's Notion Prototype Playground approach: CLAUDE.md gives rough tooling/structure context, claude.local.md is personal and not committed, and the "teach Claude to do it itself" philosophy drives every instruction.

| Action | File | Details |
|--------|------|---------|
| Create | `CLAUDE.md` | See detailed spec below |
| Create | `v0.md` | See detailed spec below |
| Create | `claude.local.md.example` | See detailed spec below |
| Modify | `.gitignore` | Add `claude.local.md` |

### `CLAUDE.md` — detailed spec

Keep it rough and practical (Brian's style: "just some rough instructions"). Not a novel — a cheat sheet.

**Sections:**
1. **What this is** — One paragraph: shared prototype playground for the n8n design team. One Next.js app, every designer gets a namespace, all prototypes in one place for visibility and code reuse.
2. **Tech stack** — Bullet list: Next.js 16, React 19, styled-jsx (for our own code), n8n design tokens via CSS custom properties, shadcn/ui (vendored, Tailwind-backed), Zustand, pnpm. No database — everything is files on disk.
3. **Project structure** — Show the directory tree with `app/prototypes/{username}/{prototype-name}/` convention. Explain `_templates/` and `metadata.json`.
4. **Rules** — The critical ones that prevent people from breaking each other's work:
   - Stay in your own directory (`app/prototypes/{username}/`)
   - Never modify other people's prototypes
   - Never modify root layout, homepage, globals.css, or shared components without asking
   - Each prototype is standalone — no cross-prototype imports
5. **Shared components** — List what's available: n8n components (app-layout, sidebar, prototype-shell, panels, screens, modals, shared) and full shadcn/ui library. Note: use `PrototypeShell` for prototypes that need n8n chrome (not `AppLayout`).
6. **How to create a prototype** — Two paths: (1) use `/create-prototype` command, (2) manually create directory + metadata.json + page.tsx
7. **Conventions** — Every prototype needs a `metadata.json`. Use shared components, don't recreate them. Style with styled-jsx, not Tailwind utility classes. Use n8n design tokens from globals.css.
8. **Self-verification** — Key philosophy: "Before reporting work as done, verify it yourself." Instructions to:
   - Run `pnpm lint` and fix errors
   - Use Playwright MCP or Chrome DevTools MCP to open the browser, take a screenshot, and visually verify the output
   - If something looks wrong, fix it — don't ask the user to check
   - This is the "teach Claude to do it itself" principle: anytime you'd ask the user to look at something, look at it yourself first
9. **How to run** — `pnpm dev` → `http://localhost:3000`

### `v0.md` — detailed spec

Subset of CLAUDE.md for v0. No mentions of slash commands, MCP, skills, or terminal workflows. Just:
- What this project is
- Tech stack
- Project structure and namespace convention
- Rules (stay in your directory, don't modify shared files)
- Available shared components
- Metadata format
- How to create a prototype (directory + metadata.json + page.tsx)

### `claude.local.md.example` — detailed spec

Personal file, not committed. Following Brian's pattern exactly:

```markdown
# Local Claude settings — copy to claude.local.md and personalize

## Who am I
- Username: {your-username}
- My prototype directory: app/prototypes/{your-username}/

## Rules
- Work exclusively in my directory unless explicitly asked otherwise
- Do not modify other people's directories
- Do not modify root-level files (layout.tsx, page.tsx, globals.css)
- Prefer to work in my prototype directory

## Workspace
- Each prototype directory is a standalone project
- I can import shared components from components/n8n/ and components/shadcn/
- Each prototype has its own page.tsx and metadata.json
```

**Verify:** Files exist. `claude.local.md` is gitignored. CLAUDE.md includes self-verification instructions.

---

## Phase 7: Slash Commands

Following Brian's patterns: commands are "glorified prompts" that provide examples of what success looks like, check prerequisites, and communicate in plain English. The key design principle: **anytime AI asks you to do something, teach it to answer that question itself.**

| Action | File |
|--------|------|
| Create | `.claude/commands/create-prototype.md` |
| Create | `.claude/commands/deploy.md` |

### `/create-prototype` — detailed spec

Based on Brian's approach: "you give your prototype a name and a description, and all that's doing under the hood is it just created those files for me on my computer."

The command should:
1. Accept an optional name argument (e.g., `/create-prototype my-cool-feature`)
2. Read `claude.local.md` to determine the current user's username
3. If no name given, ask for one
4. Ask for a brief description
5. Ask which template to use (blank or n8n-app)
6. Create the directory at `app/prototypes/{username}/{name}/`
7. **Provide sample code snippets** showing what success looks like — include the exact metadata.json format and a sample page.tsx. Brian's insight: "it's really important to provide these code snippets to show it what success looks like"
8. Create the metadata.json with title, description, author, today's date
9. Create page.tsx from the chosen template
10. Report what was created and the URL to view it

### `/deploy` — detailed spec

Brian's deploy command has two phases and embodies the "teach Claude to do it itself" philosophy end-to-end.

**Phase 1: Prerequisites**
- Check if `git` CLI is installed
- Check if `gh` (GitHub CLI) is installed and authenticated
- If not installed or not authenticated: **walk the user through setup step by step** (don't just fail — teach them how to fix it, like Brian does with MCP setup instructions)

**Phase 2: Deploy pipeline**
Each step should be communicated in plain, friendly English — explain what's happening and why, so designers absorb git concepts without needing to learn them upfront.

1. **Check branch**: Are we on main? If yes, create a new branch (named `{username}/{prototype-name}` based on what changed). Explain: "You're on main — I'll create a feature branch so your changes are separate."
2. **Lint**: Run `pnpm lint`. If errors, fix them automatically. Explain: "Checking for code errors before we share this..."
3. **Stage and commit**: Stage changed files, create commit with emoji convention. Explain: "Saving your changes with a description..."
4. **Push**: Push branch to origin. Explain: "Uploading your branch to GitHub..."
5. **Create PR**: Use `gh pr create`. Explain: "Creating a pull request so the team can see your work..."
6. **Open in browser**: Open the PR URL in the user's default browser. Brian's insight: "just forcing open the browser window and saying 'this is where it lives on GitHub'" — this is key for discoverability.
7. **Monitor CI**: Poll CI checks every 60 seconds. If any check fails, read the error and fix it automatically, then push the fix. Keep looping until all checks pass or after 3 iterations with no progress. Brian's insight: "what's really annoying is if you push code to GitHub, wait for all the checks there to pass. If they fail, then you got to come back to your computer, fix stuff" — automate this loop.
8. **Done**: Report success with the Vercel preview URL.

The command should be written so a designer who has never used git can run `/deploy` and have their prototype live-shared without understanding branches, commits, or PRs — they just see the steps happening and absorb the concepts over time.

**Verify:** Commands exist in `.claude/commands/`. `/create-prototype test-thing` creates a scaffold. `/deploy` runs the full pipeline.

---

## Commit Strategy

| Commit | Phase | Message |
|--------|-------|---------|
| 1 | Phase 1 | `♻️ Move workflow-editor prototype to namespaced directory` |
| 2 | Phase 2 | `✨ Add PrototypeShell component and starter templates` |
| 3 | Phase 3 | `✨ Add shared prototype utilities (scan, create)` |
| 4 | Phase 4 | `✨ Build playground homepage with 4-tab discovery UI` |
| 5 | Phase 5 | `✨ Add API route for browser-based prototype creation` |
| 6 | Phase 6 | `📝 Add CLAUDE.md, v0.md, and local config template` |
| 7 | Phase 7 | `✨ Add /create-prototype and /deploy slash commands` |

---

## Key Files Reference

| File | Role |
|------|------|
| `app/page.tsx` | Current prototype → becomes homepage |
| `components/n8n/app-layout.tsx` | Existing layout (NO children, uses Zustand). **Do not modify.** |
| `components/n8n/sidebar.tsx` | Sidebar with N8nLogo (lines 21-29). Extract logo to shared. |
| `lib/store.ts` | Zustand store. Used by existing prototype. Not modified. |
| `app/globals.css` | n8n design tokens. Not modified. |
| `components/shadcn/tabs.tsx` | shadcn Tabs — used for homepage tab bar |
| `components/shadcn/dialog.tsx` | shadcn Dialog — used for create/link modals |
