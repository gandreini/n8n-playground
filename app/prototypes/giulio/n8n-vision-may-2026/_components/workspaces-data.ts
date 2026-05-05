import type { Workflow } from "@/lib/store";

export interface Workspace {
    id: string;
    name: string;
    avatar: string;
    bg: string;
    members: number;
    /** Project names that belong to this workspace (matched against PROJECTS[].name) */
    projects: string[];
    /** Full workflow records for this workspace (rendered in sidebar + main area) */
    workflows: Workflow[];
    /** Agent ids that belong to this workspace (matched against AGENTS[].id) */
    agentIds: string[];
}

const day = 24 * 60 * 60 * 1000;

interface WfOpts {
    status?: "draft" | "published";
    daysAgo?: number;
    project?: string;
    tags?: string[];
    linkedCount?: number;
}

function wf(id: string, name: string, opts: WfOpts = {}): Workflow {
    const ts = new Date(Date.now() - (opts.daysAgo ?? 1) * day);
    return {
        id,
        name,
        nodes: [],
        connections: [],
        status: opts.status ?? "published",
        lastUpdated: ts,
        createdAt: ts,
        project: opts.project,
        tags: opts.tags,
        linkedCount: opts.linkedCount,
    };
}

export const WORKSPACES: Workspace[] = [
    {
        id: "personal",
        name: "Personal",
        avatar: "RJ",
        bg: "var(--color--orange-200)",
        members: 1,
        projects: ["Personal tasks", "Side projects"],
        workflows: [
            wf("p-w1", "Daily news digest", {
                status: "published",
                daysAgo: 1,
                project: "Personal tasks",
                linkedCount: 1,
            }),
            wf("p-w2", "Receipt sorter", {
                status: "draft",
                daysAgo: 6,
                project: "Personal tasks",
            }),
        ],
        agentIds: ["darwin", "data-analyst"],
    },
    {
        id: "design",
        name: "Design",
        avatar: "🎨",
        bg: "var(--color--neutral-100)",
        members: 12,
        projects: ["Design system", "User research"],
        workflows: [
            wf("d-w1", "Figma export", {
                status: "published",
                daysAgo: 2,
                project: "Design system",
                linkedCount: 4,
            }),
            wf("d-w2", "Screenshot diff", {
                status: "published",
                daysAgo: 9,
                project: "Design system",
            }),
        ],
        agentIds: ["ux-auditor"],
    },
    {
        id: "engineering",
        name: "Engineering",
        avatar: "🛠️",
        bg: "var(--color--neutral-100)",
        members: 87,
        projects: [
            "Backend services",
            "Mobile apps",
            "API gateway",
            "Auth service",
            "Billing system",
            "Notifications platform",
            "Analytics pipeline",
            "Search service",
            "Cache layer",
            "Database migrations",
            "Identity & access",
            "Webhook ingest",
            "Observability stack",
            "Edge functions",
            "Internal SDK",
            "Mobile design system",
            "Storefront",
            "Admin tools",
        ],
        workflows: [
            wf("e-w1", "PR review bot", {
                status: "published",
                daysAgo: 0,
                project: "Backend services",
                linkedCount: 12,
            }),
            wf("e-w2", "Deploy notifications", {
                status: "published",
                daysAgo: 1,
                project: "Backend services",
                linkedCount: 6,
            }),
            wf("e-w3", "CI status digest", {
                status: "published",
                daysAgo: 1,
                project: "Backend services",
            }),
            wf("e-w4", "Failed test alerts", {
                status: "published",
                daysAgo: 2,
                project: "Backend services",
            }),
            wf("e-w5", "Code coverage tracker", {
                status: "draft",
                daysAgo: 3,
                project: "Backend services",
            }),
            wf("e-w6", "Release notes draft", {
                status: "published",
                daysAgo: 4,
                project: "Backend services",
            }),
            wf("e-w7", "Dependency update runner", {
                status: "published",
                daysAgo: 5,
                project: "Backend services",
                linkedCount: 3,
            }),
            wf("e-w8", "Security scan trigger", {
                status: "published",
                daysAgo: 6,
                project: "Auth service",
            }),
            wf("e-w9", "Issue triager", {
                status: "published",
                daysAgo: 7,
                project: "Backend services",
            }),
            wf("e-w10", "Daily standup digest", {
                status: "published",
                daysAgo: 8,
                project: "Backend services",
            }),
            wf("e-w11", "On-call rotation reminder", {
                status: "published",
                daysAgo: 10,
                project: "Observability stack",
            }),
            wf("e-w12", "Production error summary", {
                status: "published",
                daysAgo: 12,
                project: "Observability stack",
                linkedCount: 8,
            }),
            wf("e-w13", "Slow query report", {
                status: "draft",
                daysAgo: 14,
                project: "Database migrations",
            }),
            wf("e-w14", "Database backup check", {
                status: "published",
                daysAgo: 16,
                project: "Database migrations",
            }),
            wf("e-w15", "Stale branch cleanup", {
                status: "draft",
                daysAgo: 18,
                project: "Backend services",
            }),
            wf("e-w16", "Sentry to Linear sync", {
                status: "published",
                daysAgo: 21,
                project: "Observability stack",
                linkedCount: 5,
            }),
            wf("e-w17", "Build time tracker", {
                status: "published",
                daysAgo: 24,
                project: "Backend services",
            }),
            wf("e-w18", "Dependabot summary", {
                status: "published",
                daysAgo: 28,
                project: "Backend services",
            }),
            wf("e-w19", "Postmortem template generator", {
                status: "draft",
                daysAgo: 32,
                project: "Observability stack",
            }),
            wf("e-w20", "Latency regression alert", {
                status: "published",
                daysAgo: 38,
                project: "Observability stack",
            }),
            wf("e-w21", "Cost anomaly detector", {
                status: "published",
                daysAgo: 45,
                project: "Analytics pipeline",
            }),
            wf("e-w22", "License compliance check", {
                status: "published",
                daysAgo: 60,
                project: "Backend services",
            }),
        ],
        agentIds: [
            "code-reviewer",
            "bug-triager",
            "release-notes",
            "incident-responder",
            "dep-upgrader",
            "perf-watchdog",
            "security-scanner",
            "oncall-summarizer",
            "schema-doc",
            "flaky-test-hunter",
            "feature-flag-ranger",
        ],
    },
];
