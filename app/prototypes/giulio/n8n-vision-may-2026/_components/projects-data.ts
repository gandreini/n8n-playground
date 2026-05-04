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
    ...(
        [
            ["personal-tasks", "Personal tasks", "Day-to-day personal todos."],
            ["side-projects", "Side projects", "Things you tinker with after hours."],
            ["design-system", "Design system", "Tokens, components and patterns."],
            ["user-research", "User research", "Studies, interviews and synthesis."],
            ["backend-services", "Backend services", "Core services that power the product."],
            ["mobile-apps", "Mobile apps", "iOS + Android client work."],
            ["api-gateway", "API gateway", "Routing, rate-limiting and auth at the edge."],
            ["auth-service", "Auth service", "Identity, sessions and SSO."],
            ["billing-system", "Billing system", "Subscriptions, invoicing and dunning."],
            ["notifications", "Notifications platform", "Email, push and in-app delivery."],
            ["analytics-pipeline", "Analytics pipeline", "Event ingest, transforms and warehouse."],
            ["search-service", "Search service", "Full-text search and ranking."],
            ["cache-layer", "Cache layer", "Redis tiers and CDN caching strategy."],
            ["db-migrations", "Database migrations", "Schema evolution and backfills."],
            ["identity-access", "Identity & access", "RBAC, audit logs and policy."],
            ["webhook-ingest", "Webhook ingest", "Inbound webhook handling and retries."],
            ["observability", "Observability stack", "Metrics, logs and traces."],
            ["edge-functions", "Edge functions", "Edge runtime workloads."],
            ["internal-sdk", "Internal SDK", "Shared client libraries."],
            ["mobile-design-system", "Mobile design system", "Cross-platform components."],
            ["storefront", "Storefront", "Customer-facing storefront app."],
            ["admin-tools", "Admin tools", "Internal admin dashboards."],
        ] as const
    ).map(
        ([id, name, description]): Project => ({
            id,
            name,
            description,
            resources: [],
            documents: [],
            knowledge: [],
            chats: [],
        })
    ),
];
