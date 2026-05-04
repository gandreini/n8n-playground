# Project Page — design spec

**Status**: Draft (2026-05-04)
**Author**: giulio
**Prototype**: `app/prototypes/giulio/n8n-vision-may-2026`
**Stack**: Next.js 16, React 19, TypeScript, styled-jsx, shadcn/ui (Dialog), Lucide icons
**Figma**: <https://www.figma.com/design/GbvvTvLfPCYFx24gPFhTaV/?node-id=7083-3024> (right-side artifacts panel)

## Goal

Add a "Project" view to the `n8n-vision-may-2026` prototype. A project is a Claude.ai-Projects–style workspace: multiple chats with the AI Assistant share a persistent right-side **artifacts panel** that lists connected resources (workflows, agents), documents, knowledge sources, and a settings entry.

Clicking any project in the existing left sidebar enters this view as a fullscreen takeover.

## Non-goals (v1)

- Real send/reply simulation in the composer (composer types but does not "send")
- Real attach flows behind the per-section `+` buttons (they no-op)
- Project creation flow (the existing `+` next to the sidebar's "Projects" section stays no-op)
- Document / PDF viewer pane
- Click-through navigation from Connected Resources to the Workflow Editor or Agent Chat
- Drag-and-drop, search, or filter inside the artifacts panel
- Project-level settings persistence (the Settings modal is a visual stub)
- Cross-prototype changes — this all lives inside `app/prototypes/giulio/n8n-vision-may-2026/`

## Decisions log (from brainstorm)

- **Navigation model**: B — multi-chat per project (Claude.ai-style sub-sidebar with chat list)
- **Artifact attachment**: C — conversational populates artifacts; manual `+` per section is the hover-revealed escape hatch (no-op in v1)
- **Documents semantics**: C — generic user-attached files. The four `*.md` names in the Figma are illustrative placeholders, not a baked-in feature
- **Scope**: B — semi-interactive, matches the existing `AgentChatView` / `AIAssistant` polish level

## Architecture

### Fullscreen view, in line with existing patterns

`app-layout.tsx` already toggles between fullscreen takeovers (`AIAssistant`, `AgentChatView`) and the default sidebar+screen layout. Project view adds a third takeover.

New state in `AppLayout`:

```ts
const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
```

Render order (first match wins):

1. `aiAssistantActive` → render `<AIAssistant />`
2. `agentsView?.type === "chat"` → render `<AgentChatView />`
3. `activeProjectId !== null` → render `<ProjectView projectId={activeProjectId} onBack={() => setActiveProjectId(null)} />`
4. Default: sidebar + main `renderScreen()`

`clearActives()` is extended to also reset `activeProjectId`. Sidebar interactions that change context (selecting an agent, opening AI Assistant, navigating screens) clear the active project.

### Sidebar wiring

Today the sidebar's project rows are non-interactive:

```tsx
{PROJECTS.map((name) => (
  <NavItem key={name} icon={<Folder />} label={name} compact={collapsed} />
))}
```

After this change:

- `PROJECTS` (currently a hardcoded `string[]` inside `sidebar.tsx`) is replaced with an `import { PROJECTS } from "./projects-data"` of typed `Project` records
- Each project row gets `onClick={() => onProjectClick(project.id)}` and `active={project.id === activeProjectId}`
- New props on `Sidebar`: `onProjectClick: (id: string) => void` and `activeProjectId: string | null`
- The existing `onScreenChange` handler in `app-layout.tsx` is updated to also reset `activeProjectId`, so screen navigation always exits the project view
- `clearActives()` in `app-layout.tsx` resets `activeProjectId` alongside `aiAssistantActive` and `agentsView`, keeping all takeover-switching flows consistent
- The wiring for project clicks is:
  ```ts
  onProjectClick={(id) => {
    clearActives();
    setActiveProjectId(id);
  }}
  ```

The sidebar's existing `+` button next to the "Projects" section label remains no-op for v1.

### Component shape

```
ProjectView (project-view.tsx)
├── SubSidebar  (inline)
│   ├── BackButton
│   ├── ProjectHeader  (folder icon + project name)
│   ├── NewChatButton  (clears selectedChatId)
│   └── ChatList (grouped by date)
│
├── Main (inline)
│   ├── TopBar  (chat title or project name)
│   ├── EmptyState  (when no chat selected — project name + composer)
│   │  OR
│   │  ConversationThread (selected chat)
│   └── ComposerPin  (pinned-bottom composer when thread is open)
│
└── ArtifactsPanel  (artifacts-panel.tsx — new file)
    ├── Section "Connected resources"  (workflows + agents)
    ├── Divider
    ├── Section "Documents"
    ├── Divider
    ├── Section "Knowledge"
    ├── Divider
    └── Section "Settings"  (special: a single clickable row, no item list)
```

`ProjectView` itself owns: `selectedChatId`, `composerValue`, `expandedSections` (per artifacts section), and `settingsOpen`. All `useState`. No Zustand changes.

`ConversationThread` is reused conceptually from `agent-chat.tsx` — we copy/adapt its mock-thread JSX into `project-view.tsx` rather than extracting a shared component (YAGNI; the two diverge slightly in placeholder copy).

## Mock data

New file: `app/prototypes/giulio/n8n-vision-may-2026/_components/projects-data.ts`

```ts
export type Resource = {
  id: string;
  type: "workflow" | "agent";
  name: string;
};

export type Document = {
  id: string;
  name: string; // includes extension, e.g. "PLAN.md"
};

export type KnowledgeItem = {
  id: string;
  name: string;
  kind: "pdf" | "link" | "integration";
  // For "integration", optionally a service id like "airtable" used for icon lookup.
  service?: string;
};

export type Chat = {
  id: string;
  title: string;
  group: "today" | "yesterday" | "previous";
  // Optional pre-written thread shown when selected. If absent, selecting the
  // chat shows the empty-thread state. v1: only the rich Marketing project
  // includes a thread.
  thread?: ConversationMessage[];
};

export type ConversationMessage =
  | { role: "user"; paragraphs: string[] }
  | {
      role: "assistant";
      paragraphs: string[];
      steps?: { label: string; status: "done" | "pending" }[];
      agentCard?: { icon: string; name: string; meta: string };
    };

export interface Project {
  id: string;
  name: string;
  description: string;
  resources: Resource[];
  documents: Document[];
  knowledge: KnowledgeItem[];
  chats: Chat[];
}

export const PROJECTS: Project[] = [
  /* Populated per the "Project content" section below.
     Order matches the existing sidebar list. */
];
```

### Project content

| id | Name | State | Chats |
|---|---|---|---|
| `marketing` | Marketing Automation | **Rich** — matches the Figma | 2 chats; chat #1 has a written-out `thread` |
| `sales` | Sales Operations | Light — 1 workflow + 1 doc + 1 link | 1 chat, no `thread` |
| `onboarding` | Customer Onboarding | Light — 1 agent + 2 docs | 1 chat, no `thread` |
| `internal-tools` | Internal Tools | Light — empty Connected resources, 1 PDF, 1 integration | empty chats array |

Project IDs match the existing sidebar order. The Marketing Automation project mirrors the Figma:

- 3 resources (`Insight pipeline` workflow, `Recruitment tracker` workflow, `Research recruitment screener` agent)
- 4 documents (`PLAN.md`, `TASKS.md`, `MEMORY.md`, `PROJECT_DIARY.md`)
- 5 knowledge items (`guidelines.pdf`, `AI_agent_building.pdf`, `n8n-docs-html` link, `Notion Docs` link, `Airtable Design Team Base` integration)
- 2 chats: one with `thread`, one without

## Layout

Three columns at fixed widths with a flexible main:

| Region | Width | Bg / border |
|---|---|---|
| Sub-sidebar | `240px` | `--menu--color--background`, right border `--border-color--light` |
| Main | flex | `--color--background-base` |
| Artifacts panel | `272px` | `--color--neutral-white`, left border `--border-color--subtle` |

Total: stays inside the existing `n8n-app-layout` flex row that fills `100vh`.

## Sub-sidebar (left column)

Reuses the styling pattern from `AgentChatView.sub-sidebar`. Order top to bottom:

1. **Back row** — `← Back` button (same styles as `AgentChatView`)
2. **Project header** — new. 22px folder square (`--color--orange-200` bg + Folder icon) followed by project name. 14px, weight medium.
3. **New chat button** — same look as `AgentChatView`'s ("⊕ New chat" with circular orange icon)
4. **Chat list** — same look as `AgentChatView` chat-list. Groups: `Today`, `Yesterday`, `Previous`. Active state uses `--color--neutral-100` bg + medium weight.

Selecting a chat sets `selectedChatId`; clicking "New chat" sets it to `null`.

## Main (center column)

Behaviorally identical to `AgentChatView.main`, with copy adapted:

- **Top bar** (48px height, bottom border): shows the current chat title when one is selected; otherwise the project name. Right side stays empty for v1.
- **Empty (no chat selected)**: a centered block with the project name as `<h1>` (22px, weight bold) and the composer below it. No agent-name, no metadata.
- **Selected chat with `thread`**: render the thread (same mock components as `AgentChatView`'s `ConversationThread` — user msg bubble, assistant msg with steps + agent card + msg-actions). Composer pinned to bottom.
- **Selected chat without `thread`**: same empty centered composer as the no-chat state, but the top bar shows the chat title.

Composer reuses the existing `_components/composer.tsx` with `placeholder="Send a message..."`, `leftButton="paperclip"`, `showAgentSelect={false}`. State is local `composerValue`.

## Artifacts panel (right column)

New file: `app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx`

### Container

- 272px fixed width, full height
- White background (`--color--neutral-white`)
- 1px left border (`--border-color--subtle`, falls back to `--color--black-alpha-100`)
- Vertical scroll inside if content overflows; outer container hides overflow
- Padding: `12px 12px 16px 12px`
- Children stack with a 1px horizontal divider between sections (`--color--neutral-150`)

### Section header (`SectionHeader` subcomponent — inline)

Per Figma `MenuItem`:

- Min height 32px, padding `4px 4px`, radius 4px (`--radius--3xs`)
- Layout: `[name flex] [+ on hover, 24px slot] [chevron, 24px slot]`
- Name: `--color--neutral-800`, 14px, weight 400, line-height 20px
- Chevron: `ChevronUp` when expanded, `ChevronDown` when collapsed. 16px, color `--color--neutral-500`
- The header is the click target for collapse/expand
- The hover-revealed `+` button matches the existing `SectionLabel` pattern in the main sidebar:
  - 18px square, opacity 0 by default, opacity 1 on header hover
  - `Plus` icon, 14px, color `--color--neutral-500`, hover bg `--color--neutral-150`
  - `onClick` stops propagation; v1 calls `console.debug("attach", section)` and does nothing else

### Item row (`ArtifactItem` subcomponent — inline)

- Layout: `[16px icon] [name] [↗ 16px arrow]`
- 12px gap between icon/name, 6px gap between name/arrow
- Padding-block 0; the items inside a section sit in a 16px-padded inset (matching the Figma's `pb-16 px-16` on the items container)
- Items themselves stack with 8px vertical gap
- Name uses **mono** font: `font-family: var(--font-mono)`. The token resolves to `'Commit Mono', ui-monospace, Menlo, Consolas, monospace` (verified in `globals.css`). 14px, line-height 1.45, color `--color--neutral-800`
- Icon color: `--color--neutral-500`
- Arrow color: `--color--neutral-500`
- Click on a row: `console.debug("open artifact", item)` for v1 (no navigation)

### Sections

Default expanded: `Connected resources`, `Documents`, `Knowledge`. Default collapsed: `Settings`. Local state `expandedSections: Record<string, boolean>` keyed by section id.

| Section | Item icon mapping |
|---|---|
| Connected resources | `type === "workflow"` → `Workflow`. `type === "agent"` → `Bot`. |
| Documents | `File` for all |
| Knowledge | `kind === "pdf"` → `File`. `kind === "link"` → `Link2`. `kind === "integration"` → Lucide `Database` icon (simplest placeholder; the shared `ServiceIcon` doesn't include Airtable yet, and rendering a real branded glyph is out of scope for v1). |

Empty section state: a single muted line `<div className="empty">No items yet</div>` (`--color--neutral-400`, 13px, italic). The `+` button on the header still works.

### Settings section

Special — does not render a list. Header is the only row, and clicking the header (or the chevron) toggles `settingsOpen` (a shadcn `Dialog`) instead of expanding inline content.

Dialog (using `components/shadcn/dialog`):

- Title: `Project settings`
- Body: a single `Input` labelled `Project name`, pre-filled with the current project name; a destructive `Button` labelled `Archive project`
- Footer: `Cancel` button only — no `Save`. Closing the dialog discards changes (visual stub)
- No mutations to project data

## Behaviors summary

| Action | Result |
|---|---|
| Click project in main sidebar | Enter project view (fullscreen takeover) |
| Sub-sidebar back button | Return to default screen layout |
| Click a chat | Load thread (or empty composer state) |
| New chat | Clears `selectedChatId` → empty composer state |
| Type in composer | Local `composerValue` updates only — no send |
| Click section header | Toggle that section's expanded state |
| Hover section header | Reveal `+` button (no-op on click) |
| Click an item row | `console.debug` log; no navigation |
| Click Settings row | Open settings dialog |
| Click any sidebar item that switches context | Clears `activeProjectId` and exits project view |

## Files to create / modify

### Create

- `app/prototypes/giulio/n8n-vision-may-2026/_components/projects-data.ts`
- `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`
- `app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx`

### Modify

- `app/prototypes/giulio/n8n-vision-may-2026/_components/app-layout.tsx`
  - Add `activeProjectId` state and corresponding render branch
  - Extend `clearActives()` to reset it
  - Pass `onProjectClick` and `activeProjectId` into `<Sidebar />`
- `app/prototypes/giulio/n8n-vision-may-2026/_components/sidebar.tsx`
  - Replace the inline `PROJECTS` `string[]` with `import { PROJECTS } from "./projects-data"` (typed)
  - Add `onProjectClick` and `activeProjectId` props
  - Wire `onClick` and `active` on each project `NavItem`

No shared components are touched. `useStore` (Zustand) is not modified.

## Visual fidelity notes

- The Figma uses Geist Mono for artifact item names; this prototype already loads Geist via `app/layout.tsx`. The CSS token `--font-family--code` should resolve; if it doesn't, fall back to `ui-monospace, "Geist Mono", monospace` inline.
- Section header chevrons in the Figma are 24px slot containers around 16px icons. We mirror that — the slot keeps spacing consistent across sections.
- Divider between sections: `<hr>` styled to 1px height, `--color--neutral-150`. Implemented in styled-jsx, not a separate component.

## Verification

Per `CLAUDE.md`'s self-verification rule: every visible change is screenshotted via Chrome DevTools / Playwright / Claude-in-Chrome MCP and inspected. The implementation plan will end each task with a screenshot step before commit.

Manual verification scenarios for the final task:

1. From the home screen, click `Marketing Automation` in the sidebar → enters project view with the Figma-rich state visible
2. Click `New chat` → composer-only landing
3. Click a chat in the sub-sidebar → thread loads, composer pinned
4. Click `Back` → returns to default screen
5. From a project, click `AI Assistant` → exits project, AI Assistant opens
6. Click `Settings` row in artifacts panel → dialog opens
7. Hover a section header → `+` button reveals
8. Click a section header → section collapses; chevron flips
9. Switch to a light-state project (e.g. `Internal Tools`) → empty/sparse sections render the `No items yet` state
