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

const COMPETITOR_RESEARCH_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "I need an agent that monitors what our top 5 competitors are launching every week and gives me a summary.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Got it. I'll build a Competitor Research agent that monitors press releases, blog posts, and product pages, uses Firecrawl, HackerNews, and ProductHunt as sources, summarizes findings every Monday at 9AM, and posts a digest to your inbox + Slack.",
        ],
    },
    {
        role: "user",
        paragraphs: ["Perfect. Add Notion, Linear, and Asana to the watchlist."],
    },
    {
        role: "assistant",
        paragraphs: [
            "Added. Your agent is configured to track 8 competitors total. First weekly digest goes out Monday at 9AM.",
        ],
    },
];

const EMAIL_SUMMARY_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "Build me a workflow that gives me a daily summary of my unread Gmail every morning.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Building \"Daily Email Summary\": 7AM trigger, fetches unread Gmail since 24h ago, groups by sender, summarizes important ones, and posts the digest to your Slack DM.",
        ],
    },
    {
        role: "assistant",
        paragraphs: ["Live. First summary ready tomorrow morning."],
    },
];

const INVOICING_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "Build me a system: a workflow that pulls billable hours from Toggl every Friday, AND an agent that drafts the invoice and sends it to clients for review.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Two-part system. I'll set up a workflow \"Weekly Billable Hours Sync\" that triggers Friday 4PM, pulls hours from Toggl per project, and writes to a \"Pending Invoices\" data table. Plus an agent \"Invoice Drafter\" that reads the Pending Invoices table, drafts the invoice in your template, and asks you to review before sending via Stripe.",
        ],
    },
    {
        role: "user",
        paragraphs: [
            "Sounds good. The agent should also flag if hours look unusually high or low compared to the past 4 weeks.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Added anomaly detection. Agent will flag invoices that deviate more than 25% from the 4-week trailing average. Both pieces are deployed.",
        ],
    },
];

const GENERIC_PROJECT_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "Catch me up on what's running in this project. Anything that needs my attention?",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Walking through the project now.",
            "One workflow is published and runs daily, one agent is set up but hasn't been triggered this week, and the docs were updated yesterday.",
        ],
        steps: [
            { label: "Reviewing workflows", status: "done" },
            { label: "Checking agent activity", status: "done" },
            { label: "Scanning recent docs", status: "done" },
        ],
        agentCard: {
            icon: "📋",
            name: "Project status digest",
            meta: "Updated · ready when you are",
        },
    },
    {
        role: "user",
        paragraphs: ["Why hasn't the agent run this week?"],
    },
    {
        role: "assistant",
        paragraphs: [
            "Its trigger is wired to a webhook that hasn't received any events since Friday. Want me to send a test event or check the upstream service?",
        ],
    },
];

const PERSONAL_TASKS_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "I keep forgetting recurring chores. Can you build me something that watches my Todoist and pings me on Slack 30 minutes before each deadline?",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Sure — I'll wire up a reminder workflow.",
            "It polls Todoist every 5 minutes, finds tasks due in the next 30 minutes, and sends a DM with the task name and due time.",
        ],
        steps: [
            { label: "Connecting Todoist", status: "done" },
            { label: "Connecting Slack", status: "done" },
            { label: "Scheduling 5-minute polling", status: "done" },
            { label: "Sending a test reminder", status: "done" },
        ],
        agentCard: {
            icon: "⏰",
            name: "Todoist reminder ping",
            meta: "Live · Every 5 minutes",
        },
    },
    {
        role: "user",
        paragraphs: [
            "Nice. Can it also include the project name in the message?",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Done — messages now read \"⏰ {task} ({project}) due in 30m\". The next reminder will use the new format.",
        ],
    },
];

const SUPPORT_AGENT_THREAD: ConversationMessage[] = [
    {
        role: "user",
        paragraphs: [
            "I want an agent that handles tier-1 support tickets. It should answer common questions, escalate hard ones, and tag tickets in Zendesk.",
        ],
    },
    {
        role: "assistant",
        paragraphs: [
            "Customer Support agent setup: reads new tickets from Zendesk every 2 min, uses your help center as knowledge base, auto-replies to FAQ matches with confidence > 80%, and tags + escalates anything else to your team. Deploy?",
        ],
    },
    {
        role: "user",
        paragraphs: ["Deploy it. But cap auto-replies at 50/hour for now."],
    },
    {
        role: "assistant",
        paragraphs: ["Deployed with rate limit. Agent is live and processing the inbox."],
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
            {
                id: "ai-c2",
                title: "Build an agent for competitor research",
                group: "yesterday",
                thread: COMPETITOR_RESEARCH_THREAD,
            },
            {
                id: "ai-c9",
                title: "Workflow that summarizes my emails",
                group: "previous",
                thread: EMAIL_SUMMARY_THREAD,
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
            {
                id: "ai-c4",
                title: "Create a workflow + agent for invoicing",
                group: "previous",
                thread: INVOICING_THREAD,
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
            {
                id: "ai-c10",
                title: "Help me set up a customer support agent",
                group: "previous",
                thread: SUPPORT_AGENT_THREAD,
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
    {
        id: "personal-tasks",
        name: "Personal tasks",
        description: "Day-to-day personal todos.",
        resources: [
            { id: "r1", type: "workflow", name: "Todoist reminder ping" },
        ],
        documents: [{ id: "d1", name: "WEEKLY_REVIEW.md" }],
        knowledge: [],
        chats: [
            {
                id: "pt-c1",
                title: "Slack reminders for Todoist deadlines",
                group: "today",
                thread: PERSONAL_TASKS_THREAD,
            },
            {
                id: "pt-c2",
                title: "Weekly grocery list from Notion",
                group: "yesterday",
            },
        ],
    },
    ...(
        [
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
            resources: [
                { id: `${id}-r1`, type: "workflow", name: `${name} sync` },
                { id: `${id}-r2`, type: "agent", name: `${name} assistant` },
            ],
            documents: [
                { id: `${id}-d1`, name: "README.md" },
                { id: `${id}-d2`, name: "NOTES.md" },
            ],
            knowledge: [
                { id: `${id}-k1`, name: "Internal docs", kind: "link" },
                { id: `${id}-k2`, name: "Reference.pdf", kind: "pdf" },
            ],
            chats: [
                {
                    id: `${id}-c1`,
                    title: `${name} status check`,
                    group: "today",
                    thread: GENERIC_PROJECT_THREAD,
                },
            ],
        })
    ),
];
