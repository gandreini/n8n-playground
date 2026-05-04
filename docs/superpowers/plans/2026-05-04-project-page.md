# Project Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fullscreen "Project" view to `app/prototypes/giulio/n8n-vision-may-2026` — a Claude.ai-Projects-style workspace combining a chat sub-sidebar, a conversation main area, and a right-side artifacts panel (Connected resources, Documents, Knowledge, Settings).

**Architecture:** New `ProjectView` component sitting alongside `AIAssistant` and `AgentChatView`. Activated by clicking a project row in the existing left sidebar. State is local to `ProjectView` (`useState`), with `activeProjectId` lifted into `AppLayout` to drive the takeover. No Zustand changes.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, styled-jsx, shadcn/ui (`Dialog`, `Input`, `Button`), Lucide icons.

**Spec:** `docs/superpowers/specs/2026-05-04-project-page-design.md`.

**Testing convention:** This project has no unit-test framework. Per `CLAUDE.md`, every UI change is verified by taking a screenshot via Chrome DevTools / Playwright / Claude-in-Chrome MCP and inspecting it. Each task ends with a screenshot verification step before commit. If browser MCPs are blocked (e.g. Chrome already running outside the MCP profile), record the blocker in the commit message and ask the user to refresh and confirm visually.

---

## File map

**Create:**

- `app/prototypes/giulio/n8n-vision-may-2026/_components/projects-data.ts` — typed mock data for all four sidebar projects
- `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx` — the fullscreen takeover view (sub-sidebar + main + artifacts panel composition)
- `app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx` — the right-side artifacts panel with four sections

**Modify:**

- `app/prototypes/giulio/n8n-vision-may-2026/_components/app-layout.tsx` — add `activeProjectId` state, render branch, reset hooks
- `app/prototypes/giulio/n8n-vision-may-2026/_components/sidebar.tsx` — replace inline `PROJECTS` with import from `projects-data.ts`, accept `onProjectClick` and `activeProjectId` props, wire `onClick` and `active` on project rows

No shared components are modified. Zustand store (`lib/store`) is untouched.

---

## Task 1: Mock data file

**Files:**

- Create: `app/prototypes/giulio/n8n-vision-may-2026/_components/projects-data.ts`

- [ ] **Step 1: Create the file with types and mock data**

```ts
export type Resource = {
    id: string;
    type: "workflow" | "agent";
    name: string;
};

export type Document = {
    id: string;
    name: string;
};

export type KnowledgeItem = {
    id: string;
    name: string;
    kind: "pdf" | "link" | "integration";
};

export type ConversationMessage =
    | { role: "user"; paragraphs: string[] }
    | {
          role: "assistant";
          paragraphs: string[];
          steps?: { label: string; status: "done" | "pending" }[];
          agentCard?: { icon: string; name: string; meta: string };
      };

export type Chat = {
    id: string;
    title: string;
    group: "today" | "yesterday" | "previous";
    thread?: ConversationMessage[];
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

const MARKETING_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "Help me set up a weekly insight pipeline for our marketing campaigns.",
            "I want trends per channel, top-performing posts and a one-page summary.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "I'll build a workflow that pulls campaign data weekly and summarizes it.",
            "Let me wire up the steps.",
        ],
        steps: [
            { label: "Connecting to data sources", status: "done" },
            { label: "Building the summary template", status: "done" },
            { label: "Scheduling the run for Monday 8AM", status: "done" },
            { label: "Validating the first run", status: "pending" },
        ],
        agentCard: {
            icon: "📊",
            name: "Insight pipeline",
            meta: "Last updated now • Weekly schedule",
        },
    },
];

export const PROJECTS: Project[] = [
    {
        id: "marketing",
        name: "Marketing Automation",
        description:
            "Run, monitor and improve every marketing campaign across channels.",
        resources: [
            { id: "r1", type: "workflow", name: "Insight pipeline" },
            { id: "r2", type: "workflow", name: "Recruitment tracker" },
            { id: "r3", type: "agent", name: "Research recruitment screener" },
        ],
        documents: [
            { id: "d1", name: "PLAN.md" },
            { id: "d2", name: "TASKS.md" },
            { id: "d3", name: "MEMORY.md" },
            { id: "d4", name: "PROJECT_DIARY.md" },
        ],
        knowledge: [
            { id: "k1", name: "guidelines.pdf", kind: "pdf" },
            { id: "k2", name: "AI_agent_building.pdf", kind: "pdf" },
            { id: "k3", name: "n8n-docs-html", kind: "link" },
            { id: "k4", name: "Notion Docs", kind: "link" },
            { id: "k5", name: "Airtable Design Team Base", kind: "integration" },
        ],
        chats: [
            {
                id: "c1",
                title: "Set up weekly insight pipeline",
                group: "today",
                thread: MARKETING_THREAD,
            },
            {
                id: "c2",
                title: "Draft Q3 campaign brief",
                group: "yesterday",
            },
        ],
    },
    {
        id: "sales",
        name: "Sales Operations",
        description: "Streamline pipeline reporting and lead routing.",
        resources: [
            { id: "r1", type: "workflow", name: "Lead scoring sync" },
        ],
        documents: [{ id: "d1", name: "PIPELINE.md" }],
        knowledge: [{ id: "k1", name: "Salesforce Schema", kind: "link" }],
        chats: [
            {
                id: "c1",
                title: "Add a lead scoring rule",
                group: "today",
            },
        ],
    },
    {
        id: "onboarding",
        name: "Customer Onboarding",
        description:
            "Welcome new customers and walk them through setup automatically.",
        resources: [
            { id: "r1", type: "agent", name: "Onboarding concierge" },
        ],
        documents: [
            { id: "d1", name: "WELCOME_FLOW.md" },
            { id: "d2", name: "FAQ.md" },
        ],
        knowledge: [],
        chats: [
            {
                id: "c1",
                title: "Update welcome email copy",
                group: "today",
            },
        ],
    },
    {
        id: "internal-tools",
        name: "Internal Tools",
        description: "Glue scripts and integrations the team uses daily.",
        resources: [],
        documents: [],
        knowledge: [
            { id: "k1", name: "Internal API.pdf", kind: "pdf" },
            { id: "k2", name: "Linear Workspace", kind: "integration" },
        ],
        chats: [],
    },
];
```

- [ ] **Step 2: Verify the file lints and types cleanly**

Run:

```bash
pnpm lint
```

Expected: no errors in `projects-data.ts`.

- [ ] **Step 3: Commit**

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/projects-data.ts
git commit -m "✨ Add projects-data with typed mock content for n8n-vision projects"
```

---

## Task 2: ProjectView shell + sidebar wiring (entry point works)

**Goal of this task:** clicking a project in the sidebar should land you in a recognisable three-region placeholder. We'll build out each region in following tasks.

**Files:**

- Create: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`
- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/app-layout.tsx`
- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/sidebar.tsx`

- [ ] **Step 1: Create ProjectView with a placeholder layout**

```tsx
"use client";

import { ArrowLeft } from "lucide-react";
import { PROJECTS, type Project } from "./projects-data";

interface ProjectViewProps {
    projectId: string;
    onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
    const project: Project =
        PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];

    return (
        <div className="project-view">
            <aside className="sub-sidebar">
                <button className="back-btn" onClick={onBack}>
                    <ArrowLeft />
                    <span>Back</span>
                </button>
                <p className="placeholder">Sub-sidebar — {project.name}</p>
            </aside>

            <main className="main">
                <p className="placeholder">Main — {project.name}</p>
            </main>

            <aside className="artifacts">
                <p className="placeholder">Artifacts panel</p>
            </aside>

            <style jsx>{`
                .project-view {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }
                .sub-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(
                        --menu--color--background,
                        var(--color--neutral-50)
                    );
                    padding: var(--spacing--2xs);
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                }
                .back-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .back-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .artifacts {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    padding: var(--spacing--sm);
                }
                .placeholder {
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                }
            `}</style>
        </div>
    );
}
```

Save this to `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`.

- [ ] **Step 2: Update `app-layout.tsx` — add state, render branch, resets**

Open `app/prototypes/giulio/n8n-vision-may-2026/_components/app-layout.tsx`.

Add the import near the existing `_components` imports:

```tsx
import { ProjectView } from "./project-view";
```

Add the new state inside `AppLayout` next to the existing `aiAssistantActive` and `agentsView`:

```tsx
const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
```

Update `clearActives` so all three takeovers reset together:

```tsx
const clearActives = () => {
    setAiAssistantActive(false);
    setAgentsView(null);
    setActiveProjectId(null);
};
```

Add a third fullscreen render branch **after** the AI Assistant block and **after** the Agent chat block, and **before** the default `return`:

```tsx
if (activeProjectId !== null) {
    return (
        <div className="n8n-app-layout">
            <ProjectView
                projectId={activeProjectId}
                onBack={() => setActiveProjectId(null)}
            />
            <Toaster position="bottom-right" />
            <style jsx>{`
                .n8n-app-layout {
                    display: flex;
                    height: 100vh;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
```

Update the existing `<Sidebar>` JSX in the default return to pass two new props (in addition to what it already passes):

```tsx
<Sidebar
    aiAssistantActive={false}
    onAiAssistantClick={() => {
        clearActives();
        setAiAssistantActive(true);
    }}
    agentsView={agentsView}
    onNewAgentClick={() => {
        clearActives();
        setAgentsView({ type: "new" });
    }}
    onAgentClick={(agentId) => {
        clearActives();
        setAgentsView({ type: "chat", agentId });
    }}
    onScreenChange={() => {
        setAiAssistantActive(false);
        setAgentsView(null);
        setActiveProjectId(null);
    }}
    activeProjectId={activeProjectId}
    onProjectClick={(id) => {
        clearActives();
        setActiveProjectId(id);
    }}
/>
```

- [ ] **Step 3: Update `sidebar.tsx` — replace `PROJECTS`, accept new props, wire clicks**

Open `app/prototypes/giulio/n8n-vision-may-2026/_components/sidebar.tsx`.

Add an import at the top alongside `AGENTS`:

```tsx
import { PROJECTS } from "./projects-data";
```

Delete the inline declaration (around line 40):

```tsx
const PROJECTS = [
    "Marketing Automation",
    "Sales Operations",
    "Customer Onboarding",
    "Internal Tools",
];
```

Extend `SidebarProps`:

```tsx
interface SidebarProps {
    aiAssistantActive: boolean;
    onAiAssistantClick: () => void;
    agentsView: AgentsView;
    onNewAgentClick: () => void;
    onAgentClick: (agentId: string) => void;
    onScreenChange: () => void;
    activeProjectId: string | null;
    onProjectClick: (id: string) => void;
}
```

Destructure the two new props in the `Sidebar` function signature:

```tsx
export function Sidebar({
    aiAssistantActive,
    onAiAssistantClick,
    agentsView,
    onNewAgentClick,
    onAgentClick,
    onScreenChange,
    activeProjectId,
    onProjectClick,
}: SidebarProps) {
```

Replace the project-rendering block inside the sidebar's main scroll area:

```tsx
{!collapsed && <SectionLabel label="Projects" showAdd />}
<div className="group">
    {PROJECTS.map((project) => (
        <NavItem
            key={project.id}
            icon={<Folder />}
            label={project.name}
            compact={collapsed}
            active={project.id === activeProjectId}
            onClick={() => onProjectClick(project.id)}
        />
    ))}
</div>
```

- [ ] **Step 4: Start (or check) the dev server**

If the dev server is not already running, start it in the background:

```bash
pnpm dev
```

Wait for `Ready in ...`.

- [ ] **Step 5: Visually verify navigation**

Take a screenshot via Chrome DevTools / Playwright / Claude-in-Chrome MCP at:

```
http://localhost:3000/prototypes/giulio/n8n-vision-may-2026
```

Then click the **Marketing Automation** row in the sidebar. Take another screenshot.

Expected:

- The first screenshot is the existing prototype, untouched
- After clicking Marketing Automation, the layout swaps to a three-region placeholder: a left strip with `Sub-sidebar — Marketing Automation`, a centered placeholder with `Main — Marketing Automation`, and a right strip with `Artifacts panel`
- Clicking the `← Back` button returns to the sidebar+screen layout

If browser MCPs are blocked, ask the user to refresh and confirm visually before continuing.

- [ ] **Step 6: Lint check**

```bash
pnpm lint
```

Expected: no errors. If lint reports issues from this task, fix and re-run.

- [ ] **Step 7: Commit**

```bash
git add \
    app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx \
    app/prototypes/giulio/n8n-vision-may-2026/_components/app-layout.tsx \
    app/prototypes/giulio/n8n-vision-may-2026/_components/sidebar.tsx
git commit -m "✨ Add ProjectView shell and wire sidebar project navigation"
```

---

## Task 3: Sub-sidebar (back, project header, new chat, chat list)

**Files:**

- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`

- [ ] **Step 1: Replace ProjectView with the full sub-sidebar implementation (other regions stay placeholder)**

Open `project-view.tsx` and replace its entire contents with:

```tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Folder, Plus, MoreHorizontal } from "lucide-react";
import { PROJECTS, type Chat, type Project } from "./projects-data";

interface ProjectViewProps {
    projectId: string;
    onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
    const project: Project =
        PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];

    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const chatsByGroup: Record<Chat["group"], Chat[]> = {
        today: project.chats.filter((c) => c.group === "today"),
        yesterday: project.chats.filter((c) => c.group === "yesterday"),
        previous: project.chats.filter((c) => c.group === "previous"),
    };

    const groupLabels: Record<Chat["group"], string> = {
        today: "Today",
        yesterday: "Yesterday",
        previous: "Previous",
    };

    return (
        <div className="project-view">
            <aside className="sub-sidebar">
                <div className="back-row">
                    <button className="back-btn" onClick={onBack}>
                        <ArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <div className="project-header">
                    <span className="project-avatar">
                        <Folder />
                    </span>
                    <span className="project-name">{project.name}</span>
                </div>

                <div className="new-chat-wrap">
                    <button
                        className="new-chat-btn"
                        onClick={() => setSelectedChatId(null)}
                    >
                        <span className="new-chat-icon">
                            <Plus />
                        </span>
                        <span>New chat</span>
                    </button>
                </div>

                <div className="chat-list n8n-scrollbar">
                    {(["today", "yesterday", "previous"] as const).map((group) =>
                        chatsByGroup[group].length === 0 ? null : (
                            <div className="chat-group" key={group}>
                                <div className="group-label">
                                    {groupLabels[group]}
                                </div>
                                {chatsByGroup[group].map((chat) => (
                                    <button
                                        key={chat.id}
                                        className="chat-item"
                                        data-active={
                                            chat.id === selectedChatId
                                                ? "true"
                                                : undefined
                                        }
                                        onClick={() => setSelectedChatId(chat.id)}
                                    >
                                        <span className="chat-title">
                                            {chat.title}
                                        </span>
                                        <span
                                            className="chat-menu"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ),
                    )}
                    {project.chats.length === 0 && (
                        <p className="empty">No chats yet</p>
                    )}
                </div>
            </aside>

            <main className="main">
                <p className="placeholder">Main — {project.name}</p>
            </main>

            <aside className="artifacts">
                <p className="placeholder">Artifacts panel</p>
            </aside>

            <style jsx>{`
                .project-view {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }

                /* SUB-SIDEBAR */
                .sub-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(
                        --menu--color--background,
                        var(--color--neutral-50)
                    );
                }
                .back-row {
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .back-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .back-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                .project-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    margin: 0 var(--spacing--3xs);
                    border-radius: var(--radius--3xs);
                }
                .project-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 4px;
                    background-color: var(--color--orange-200);
                    color: var(--color--neutral-800);
                    flex-shrink: 0;
                }
                .project-avatar :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .project-name {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .new-chat-wrap {
                    padding: var(--spacing--3xs) var(--spacing--2xs)
                        var(--spacing--2xs);
                }
                .new-chat-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .new-chat-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .new-chat-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: var(--radius--full);
                    background-color: var(--color--primary);
                    color: white;
                }
                .new-chat-icon :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                .chat-list {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding-bottom: var(--spacing--md);
                }
                .chat-group {
                    padding: 0 var(--spacing--3xs);
                    margin-top: var(--spacing--xs);
                }
                .group-label {
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .chat-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .chat-item:hover {
                    background-color: var(--color--neutral-100);
                }
                .chat-item:hover .chat-menu {
                    opacity: 1;
                }
                .chat-item[data-active="true"] {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-800);
                    font-weight: var(--font-weight--medium);
                }
                .chat-title {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: var(--font-line-height--loose);
                }
                .chat-menu {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    color: var(--color--neutral-500);
                    opacity: 0;
                    transition: opacity var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .chat-menu :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .empty {
                    padding: var(--spacing--md) var(--spacing--xs);
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                    text-align: center;
                }

                /* MAIN (placeholder) */
                .main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* ARTIFACTS (placeholder) */
                .artifacts {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    padding: var(--spacing--sm);
                }
                .placeholder {
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                }
            `}</style>
        </div>
    );
}
```

- [ ] **Step 2: Visually verify the sub-sidebar**

Navigate to `http://localhost:3000/prototypes/giulio/n8n-vision-may-2026`, click **Marketing Automation**, and take a screenshot.

Expected:

- Sub-sidebar shows: `← Back`, a `📁 Marketing Automation` header, `⊕ New chat`, then a `TODAY` group with one chat (`Set up weekly insight pipeline`) and a `YESTERDAY` group with one chat (`Draft Q3 campaign brief`)
- Clicking a chat highlights it (greyer background, medium weight). Clicking `New chat` removes the highlight
- Click **Internal Tools** in the main sidebar: sub-sidebar shows `No chats yet`

If browser MCPs are blocked, ask the user to refresh and confirm.

- [ ] **Step 3: Lint check**

```bash
pnpm lint
```

- [ ] **Step 4: Commit**

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx
git commit -m "✨ Build project view sub-sidebar with chat list"
```

---

## Task 4: Main area — top bar, empty state, composer

**Files:**

- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`

- [ ] **Step 1: Add composer state and import**

In `project-view.tsx`, add to the existing imports:

```tsx
import { Composer } from "./composer";
```

Add a new local state next to `selectedChatId`:

```tsx
const [composerValue, setComposerValue] = useState("");
```

Add this derived value after the `chatsByGroup` map:

```tsx
const selectedChat = project.chats.find((c) => c.id === selectedChatId) ?? null;
const headerTitle = selectedChat?.title ?? project.name;
```

- [ ] **Step 2: Replace the placeholder `<main>` with the real top bar + empty state + composer**

Replace this block:

```tsx
<main className="main">
    <p className="placeholder">Main — {project.name}</p>
</main>
```

With:

```tsx
<div className="main">
    <div className="top-bar">
        <span className="header-title">{headerTitle}</span>
    </div>

    <div className="content">
        <div className="empty-state">
            <h1 className="project-name-large">{project.name}</h1>
            <p className="project-description">{project.description}</p>
            <Composer
                placeholder="Send a message..."
                leftButton="paperclip"
                showAgentSelect={false}
                value={composerValue}
                onChange={setComposerValue}
            />
        </div>
    </div>
</div>
```

- [ ] **Step 3: Replace the `.main` styles with the real ones**

In the `<style jsx>` block, remove the placeholder `.main { ... }` rule and replace with:

```css
.main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.top-bar {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 var(--spacing--xs);
    border-bottom: 1px solid
        var(--border-color--light, var(--color--neutral-150));
    flex-shrink: 0;
}
.header-title {
    font-size: var(--font-size--xs);
    color: var(--color--neutral-700);
    padding-left: var(--spacing--2xs);
}

.content {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing--sm);
    padding: var(--spacing--xl);
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
}
.project-name-large {
    font-size: 22px;
    font-weight: var(--font-weight--bold);
    color: var(--color--neutral-800);
    margin: 0;
}
.project-description {
    color: var(--color--neutral-500);
    font-size: var(--font-size--sm);
    text-align: center;
    margin: 0 0 var(--spacing--xs);
    max-width: 480px;
}
```

- [ ] **Step 4: Visually verify the empty state**

Navigate, click **Marketing Automation**, take a screenshot.

Expected:

- A 48px top bar shows `Marketing Automation` (because no chat is selected yet)
- The center of the page shows the project name as a 22px heading, the description below it in muted grey, and the composer beneath
- Typing in the composer updates the value (verify by typing and seeing the text appear)

If browser MCPs are blocked, ask the user to refresh and confirm.

- [ ] **Step 5: Lint check**

```bash
pnpm lint
```

- [ ] **Step 6: Commit**

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx
git commit -m "✨ Add project main area with empty state and composer"
```

---

## Task 5: Main area — render selected chat thread

**Files:**

- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`

- [ ] **Step 1: Add icons for the thread renderer**

Extend the lucide imports in `project-view.tsx` to include:

```tsx
import {
    ArrowLeft,
    Folder,
    Plus,
    MoreHorizontal,
    Check,
    Loader2,
    ChevronRight,
    Copy,
    RefreshCw,
} from "lucide-react";
```

Add the type-only import alongside the data import:

```tsx
import {
    PROJECTS,
    type Chat,
    type ConversationMessage,
    type Project,
} from "./projects-data";
```

- [ ] **Step 2: Add a `ConversationThread` component below `ProjectView` (same file)**

Append at the bottom of `project-view.tsx`:

```tsx
interface ConversationThreadProps {
    messages: ConversationMessage[];
}

function ConversationThread({ messages }: ConversationThreadProps) {
    return (
        <div className="thread n8n-scrollbar">
            <div className="thread-inner">
                {messages.map((msg, idx) =>
                    msg.role === "user" ? (
                        <div className="user-msg" key={idx}>
                            {msg.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    ) : (
                        <div className="assistant-msg" key={idx}>
                            {msg.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}

                            {msg.steps && (
                                <div className="steps">
                                    {msg.steps.map((step, i) => (
                                        <div
                                            className={`step ${step.status}`}
                                            key={i}
                                        >
                                            {step.status === "done" ? (
                                                <Check />
                                            ) : (
                                                <Loader2 className="spin" />
                                            )}
                                            <span>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.agentCard && (
                                <button className="agent-card">
                                    <span className="agent-card-icon">
                                        {msg.agentCard.icon}
                                    </span>
                                    <span className="agent-card-info">
                                        <span className="agent-card-name">
                                            {msg.agentCard.name}
                                        </span>
                                        <span className="agent-card-meta">
                                            {msg.agentCard.meta}
                                        </span>
                                    </span>
                                    <ChevronRight />
                                </button>
                            )}

                            <div className="msg-actions">
                                <button>
                                    <Copy />
                                </button>
                                <button>
                                    <RefreshCw />
                                </button>
                                <button>
                                    <MoreHorizontal />
                                </button>
                            </div>
                        </div>
                    ),
                )}
            </div>

            <style jsx>{`
                .thread {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--spacing--lg) var(--spacing--xl);
                }
                .thread-inner {
                    max-width: 720px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                }
                .user-msg {
                    align-self: flex-end;
                    max-width: 80%;
                    padding: var(--spacing--xs) var(--spacing--sm);
                    background-color: var(--color--neutral-100);
                    border-radius: var(--radius--md);
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 20px;
                }
                .user-msg p {
                    margin: 0;
                }
                .assistant-msg {
                    align-self: flex-start;
                    max-width: 80%;
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 22px;
                }
                .assistant-msg p {
                    margin: 0;
                }
                .steps {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: var(--spacing--xs) 0;
                }
                .step {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    font-size: 14px;
                    color: var(--color--neutral-700);
                }
                .step :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .step.done :global(svg) {
                    color: var(--color--neutral-700);
                }
                .step.pending :global(svg.spin) {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .agent-card {
                    width: 100%;
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    gap: var(--spacing--xs);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    margin-top: var(--spacing--sm);
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background: white;
                    border-radius: var(--radius--md);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .agent-card:hover {
                    background-color: var(--color--neutral-50);
                }
                .agent-card-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius--3xs);
                    background-color: var(--color--neutral-100);
                    font-size: 16px;
                }
                .agent-card-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .agent-card-name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .agent-card-meta {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-500);
                }
                .agent-card :global(svg) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-400);
                }

                .msg-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    margin-top: var(--spacing--xs);
                }
                .msg-actions button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .msg-actions button:hover {
                    background-color: var(--color--neutral-100);
                }
                .msg-actions :global(svg) {
                    width: 14px;
                    height: 14px;
                }
            `}</style>
        </div>
    );
}
```

- [ ] **Step 3: Branch the main area on `selectedChat`**

Replace the existing `<div className="content"> ... </div>` block in the main area with:

```tsx
<div className="content">
    {selectedChat?.thread ? (
        <ConversationThread messages={selectedChat.thread} />
    ) : (
        <div className="empty-state">
            <h1 className="project-name-large">
                {selectedChat ? selectedChat.title : project.name}
            </h1>
            {!selectedChat && (
                <p className="project-description">{project.description}</p>
            )}
            <Composer
                placeholder="Send a message..."
                leftButton="paperclip"
                showAgentSelect={false}
                value={composerValue}
                onChange={setComposerValue}
            />
        </div>
    )}

    {selectedChat?.thread && (
        <div className="composer-pin">
            <Composer
                placeholder="Send a message..."
                leftButton="paperclip"
                showAgentSelect={false}
                value={composerValue}
                onChange={setComposerValue}
            />
        </div>
    )}
</div>
```

- [ ] **Step 4: Add the `composer-pin` style to the main `<style jsx>` block**

Add inside the existing styled-jsx (next to `.empty-state`):

```css
.composer-pin {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    padding: var(--spacing--md) var(--spacing--xl);
    border-top: 1px solid
        var(--border-color--light, var(--color--neutral-150));
    background-color: var(--color--background-base);
}
```

- [ ] **Step 5: Visually verify the thread**

Navigate to **Marketing Automation**. The empty-state composer should be visible (no chat selected). Click `Set up weekly insight pipeline` in the sub-sidebar. Take a screenshot.

Expected:

- Top bar now shows the chat title
- The main area shows the user message bubble, assistant text, the steps list with three checkmarks and one spinner, the `Insight pipeline` agent card, and a row of action icons
- The composer is pinned to the bottom of the main area, with a top divider
- Click `Draft Q3 campaign brief` (no thread): shows centered composer with the chat title as a heading
- Click `New chat`: returns to project-name + description + composer empty state

If browser MCPs are blocked, ask the user to refresh and confirm.

- [ ] **Step 6: Lint check**

```bash
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx
git commit -m "✨ Render selected chat thread in project view"
```

---

## Task 6: Artifacts panel (Connected resources, Documents, Knowledge)

**Files:**

- Create: `app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx`
- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`

The Settings section is added in Task 7. This task wires the three list-style sections, leaving room for Settings.

- [ ] **Step 1: Create `artifacts-panel.tsx`**

Save this to `app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx`:

```tsx
"use client";

import { useState, type ReactNode } from "react";
import {
    ChevronUp,
    ChevronDown,
    Plus,
    ArrowUpRight,
    Workflow,
    Bot,
    File,
    Link2,
    Database,
} from "lucide-react";
import type {
    KnowledgeItem,
    Project,
    Resource,
} from "./projects-data";

interface ArtifactsPanelProps {
    project: Project;
    onOpenSettings: () => void;
}

type SectionKey = "resources" | "documents" | "knowledge";

export function ArtifactsPanel({ project, onOpenSettings }: ArtifactsPanelProps) {
    const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
        resources: true,
        documents: true,
        knowledge: true,
    });

    const toggle = (key: SectionKey) =>
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <aside className="artifacts-panel">
            <div className="sections">
                <Section
                    label="Connected resources"
                    expanded={expanded.resources}
                    onToggle={() => toggle("resources")}
                    onAdd={() => console.debug("attach", "resources")}
                    items={project.resources.map((r) => (
                        <ArtifactItem
                            key={r.id}
                            icon={resourceIcon(r)}
                            name={r.name}
                            onClick={() => console.debug("open artifact", r)}
                        />
                    ))}
                />

                <Divider />

                <Section
                    label="Documents"
                    expanded={expanded.documents}
                    onToggle={() => toggle("documents")}
                    onAdd={() => console.debug("attach", "documents")}
                    items={project.documents.map((d) => (
                        <ArtifactItem
                            key={d.id}
                            icon={<File />}
                            name={d.name}
                            onClick={() => console.debug("open artifact", d)}
                        />
                    ))}
                />

                <Divider />

                <Section
                    label="Knowledge"
                    expanded={expanded.knowledge}
                    onToggle={() => toggle("knowledge")}
                    onAdd={() => console.debug("attach", "knowledge")}
                    items={project.knowledge.map((k) => (
                        <ArtifactItem
                            key={k.id}
                            icon={knowledgeIcon(k)}
                            name={k.name}
                            onClick={() => console.debug("open artifact", k)}
                        />
                    ))}
                />

                <Divider />

                <button
                    type="button"
                    className="settings-row"
                    onClick={onOpenSettings}
                >
                    <span className="settings-label">Settings</span>
                    <span className="settings-chevron">
                        <ChevronDown />
                    </span>
                </button>
            </div>

            <style jsx>{`
                .artifacts-panel {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    overflow-y: auto;
                }
                .sections {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--3xs) var(--spacing--3xs)
                        var(--spacing--sm);
                }
                .settings-row {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    min-height: 32px;
                    padding: 4px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .settings-row:hover {
                    background-color: var(--color--neutral-100);
                }
                .settings-label {
                    flex: 1;
                    text-align: left;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--color--neutral-800);
                }
                .settings-chevron {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    color: var(--color--neutral-500);
                }
                .settings-chevron :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </aside>
    );
}

interface SectionProps {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    onAdd: () => void;
    items: ReactNode[];
}

function Section({ label, expanded, onToggle, onAdd, items }: SectionProps) {
    return (
        <div className="section">
            <div className="header">
                <button
                    type="button"
                    className="header-btn"
                    onClick={onToggle}
                    aria-expanded={expanded}
                >
                    <span className="header-label">{label}</span>
                </button>
                <button
                    type="button"
                    className="add-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAdd();
                    }}
                    aria-label={`Add to ${label.toLowerCase()}`}
                >
                    <Plus />
                </button>
                <button
                    type="button"
                    className="chevron-btn"
                    onClick={onToggle}
                    aria-label={expanded ? "Collapse section" : "Expand section"}
                >
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {expanded && (
                <div className="items">
                    {items.length > 0 ? (
                        items
                    ) : (
                        <div className="empty">No items yet</div>
                    )}
                </div>
            )}

            <style jsx>{`
                .section {
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    display: flex;
                    align-items: center;
                    min-height: 32px;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .header:hover {
                    background-color: var(--color--neutral-100);
                }
                .header:hover .add-btn {
                    opacity: 1;
                }
                .header-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                    text-align: left;
                    padding: 0 4px;
                }
                .header-label {
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 400;
                    color: var(--color--neutral-800);
                }
                .add-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity var(--duration--snappy)
                            var(--easing--ease-out),
                        background-color var(--duration--snappy)
                            var(--easing--ease-out);
                }
                .add-btn:hover {
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-700);
                }
                .add-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .chevron-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border: 0;
                    background: transparent;
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    border-radius: 4px;
                }
                .chevron-btn:hover {
                    background-color: var(--color--neutral-150);
                }
                .chevron-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }

                .items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 0 16px 16px;
                }
                .empty {
                    color: var(--color--neutral-400);
                    font-size: 13px;
                    font-style: italic;
                    padding: 4px 0;
                }
            `}</style>
        </div>
    );
}

function Divider() {
    return (
        <>
            <hr className="divider" />
            <style jsx>{`
                .divider {
                    border: 0;
                    height: 1px;
                    background-color: var(--color--neutral-150);
                    margin: 0;
                }
            `}</style>
        </>
    );
}

interface ArtifactItemProps {
    icon: ReactNode;
    name: string;
    onClick: () => void;
}

function ArtifactItem({ icon, name, onClick }: ArtifactItemProps) {
    return (
        <button type="button" className="item" onClick={onClick}>
            <span className="icon">{icon}</span>
            <span className="name">{name}</span>
            <span className="arrow">
                <ArrowUpRight />
            </span>

            <style jsx>{`
                .item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border: 0;
                    background: transparent;
                    padding: 0;
                    cursor: pointer;
                    text-align: left;
                }
                .icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .name {
                    flex: 1;
                    font-family: var(--font-mono);
                    font-size: 14px;
                    line-height: 1.45;
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .arrow {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .arrow :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </button>
    );
}

function resourceIcon(resource: Resource): ReactNode {
    return resource.type === "agent" ? <Bot /> : <Workflow />;
}

function knowledgeIcon(item: KnowledgeItem): ReactNode {
    if (item.kind === "link") return <Link2 />;
    if (item.kind === "integration") return <Database />;
    return <File />;
}
```

> Note: each item subcomponent renders its own `<ItemStyles />` so the styled-jsx selectors are in the same component scope as the markup. This avoids cross-component leak and keeps the selectors valid.

- [ ] **Step 2: Mount `ArtifactsPanel` inside `ProjectView`**

In `project-view.tsx`, add the import:

```tsx
import { ArtifactsPanel } from "./artifacts-panel";
```

Replace the placeholder right column:

```tsx
<aside className="artifacts">
    <p className="placeholder">Artifacts panel</p>
</aside>
```

With:

```tsx
<ArtifactsPanel
    project={project}
    onOpenSettings={() => console.debug("open settings", project.id)}
/>
```

Task 7 will swap the `console.debug` callback for a real `setSettingsOpen(true)` once the dialog state is added.

Remove the now-unused `.artifacts` and `.placeholder` rules from the `<style jsx>` block in `project-view.tsx` (the panel manages its own width and styling).

- [ ] **Step 3: Visually verify the panel**

Navigate to **Marketing Automation**. Take a screenshot.

Expected:

- Right panel is 272px wide, white background, left border
- Three expanded sections in order: `Connected resources` (3 items: Insight pipeline, Recruitment tracker, Research recruitment screener), `Documents` (4 `.md` items), `Knowledge` (5 items: 2 PDFs, 2 links, 1 database/integration). Item names use mono font.
- Each section's `↗` arrow appears on every item
- Hovering a section header reveals the `+` button
- Clicking a section header collapses it and flips the chevron from `^` to `v`
- A `Settings` row sits below the dividers with a `v` chevron

Switch to **Internal Tools** and take a screenshot.

Expected:

- `Connected resources` and `Documents` show `No items yet` in muted italics
- `Knowledge` shows two items
- Hovering empty section headers still reveals `+`

If browser MCPs are blocked, ask the user to refresh and confirm.

- [ ] **Step 4: Lint check**

```bash
pnpm lint
```

- [ ] **Step 5: Commit**

```bash
git add \
    app/prototypes/giulio/n8n-vision-may-2026/_components/artifacts-panel.tsx \
    app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx
git commit -m "✨ Add artifacts panel with collapsible sections and items"
```

---

## Task 7: Settings dialog stub

**Files:**

- Modify: `app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx`

- [ ] **Step 1: Add the dialog imports and state**

In `project-view.tsx`, add the imports:

```tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
```

Inside `ProjectView`, add the state next to `composerValue`:

```tsx
const [settingsOpen, setSettingsOpen] = useState(false);
```

Update the `ArtifactsPanel` callback (introduced in Task 6 as a `console.debug`) to actually open the dialog:

```tsx
<ArtifactsPanel
    project={project}
    onOpenSettings={() => setSettingsOpen(true)}
/>
```

- [ ] **Step 2: Add the dialog JSX inside the project-view return**

Place the dialog as a sibling to the existing three regions, just before the closing `</div>` of `.project-view`:

```tsx
<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Project settings</DialogTitle>
            <DialogDescription>
                These changes are not persisted in this prototype.
            </DialogDescription>
        </DialogHeader>

        <div className="settings-fields">
            <div className="field">
                <Label htmlFor="project-name">Project name</Label>
                <Input id="project-name" defaultValue={project.name} />
            </div>
            <Button
                type="button"
                variant="destructive"
                onClick={() => console.debug("archive project", project.id)}
            >
                Archive project
            </Button>
        </div>

        <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => setSettingsOpen(false)}
            >
                Cancel
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

- [ ] **Step 3: Add styles for the dialog field stack**

Append to the existing `<style jsx>` block in `project-view.tsx`:

```css
.settings-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--md);
    padding: var(--spacing--xs) 0;
}
.field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--3xs);
}
```

- [ ] **Step 4: Verify the shadcn imports resolve**

```bash
ls components/shadcn/dialog.tsx components/shadcn/input.tsx components/shadcn/button.tsx components/shadcn/label.tsx
```

Expected: all four files exist. If `label.tsx` is missing, install it:

```bash
npx shadcn@latest add label
```

(This is the project's normal procedure for new shadcn components.)

- [ ] **Step 5: Visually verify the dialog**

Navigate to a project, click the `Settings` row in the artifacts panel. Take a screenshot of the open dialog.

Expected:

- Modal opens with title `Project settings`, a description line, a labelled `Project name` input pre-filled with the project name, and a destructive `Archive project` button
- Footer has a single `Cancel` button
- Clicking Cancel closes the dialog
- Clicking outside the dialog also closes it
- No console errors

If browser MCPs are blocked, ask the user to refresh and confirm.

- [ ] **Step 6: Lint check**

```bash
pnpm lint
```

- [ ] **Step 7: Commit**

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/project-view.tsx
git commit -m "✨ Add stub settings dialog for project view"
```

---

## Task 8: End-to-end verification

This task does not modify code — it walks through every spec scenario, records issues, and produces fixes if needed.

- [ ] **Step 1: Run a clean build**

```bash
pnpm build
```

Expected: build succeeds. If it fails, inspect the error, fix in the relevant file, re-run.

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Expected: no errors. Fix any reported issues before continuing.

- [ ] **Step 3: Walk through the spec's verification scenarios**

For each scenario below, navigate as described and take a screenshot. If anything is wrong, fix it and re-run.

1. From the home screen, click `Marketing Automation` in the sidebar → enters project view, all three regions populated, artifacts panel matches Figma rich state
2. Click `New chat` in the sub-sidebar → main returns to project name + description + composer
3. Click `Set up weekly insight pipeline` → top bar updates, thread renders, composer pinned
4. Click `Back` → returns to default screen layout (sidebar + Overview screen)
5. From a project, click `AI Assistant` in the sidebar → exits project, AI Assistant fullscreen opens
6. Click `Settings` row in artifacts panel → dialog opens; Cancel closes it
7. Hover any section header in the artifacts panel → `+` button reveals; click toggles section
8. Switch to `Internal Tools` (no chats, no Connected resources, no Documents) → sub-sidebar shows `No chats yet`; the two empty sections show `No items yet`; Knowledge has 2 items
9. Sidebar `Projects` row is highlighted (active styling) only while in that project's view; clicking another project switches active highlight
10. The pre-existing flows still work: Overview screen, Personal screen, Settings screen, AI Assistant, agent chat — none should be regressed by the new state in `app-layout.tsx`

- [ ] **Step 4: Final commit if any fixes were made**

If Step 3 surfaced fixes:

```bash
git add app/prototypes/giulio/n8n-vision-may-2026/_components/
git commit -m "🐛 Polish project view based on end-to-end verification"
```

If no fixes were needed, skip the commit.

- [ ] **Step 5: Notify user**

Report to the user:

- Project view is feature-complete per the spec
- Which scenarios passed
- Any deferred polish items observed during verification (e.g. visual mismatches against the Figma) that are out of scope for v1, surfaced as a list rather than acted on

---

## Spec coverage check (post-write self-review)

| Spec section | Implementing task |
|---|---|
| Architecture: fullscreen takeover, `activeProjectId` in `AppLayout` | Task 2 |
| Sidebar wiring: typed PROJECTS, `onProjectClick`, `active` flag | Task 2 |
| Component shape: `ProjectView` composing sub-sidebar + main + artifacts panel | Tasks 2-7 |
| Mock data file with all four projects and rich Marketing thread | Task 1 |
| Sub-sidebar (back, project header, new chat, chat list) | Task 3 |
| Main: top bar, empty state, project name/description, composer | Task 4 |
| Main: thread rendering with steps + agent card + msg actions | Task 5 |
| Artifacts panel: Connected resources / Documents / Knowledge / Settings | Tasks 6 & 7 |
| Section collapse + hover-revealed `+` | Task 6 |
| Empty section state | Task 6 |
| Settings dialog (stub) | Task 7 |
| End-to-end verification | Task 8 |
