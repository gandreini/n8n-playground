# Remove Tailwind from the Playground — Requirements

**Date:** 2026-04-17
**Owner:** giulio
**Branch:** `giulio/remove-tailwind`
**Status:** Brainstorm complete, execution in progress

## Problem

Authoring styles in Tailwind classes in this project is friction for at least one team member who is more fluent in plain CSS. The preference is for component styles to live in the same file as the component, readable without translating utility classes back to CSS in your head.

## Goal

Make the playground **Tailwind-free in our own code** so that designers write styles in plain CSS (via `styled-jsx`) co-located with the component that uses them.

## Non-goals

- Uninstalling Tailwind as a dependency. Shadcn/UI is a copy-paste scaffold, not an importable library, and its vendored components depend on Tailwind. Tailwind stays installed, quarantined to `components/shadcn/`.
- Replacing Shadcn. Shadcn components stay untouched so the `npx shadcn add <component>` upgrade path keeps working.
- Adding a new styling dependency (CSS Modules alternative, vanilla-extract, Panda, etc.). `styled-jsx` is already built into Next.js.

## Decisions

### Styling approach: `styled-jsx`
Already in Next.js. Scoped automatically per component. Same-file as JSX. No dependency added. Reads existing n8n CSS custom properties (`var(--color--orange-300)`) directly.

### Vendored Shadcn folder: renamed and untouched
`components/ui/` → `components/shadcn/`. The rename makes the boundary explicit ("this folder is vendored, don't touch it"). Every file inside stays byte-identical to the upstream scaffold output. If a designer wants a component refresh, they run `npx shadcn add <component> --overwrite` into `components/shadcn/`.

### Shadcn re-theming stays in `globals.css`
Shadcn reads its color variables (`--primary`, `--background`, `--foreground`, etc.) from CSS custom properties in `app/globals.css`. Recoloring Shadcn = editing `globals.css`. Not editing `components/shadcn/`.

### Scope of rewrite
| Area | Action |
|---|---|
| `app/globals.css` | Remove Tailwind imports (`@import 'tailwindcss'`, `@import 'tw-animate-css'`, `@custom-variant`, any `@theme` blocks). Keep all `--color--*` custom properties. Keep Shadcn-required variables (`--primary`, etc.). |
| `components/ui/` → `components/shadcn/` | Rename folder. Update all 168 import references. No code inside is modified. |
| `components/n8n/*` | Rewrite in `styled-jsx`. |
| `components/playground/*` | Rewrite in `styled-jsx`. |
| `app/page.tsx` + `app/layout.tsx` | Rewrite in `styled-jsx`. |
| `app/prototypes/giulio/workflow-editor` | Rewrite in `styled-jsx`. |
| `app/prototypes/giulio/n8n-pulse` | Rewrite in `styled-jsx`. |
| `app/prototypes/_templates/blank` | Rewrite in `styled-jsx`. |
| `app/prototypes/_templates/n8n-app` | Rewrite in `styled-jsx`. |
| Other designers' prototypes | None exist at time of writing. If added mid-branch, rewrite them too. |
| `package.json` | No removal. Tailwind + `tw-animate-css` + `class-variance-authority` + `tailwind-merge` stay installed (Shadcn needs them). |
| `tailwind.config.*` / PostCSS config | Keep. Shadcn needs it. |
| `CLAUDE.md`, `README.md`, `/create-prototype` skill | Update: "use styled-jsx for your prototypes; don't write Tailwind in your own code." |

## Acceptance criteria

- No file outside `components/shadcn/` contains Tailwind utility classes in a `className`.
- `pnpm build` succeeds.
- `pnpm lint` succeeds.
- `pnpm dev` renders the homepage, both of giulio's prototypes, and the templates visibly identical to before (within minor pixel drift acceptable).
- Running `npx shadcn add <any-component>` still works and drops into `components/shadcn/`.
- `CLAUDE.md` documents that prototypes should be authored in `styled-jsx` and that `components/shadcn/` is vendored / hands-off.

## Open questions / risks

- **CVA removal.** Some Shadcn components export helpers like `buttonVariants` that prototypes may import. If those are used outside `components/shadcn/`, the rename is still safe (just an import path change). If any non-shadcn file uses `cva` directly, we'll convert it. To be verified during execution.
- **Visual parity.** Translating Tailwind utilities to CSS by hand risks pixel drift. Mitigation: screenshot every page before and after each chunk.
- **Other designers joining mid-flight.** If someone creates a new prototype on `main` while this branch is in flight, their code will need to be converted before merge. Coordinate via team channel before merging.

## Execution plan (high-level)

1. Write this doc. ✅
2. Branch `giulio/remove-tailwind` from `main`.
3. Rename `components/ui/` → `components/shadcn/`; update 168 imports; verify build.
4. Strip Tailwind directives from `globals.css`; verify build.
5. Rewrite `components/n8n/` in `styled-jsx`. Verify with screenshots.
6. Rewrite `components/playground/` + homepage. Verify with screenshots.
7. Rewrite `giulio/workflow-editor`. Verify with screenshots.
8. Rewrite `giulio/n8n-pulse`. Verify with screenshots.
9. Rewrite `_templates/`. Verify new prototype created from template renders.
10. Update docs + `/create-prototype` skill.
11. Final verification: build, lint, screenshot sweep, deploy preview.
