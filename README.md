# n8n Prototype Playground

A shared prototyping playground for the n8n design team. One Next.js app where every designer gets their own namespace — all prototypes live in one place for visibility and code reuse.

**Live at:** [v0-n8n-playground.vercel.app](https://v0-n8n-playground.vercel.app)

---

## How this works

### The short version

- **Locally + Claude Code** → you build and iterate
- **GitHub** → one branch per prototype, open a PR when ready
- **Vercel** → every branch gets a live preview URL; `main` is the published gallery

### GitHub: branches and prototypes

Each prototype lives in its own branch: `{your-name}/{prototype-name}`. For example:

```
giulio/workflow-editor
elisa/onboarding-flow
tom/ai-assistant
```

When you're happy with your prototype, you open a pull request. Vercel automatically builds a **preview URL** for every PR — a real, shareable link you can send to stakeholders before merging. Once merged to `main`, the prototype appears on the public gallery.

### Vercel: read-only showcase

The production site at [v0-n8n-playground.vercel.app](https://v0-n8n-playground.vercel.app) is **read-only**. You can browse all published prototypes, but you can't create, edit, or star anything there — those actions only work locally (they use dev-only APIs).

This is by design: Vercel is for sharing finished work, not for authoring.

---

## Getting started (new joiners)

### 1. Prerequisites

You'll need:
- [Node.js 20+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation): `npm install -g pnpm`
- [Claude Code](https://claude.ai/code): `npm install -g @anthropic-ai/claude-code`
- [GitHub CLI](https://cli.github.com/): `brew install gh` (macOS)
- Git access to this repo

### 2. Clone and install

```bash
git clone https://github.com/gandreini/n8n-playground.git
cd n8n-playground
pnpm install
```

### 3. Tell Claude who you are

Copy the example config:

```bash
cp claude.local.md.example claude.local.md
```

Then edit `claude.local.md` and set your username. Use your first name or GitHub handle (lowercase, no spaces):

```markdown
# Claude Local Config

username: yourname
prototype-directory: app/prototypes/yourname/
```

This file is gitignored — it's personal to your machine.

### 4. Start Claude Code and create your first prototype

```bash
claude
```

Then in the Claude Code chat:

```
/create-prototype my-first-prototype
```

Claude will:
- Ask you what to call it and give you a brief description prompt
- Ask which template to use (blank or n8n-app with sidebar chrome)
- Create a feature branch `yourname/my-first-prototype`
- Create the files at `app/prototypes/yourname/my-first-prototype/`
- Tell you the URL to open locally

### 5. Build your prototype

Run the dev server:

```bash
pnpm dev
```

Open http://localhost:3000 — you'll see the playground homepage with all prototypes. Yours will appear there automatically once the files are in place.

Edit `app/prototypes/{yourname}/{prototype-name}/page.tsx` and iterate.

### 6. Deploy and share

When you're ready to share:

```
/deploy
```

Claude handles everything: linting, committing, pushing, opening a PR, and giving you a public Vercel preview URL to share with your team.

---

## Working on an existing prototype

```
/select-prototype
```

This lists your prototypes and handles switching to the right branch.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** with n8n design tokens
- **shadcn/ui** — full Radix-based component library in `components/shadcn/`
- **Zustand** for state management
- **pnpm** as package manager
- **Vercel** for hosting

---

## Project structure

```
app/prototypes/{username}/{prototype-name}/
├── page.tsx        # Your prototype UI
└── metadata.json   # Title, description, author, date

components/
├── n8n/            # Shared n8n chrome (sidebar, panels, modals)
├── ui/             # shadcn/ui components
└── playground/     # Homepage components
```

Detailed docs in [CLAUDE.md](CLAUDE.md) — this is what Claude Code reads for project context.

---

## Rules

- Stay in your own directory: `app/prototypes/{your-username}/`
- Never modify other people's prototypes
- Never modify root-level files without asking
- Each prototype is standalone — no cross-prototype imports
- Work on a feature branch, not `main`
