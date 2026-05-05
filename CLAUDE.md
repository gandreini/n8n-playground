# n8n Prototype Playground

Shared prototyping playground for the n8n design team. One Next.js app where every designer gets their own namespace. All prototypes live in one place for visibility and code reuse.

## New joiner onboarding

**At the start of every session**, check whether `claude.local.md` exists in the project root.

If it **does not exist**, the user is a new joiner. Greet them and walk them through setup before doing anything else:

> 👋 **Welcome to the n8n Prototype Playground!** Looks like this is your first time here.
>
> **While you build (the 90% case):** run the app locally with `pnpm dev` and open [http://localhost:3000](http://localhost:3000). That's your fast feedback loop — every edit hot-reloads in the browser. No deploys needed. You iterate with me here until it's ready.
>
> **When you're ready to share:** run `/deploy`. I push your branch and Vercel gives you two things:
>
> 1. **A personal preview URL** — a unique link for your branch. Send it to anyone; they click and try it. Every new push updates the same URL.
> 2. **A spot on the shared gallery** — once the PR is merged to `main`, your prototype appears at [n8n-playground.vercel.app](https://n8n-playground.vercel.app/) alongside everyone else's. That's the public showcase for the design team.
>
> **Two commands to get started:**
>
> ```bash
> cp claude.local.md.example claude.local.md   # tell me who you are (set your username)
> ```
>
> Then back here in Claude Code:
>
> ```
> /create-prototype
> ```
>
> I'll create your branch, scaffold the files, and point you at a local URL. From there you just iterate.

## Returning user greeting

If `claude.local.md` **exists**, the user is already set up. When they open a new session with a generic greeting (e.g. "hey", "hi", "what's up") or ask an open-ended question like "what should I work on?", **don't give a generic reply** — pull context and offer relevant next steps.

Gather this quickly (one or two tool calls):

1. **Username** — read it from `claude.local.md` (`username: {name}`).
2. **Their prototypes** — list directories in `app/prototypes/{username}/`.
3. **Current branch** — `git branch --show-current`.

Then greet them in this shape:

> Hey {name}! 👋
>
> {one line reflecting where they are — see cases below}
>
> **What would you like to do?**
> - `/create-prototype` — start something new
> - `/select-prototype` — continue on {name of one of their prototypes, or "an existing one"}
> - `/deploy` — ship the current prototype *(only if on a prototype branch with changes)*
> - Or just tell me what you need.

**Context line cases:**

- **On a prototype branch** (`{username}/{prototype-name}`): "You're on `{prototype-name}` — last commit: *{subject of HEAD commit}*."
- **On `main` with existing prototypes**: "You have {N} prototypes so far: {comma-separated list}."
- **On `main` with no prototypes yet**: "You're all set up but haven't built anything yet — let's fix that."
- **On a worktree/other branch**: "You're on `{branch}` (not a prototype branch)."

Keep it to ~5 lines total. The point is to replace a generic "what do you want to do?" with a reply that shows you already know who they are and where they are.

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- **styled-jsx** for all our own component styling (built into Next.js, zero deps, same-file scoped CSS)
- n8n design tokens as CSS custom properties in `app/globals.css` (e.g. `var(--color--orange-500)`, `var(--spacing--md)`)
- shadcn/ui (full Radix-based component library in `components/shadcn/`) — **vendored, hands-off**
- Tailwind CSS 4 **stays installed** but is quarantined to Shadcn only; do not write Tailwind utility classes in your own code
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
├── n8n/                              # n8n-specific components (styled-jsx)
│   ├── app-layout.tsx                # Full n8n app shell (used by workflow-editor)
│   ├── prototype-shell.tsx           # Children-accepting layout wrapper
│   ├── sidebar.tsx
│   ├── panels/
│   ├── screens/
│   ├── modals/
│   └── shared/
├── shadcn/                           # Vendored shadcn/ui library — DO NOT EDIT
└── playground/                       # Homepage components (styled-jsx)
```

## Rules

- **Stay in your own directory**: `app/prototypes/{your-username}/`
- **Never modify other people's prototypes**
- **Never modify root-level files** (layout.tsx, page.tsx, globals.css) or shared components without asking
- **Never edit anything in `components/shadcn/`** — it's vendored so `npx shadcn add <component>` upgrades stay byte-identical
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
- **shadcn/ui**: Full library in `components/shadcn/` — button, dialog, tabs, input, label, etc.

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
- Use shared components from `components/shadcn/` and `components/n8n/`
- **Write styles with styled-jsx**, not Tailwind utility classes. Each component ends with a `<style jsx>{...}</style>` block; give elements semantic class names (`"panel-header"`, not `"flex items-center px-4"`).
- **Use n8n design tokens** from `globals.css` directly in your CSS (e.g. `background: var(--color--neutral-100);`, `padding: var(--spacing--md);`, `color: var(--color--orange-500);`). Never hardcode hex values or magic numbers that have a token.
- **For conditional styling**, prefer `data-*` attribute selectors (`<button data-active="true">` + `.btn[data-active='true'] { ... }`) over className concatenation.
- **For child component styling** (lucide-react icons, shadcn primitives), pass `style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }}` or reach in via `:global(.child) { ... }` inside the styled-jsx block.
- The `cn()` helper (`lib/utils.ts`) is still available when you genuinely need class concatenation, but prefer styled-jsx + data attributes first.

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
Use whichever browser tool is available — Playwright MCP, Chrome DevTools MCP, or Claude-in-Chrome.

**Where screenshots go:** if a tool needs an explicit `filePath` / `path` / `save_to_disk` argument, save into `./screenshots/` (gitignored) — **never to the repo root**. Use a descriptive filename, e.g. `./screenshots/n8n-vision-empty-state.png`. Folder is auto-created if missing (`mkdir -p screenshots`).

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
