# n8n Prototype Playground

Shared prototyping playground for the n8n design team. One Next.js app where every designer gets their own namespace. All prototypes live in one place for visibility and code reuse.

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

## How to create a prototype

**Option 1: Use the `/create-prototype` command** (recommended)
```
/create-prototype my-feature-name
```

**Option 2: Manually**
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
