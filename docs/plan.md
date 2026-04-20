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
- `app/page.tsx` — **Server Component**. Calls `scanPrototypes()`, `scanTemplates()`, `scanComponents()`. Passes data + `isDev` to client component. On prod: static generation (fs runs at build time). On dev: dynamic (fs runs per request).
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

| Action | File | Details |
|--------|------|---------|
| Create | `CLAUDE.md` | Full project guide: purpose, stack, structure, namespace rules, conventions, shared components, how to create prototypes, how to run |
| Create | `v0.md` | Minimal subset: structure, conventions, available components. No commands/MCP/skills references. |
| Create | `claude.local.md.example` | Template with username, prototype-dir, personal rules |
| Modify | `.gitignore` | Add `claude.local.md` |

**Verify:** Files exist. `claude.local.md` is gitignored.

---

## Phase 7: Slash Commands

| Action | File |
|--------|------|
| Create | `.claude/commands/create-prototype.md` |
| Create | `.claude/commands/deploy.md` |

**`/create-prototype`**: Reads username from `claude.local.md`. Accepts name + description arguments. Creates directory with scaffolded files via the shared utility or API route.

**`/deploy`**: Checks git + gh CLI. Creates branch if on main. Runs `pnpm lint`. Stages, commits (emoji convention per CLAUDE.md), pushes. Creates PR via `gh pr create`. Monitors CI. Explains each step in plain English.

**Verify:** Commands exist in `.claude/commands/`. Test `/create-prototype` manually.

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
