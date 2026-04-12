# n8n Prototype Playground — Requirements

**Date:** 2026-04-12
**Author:** Giulio Andreini
**Status:** Ready for planning

## Problem

The n8n design team needs a shared space to create, share, and discover interactive prototypes. Today the repo has a single prototype at the root. There's no structure for multi-user work, no discoverability, and no onboarding for designers unfamiliar with git/terminal workflows.

## Goals

1. Restructure the repo for multi-user namespaced prototyping
2. Build a homepage that makes all prototypes discoverable
3. Support two workflows: Claude Code (power users) and v0 (low-barrier)
4. Lower the barrier for non-technical designers via templates, slash commands, and in-browser prototype creation
5. Create project documentation (CLAUDE.md, v0.md) so AI tools understand the repo conventions

## Non-goals

- Building a CMS or database-backed system — this is filesystem-based
- Authentication or access control — trust-based, team-internal
- Real-time collaboration features
- Design system documentation beyond a simple component list

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Homepage discovery | Dynamic on dev, static on prod | Localhost shows latest without restart; Vercel builds a snapshot at deploy |
| "New" button | API route (localhost-only) | Clean in-browser UX via modal form hitting `/api/create-prototype` |
| Components tab | Auto-generated, no descriptions | Scan directories for name + path; zero maintenance, always accurate |
| Localhost guard | `process.env.NODE_ENV === 'development'` | Vercel filesystem is read-only anyway; preview deploys don't need creation |
| External prototype storage | Filesystem (directory with `metadata.json`, no `page.tsx`) | Same scan picks them up; `externalUrl` triggers different rendering |
| n8n-app template | New `PrototypeShell` wrapper (not `AppLayout`) | `AppLayout` ignores children; refactoring it risks breaking existing prototype |
| Malformed metadata | Skip silently, console warning | Don't crash the homepage for one bad file |
| Slash command + API route | Shared utility function | One code path for creating prototypes, two entry points |

## Requirements

### 1. Directory restructure

- Move current `app/page.tsx` prototype to `app/prototypes/giulio/workflow-editor/page.tsx`
- Create `metadata.json` alongside it
- New prototype convention: `app/prototypes/{username}/{prototype-name}/page.tsx`
- Templates directory: `app/prototypes/_templates/`

### 2. Playground homepage (`app/page.tsx`)

Four tabs: **Prototypes**, **Vision**, **Templates**, **Components**.

**General:**
- Search/filter input that works across all tabs
- Clean, minimal list design (not card grid)
- n8n branded where possible

**Prototypes tab:**
- Lists all prototypes from `metadata.json` files
- Grouped by month ("This month", "April", "March")
- Each entry: title (linked), author, date
- External prototypes: `externalUrl` field renders with external-link icon, opens in new tab
- "Link external" button to add external prototypes (stores as `metadata.json` with `externalUrl`)
- "New" button (localhost only) opens a form modal, creates prototype via API route

**Vision tab:**
- Flat list of prototypes where `metadata.json` has `"featured": true`
- Same entry format as Prototypes tab but no month grouping
- Serves as team inspiration / best-of showcase

**Templates tab:**
- Lists templates from `app/prototypes/_templates/`
- Templates have `"template": true` in metadata
- "Use this template" action (localhost only): duplicates template into user's namespace

**Components tab:**
- Auto-generated list from `components/n8n/` and `components/ui/` (recursive scan of all `.tsx` files)
- Shows component name and file path
- No descriptions needed
- Scan errors (missing dirs, permission issues) are skipped silently

### 3. Metadata format

```json
{
  "title": "string",
  "description": "string",
  "author": "string",
  "date": "YYYY-MM-DD",
  "externalUrl": "string | null",
  "featured": false,
  "template": false
}
```

### 4. Templates

Two starter templates in `app/prototypes/_templates/`:
- **blank**: Minimal page with just a title
- **n8n-app**: Page using a new `PrototypeShell` component that provides n8n sidebar chrome and renders `children`. Does NOT use `AppLayout` (which ignores children and manages its own screen switching via Zustand).

### 5. API route: `/api/create-prototype`

- Guarded by `process.env.NODE_ENV === 'development'` (returns 403 otherwise)
- Accepts: name, description, username, template (optional)
- Creates directory, `metadata.json`, and `page.tsx` using a shared utility function (also used by the slash command)
- Used by the "New" button and "Link external" button on the homepage
- For external links: creates directory with `metadata.json` only (no `page.tsx`), `externalUrl` set

### 6. Documentation files

**`CLAUDE.md`** (root) — Full project guide for Claude Code:
- Project purpose, tech stack, structure
- Namespace rules (stay in your directory, don't modify others' work)
- Conventions (metadata.json required, use shared components, Tailwind classes, run lint, verify visually)
- Available shared components
- How to create a new prototype
- How to run the project

**`v0.md`** (root) — Subset of CLAUDE.md for v0:
- Same content minus commands/skills/MCP references
- Simpler, focused on conventions and structure

**`claude.local.md.example`** (root) — Template users copy to `claude.local.md`:
- Username, prototype directory path
- Personal rules (stay in own directory)

### 7. Slash commands (`.claude/commands/`)

**`/create-prototype`**: Creates a new prototype directory with scaffolded files. Reads username from `claude.local.md`.

**`/deploy`**: Git branch, lint, commit, push, PR creation, CI monitoring. Communicates steps in plain English.

### 8. Gitignore update

Add `claude.local.md` to `.gitignore`.

## Design principles

1. **Lower the barrier** — Every automation reduces friction for designers uncomfortable with git/terminal
2. **Keep it visible** — Homepage makes everyone's work discoverable
3. **Don't force one tool** — External linking supports v0, Lovable, Figma, etc.
4. **Teach by doing** — Deploy command explains git concepts in plain English
