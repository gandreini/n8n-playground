# n8n Prototype Playground

Shared prototyping playground for the n8n design team. One Next.js app where every designer gets their own namespace. All prototypes live in one place for visibility and code reuse.

## New joiner onboarding

**At the start of every session**, check whether `claude.local.md` exists in the project root.

If it **does not exist**, the user is a new joiner. Greet them and walk them through setup before doing anything else:

> "👋 Welcome to the n8n Prototype Playground! Looks like this is your first time here — let me get you set up.
>
> **How this works:**
> - You build prototypes locally using Claude Code (that's me!)
> - Each prototype lives in its own git branch: `{your-name}/{prototype-name}`
> - When you're ready to share, `/deploy` opens a pull request and gives you a **live Vercel preview URL** — a real link anyone can visit
> - When merged to `main`, your prototype appears on the public gallery at [v0-n8n-playground.vercel.app](https://v0-n8n-playground.vercel.app)
>
> **Important: Vercel is read-only.** You can browse prototypes there, but creating/editing only works locally — those features use dev-only APIs that are disabled in production.
>
> **First, tell me who you are.** Create your config file:"
>
> ```bash
> cp claude.local.md.example claude.local.md
> ```
>
> Then edit it and set your username (lowercase, no spaces). Once that's done, run `/create-prototype` to build your first prototype.

If `claude.local.md` **exists**, proceed normally — the user is already set up.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 with n8n design tokens (in `app/globals.css`)
- shadcn/ui (full Radix-based component library in `components/ui/`)
- Zustand for state management
- pnpm as package manager
- Deployed on Vercel

No database — everything is files on disk.

## Project structure

```
app/
├── page.tsx                          # Playground homepage (4 tabs)
├── layout.tsx                        # Root layout (Geist font, Vercel Analytics)
├── globals.css                       # n8n design tokens
├── api/create-prototype/route.ts     # Localhost-only API for creating prototypes
└── prototypes/
    ├── giulio/
    │   └── workflow-editor/          # Example prototype
    │       ├── page.tsx
    │       └── metadata.json
    ├── {username}/
    │   └── {prototype-name}/
    │       ├── page.tsx
    │       └── metadata.json
    └── _templates/                   # Starter templates (not routable)
        ├── blank/
        └── n8n-app/

components/
├── n8n/                              # n8n-specific components
│   ├── app-layout.tsx                # Full n8n app shell (used by workflow-editor)
│   ├── prototype-shell.tsx           # Children-accepting layout wrapper
│   ├── sidebar.tsx
│   ├── panels/
│   ├── screens/
│   ├── modals/
│   └── shared/
├── ui/                               # Full shadcn/ui library (~50 components)
└── playground/                       # Homepage components
```

## Rules

- **Stay in your own directory**: `app/prototypes/{your-username}/`
- **Never modify other people's prototypes**
- **Never modify root-level files** (layout.tsx, page.tsx, globals.css) or shared components without asking
- **Each prototype is standalone** — no cross-prototype imports
- Read `claude.local.md` for your username and directory

## Shared components

Use these — don't recreate them:

- **`PrototypeShell`** (`components/n8n/prototype-shell.tsx`) — Use this for prototypes that need n8n sidebar chrome. Accepts `children`. Has optional `hideSidebar` prop.
- **`AppLayout`** (`components/n8n/app-layout.tsx`) — Full n8n app shell. Does NOT accept children (manages its own screens via Zustand). Only used by the workflow-editor prototype.
- **`Sidebar`** (`components/n8n/sidebar.tsx`) — n8n sidebar with navigation
- **Panels**: `nodes-panel.tsx`, `node-config-panel.tsx`
- **Screens**: `overview.tsx`, `personal.tsx`, `settings.tsx`, `workflow-editor.tsx`
- **Modals**: `credential-modal.tsx`
- **Shared**: `service-icon.tsx`, `n8n-logo.tsx`
- **shadcn/ui**: Full library in `components/ui/` — button, dialog, tabs, input, label, etc.

## How to create or select a prototype

**Create a new prototype:**
```
/create-prototype my-feature-name
```

**Work on an existing prototype:**
```
/select-prototype
```
This lists your prototypes and helps you switch to the right branch.

**Create manually:**
1. Create `app/prototypes/{username}/{prototype-name}/`
2. Create `metadata.json`:
   ```json
   {
     "title": "My Prototype",
     "description": "What it does",
     "author": "username",
     "date": "2026-04-12",
     "externalUrl": null,
     "featured": false,
     "template": false
   }
   ```
3. Create `page.tsx` — import shared components as needed

## Conventions

- Every prototype **must** have a `metadata.json`
- Use shared components from `components/ui/` and `components/n8n/`
- Prefer Tailwind utility classes over custom CSS
- Use n8n design tokens from `globals.css` (e.g., `var(--color--orange-300)`, `var(--color--neutral-800)`)

## Git workflow

- **Branch naming**: `{username}/{prototype-name}` (e.g., `giulio/workflow-editor`)
- **Never commit prototype work directly to `main`** — always use a feature branch
- Both `/create-prototype` and `/select-prototype` will suggest creating a branch if you're on `main`
- The `/deploy` command also handles branching automatically as a safety net

### Branch check logic (used by commands)
When switching to a branch for a prototype:
1. If the branch exists locally → `git checkout {username}/{prototype-name}`
2. If it exists on the remote but not locally → `git checkout -b {username}/{prototype-name} origin/{username}/{prototype-name}`
3. If it doesn't exist anywhere → `git checkout -b {username}/{prototype-name}`
4. If checkout fails due to uncommitted changes → offer to `git stash`, switch, then `git stash pop`

## Vercel deployment verification

This app is deployed on Vercel. **After every push to `main` or a feature branch, verify the Vercel deployment succeeded.**

1. Check the deployment status via GitHub API:
   ```bash
   gh api repos/{owner}/{repo}/deployments --jq '[.[] | select(.sha == "{sha}")] | first | .statuses_url' | xargs -I{} gh api {} --jq '.[0] | {state: .state, description: .description}'
   ```
2. If the deployment **failed**, inspect the Vercel build logs:
   ```bash
   npx vercel inspect {deployment-id} --logs --scope n8n-vibes
   ```
3. Fix the issue (common causes: missing dependencies in `package.json`, import errors, type errors), run `pnpm build` locally to confirm, then push the fix.
4. Don't report work as done until the Vercel deployment is green.

## Self-verification (MANDATORY)

**You MUST visually verify every UI change before reporting work as done.** Do not skip this step. Do not claim something works without seeing it.

### Step 1: Make sure the dev server is running
```bash
pnpm dev
```

### Step 2: Open the page in the browser and take a screenshot
Use whichever browser tool is available — Playwright MCP, Chrome DevTools MCP, or Claude-in-Chrome:

**Chrome DevTools MCP:**
```
mcp__chrome-devtools__navigate_page → url: http://localhost:3000/your-page
mcp__chrome-devtools__take_screenshot
```

**Playwright MCP:**
```
mcp__plugin_playwright_playwright__browser_navigate → url: http://localhost:3000/your-page
mcp__plugin_playwright_playwright__browser_take_screenshot
```

**Claude-in-Chrome:**
```
mcp__claude-in-chrome__navigate → url: http://localhost:3000/your-page
mcp__claude-in-chrome__read_page
```

### Step 3: Inspect the screenshot
- Does the layout look correct? No overlapping elements, no broken alignment?
- Are colors, fonts, and spacing matching the n8n design tokens?
- Is the content rendering (no blank pages, no missing data)?
- Are interactive elements visible (buttons, tabs, links)?

### Step 4: Check for errors
- Use the browser console tool to check for JavaScript errors
- Run `pnpm lint` and fix any issues

### Step 5: Fix issues before reporting
If anything looks wrong, fix it and take another screenshot. Repeat until it looks right.

**The principle: anytime you would ask the user to look at something, look at it yourself first. Never say "it should work" — verify that it does.**

## How to run

```bash
pnpm dev
```

Open http://localhost:3000 for the playground homepage.
