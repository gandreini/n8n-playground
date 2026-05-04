export type ChatGroup = "today" | "yesterday" | "thisWeek" | "older";

export interface ConversationMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export interface Conversation {
    id: string;
    title: string;
    group: ChatGroup;
    messages: ConversationMessage[];
}

export const CONVERSATIONS: Conversation[] = [
    {
        id: "c1",
        title: "Daily Helsinki news report automatically",
        group: "today",
        messages: [
            {
                id: "c1-1",
                role: "user",
                content:
                    "Can you create a workflow that grabs the top Helsinki news every morning at 8AM and sends it to my Slack?",
            },
            {
                id: "c1-2",
                role: "assistant",
                content:
                    "Sure! I'll set up a workflow that:\n\n1. Triggers daily at 8AM\n2. Pulls the latest Helsinki news from Yle.fi RSS\n3. Filters for top 5 stories\n4. Posts them as a formatted message to your Slack #news channel\n\nGiving it a moment to wire up the credentials…",
            },
            {
                id: "c1-3",
                role: "assistant",
                content:
                    "Done! Your \"Helsinki Daily News\" workflow is now active. First run scheduled for tomorrow at 8AM. Want to test it now?",
            },
        ],
    },
    {
        id: "c2",
        title: "Build an agent for competitor research",
        group: "yesterday",
        messages: [
            {
                id: "c2-1",
                role: "user",
                content:
                    "I need an agent that monitors what our top 5 competitors are launching every week and gives me a summary.",
            },
            {
                id: "c2-2",
                role: "assistant",
                content:
                    "Got it. I'll build a Competitor Research agent that:\n\n• Monitors press releases, blog posts, and product pages\n• Uses Firecrawl, HackerNews, and ProductHunt as sources\n• Summarizes findings every Monday at 9AM\n• Posts a digest to your inbox + Slack",
            },
            {
                id: "c2-3",
                role: "user",
                content: "Perfect. Add Notion, Linear, and Asana to the watchlist.",
            },
            {
                id: "c2-4",
                role: "assistant",
                content:
                    "Added. Your agent is configured to track 8 competitors total. First weekly digest goes out Monday at 9AM.",
            },
        ],
    },
    {
        id: "c3",
        title: "Workflow execution failures last week",
        group: "thisWeek",
        messages: [
            {
                id: "c3-1",
                role: "user",
                content: "How many workflows failed last week and which ones?",
            },
            {
                id: "c3-2",
                role: "assistant",
                content:
                    "Last week (Apr 27 – May 3):\n\n• 30 failed executions out of 2,259 total\n• Failure rate: 1.3% (down 0.2pp from prior week)\n\nTop failing workflows:\n1. Lead scoring (12 failures) — Salesforce auth expired\n2. Invoice sync (8 failures) — Stripe rate limit\n3. Slack notifications (6 failures) — Channel deleted\n\nWant me to fix any of these?",
            },
            {
                id: "c3-3",
                role: "user",
                content:
                    "Yes, refresh the Salesforce auth and update the Slack channel.",
            },
            {
                id: "c3-4",
                role: "assistant",
                content:
                    "On it. Refreshing Salesforce credentials and updating the Slack workflow to use #notifications-v2 instead of the deleted channel.",
            },
        ],
    },
    {
        id: "c4",
        title: "Create a workflow + agent for invoicing",
        group: "older",
        messages: [
            {
                id: "c4-1",
                role: "user",
                content:
                    "Build me a system: a workflow that pulls billable hours from Toggl every Friday, AND an agent that drafts the invoice and sends it to clients for review.",
            },
            {
                id: "c4-2",
                role: "assistant",
                content:
                    "Two-part system. I'll set up:\n\n**Workflow: \"Weekly Billable Hours Sync\"**\n• Triggers Fri 4PM\n• Pulls hours from Toggl per project\n• Writes to a \"Pending Invoices\" data table\n\n**Agent: \"Invoice Drafter\"**\n• Reads Pending Invoices table\n• Drafts invoice in your template\n• Asks you to review before sending via Stripe",
            },
            {
                id: "c4-3",
                role: "user",
                content:
                    "Sounds good. The agent should also flag if hours look unusually high or low compared to the past 4 weeks.",
            },
            {
                id: "c4-4",
                role: "assistant",
                content:
                    "Added anomaly detection. Agent will flag invoices that deviate more than 25% from the 4-week trailing average. Both pieces are deployed.",
            },
        ],
    },
    {
        id: "c5",
        title: "Why did my Slack notification fail?",
        group: "older",
        messages: [
            {
                id: "c5-1",
                role: "user",
                content:
                    "My Slack notification workflow has been failing every morning. Can you check?",
            },
            {
                id: "c5-2",
                role: "assistant",
                content:
                    "Looking into it… The workflow is failing at the \"Send Message\" node with error: `channel_not_found`. The channel #marketing-alerts referenced in the workflow no longer exists — it looks like it was renamed to #marketing-eng-alerts on April 22.\n\nWant me to update the channel reference?",
            },
            { id: "c5-3", role: "user", content: "Yes please." },
            {
                id: "c5-4",
                role: "assistant",
                content:
                    "Updated. The workflow now points to #marketing-eng-alerts. Last 3 manual test runs all succeeded.",
            },
        ],
    },
    {
        id: "c6",
        title: "Build an automation that scrapes Hacker News",
        group: "older",
        messages: [
            {
                id: "c6-1",
                role: "user",
                content:
                    "Can you build an automation that scrapes the top stories from Hacker News every hour and saves them to a Notion database if they mention AI agents?",
            },
            {
                id: "c6-2",
                role: "assistant",
                content:
                    "Sure! Setting up:\n\n• Hourly trigger\n• HN top stories API\n• Filter: title or comments mention \"AI agent\", \"agentic\", or \"autonomous agent\"\n• Save to Notion DB \"AI Agents Watch\" with title, link, score, comment count",
            },
            {
                id: "c6-3",
                role: "assistant",
                content:
                    "Done. Workflow is live. Caught 3 matching stories in the last test run.",
            },
        ],
    },
    {
        id: "c7",
        title: "Set up a recruiting sourcer agent",
        group: "older",
        messages: [
            {
                id: "c7-1",
                role: "user",
                content:
                    "I need an agent that finds matching candidates for a job description I give it. It should search public profiles and rank them.",
            },
            {
                id: "c7-2",
                role: "assistant",
                content:
                    "I'll create a \"Recruiting Sourcer\" agent. Give me a job description and it'll search public profiles, score on title/skills/location match, and return a ranked shortlist with reasoning.",
            },
            {
                id: "c7-3",
                role: "user",
                content:
                    "Senior frontend engineer, React + TypeScript, Berlin or remote EU.",
            },
            {
                id: "c7-4",
                role: "assistant",
                content:
                    "Agent is now configured for that profile and will run on demand. Top 10 candidates will appear in your dashboard once you trigger it.",
            },
        ],
    },
    {
        id: "c8",
        title: "Why are my workflow runs slow this week?",
        group: "older",
        messages: [
            {
                id: "c8-1",
                role: "user",
                content: "Workflows feel sluggish this week. What's going on?",
            },
            {
                id: "c8-2",
                role: "assistant",
                content:
                    "Avg run time jumped from 8.2s last week to 11.08s this week (+35%). The slowdown is concentrated in workflows that hit the Postgres warehouse. Looks like a missing index after Tuesday's schema migration.\n\nThe `events` table has a new `agent_id` column that's being filtered without an index. I can either add the index or rewrite the offending queries to avoid the filter.",
            },
            { id: "c8-3", role: "user", content: "Add the index." },
            {
                id: "c8-4",
                role: "assistant",
                content:
                    "Index `idx_events_agent_id` queued. ETA ~3 minutes for the build to complete on the 4M-row table.",
            },
        ],
    },
    {
        id: "c9",
        title: "Workflow that summarizes my emails",
        group: "older",
        messages: [
            {
                id: "c9-1",
                role: "user",
                content:
                    "Build me a workflow that gives me a daily summary of my unread Gmail every morning.",
            },
            {
                id: "c9-2",
                role: "assistant",
                content:
                    "Building \"Daily Email Summary\":\n\n• 7AM trigger\n• Fetches unread Gmail since 24h ago\n• Groups by sender, summarizes important ones\n• Posts digest to your Slack DM",
            },
            {
                id: "c9-3",
                role: "assistant",
                content: "Live. First summary ready tomorrow morning.",
            },
        ],
    },
    {
        id: "c10",
        title: "Help me set up a customer support agent",
        group: "older",
        messages: [
            {
                id: "c10-1",
                role: "user",
                content:
                    "I want an agent that handles tier-1 support tickets. It should answer common questions, escalate hard ones, and tag tickets in Zendesk.",
            },
            {
                id: "c10-2",
                role: "assistant",
                content:
                    "Customer Support agent setup:\n\n• Reads new tickets from Zendesk every 2 min\n• Uses your help center as knowledge base\n• Auto-replies to FAQ matches with confidence > 80%\n• Tags + escalates anything else to your team\n\nDeploy?",
            },
            {
                id: "c10-3",
                role: "user",
                content: "Deploy it. But cap auto-replies at 50/hour for now.",
            },
            {
                id: "c10-4",
                role: "assistant",
                content:
                    "Deployed with rate limit. Agent is live and processing the inbox.",
            },
        ],
    },
    {
        id: "c11",
        title: "Heads up: webhook errors detected",
        group: "older",
        messages: [
            {
                id: "c11-1",
                role: "assistant",
                content:
                    "Heads up — I noticed your \"GitHub PR Reviews\" workflow has been receiving webhook events that fail to parse. 14 failures in the last hour, all from the same PR (#4291) which has an unusually large diff (8,000+ lines).\n\nThe workflow is hitting the JSON payload size limit. Want me to:\n\n1. Increase the payload limit on that webhook\n2. Skip large PRs (>5,000 lines)\n3. Process them via a different code path that streams the diff",
            },
            { id: "c11-2", role: "user", content: "Option 3, streaming." },
            {
                id: "c11-3",
                role: "assistant",
                content:
                    "Switching to streaming. The 14 failed events have been re-queued and processed successfully.",
            },
        ],
    },
    {
        id: "c12",
        title: "How healthy is my n8n instance?",
        group: "older",
        messages: [
            {
                id: "c12-1",
                role: "user",
                content: "Give me a quick health summary of my n8n instance.",
            },
            {
                id: "c12-2",
                role: "assistant",
                content:
                    "**Instance Health — All Good ✅**\n\n• 2,259 production executions this week (-8.65%)\n• 1.3% failure rate (-0.2pp)\n• Avg run time: 11.08s (+0.62s)\n• 38h time saved (-3h)\n\n**Watch list:**\n• 3 workflows haven't run in 30+ days — possibly orphaned\n• Postgres connection pool hit 85% twice yesterday — consider scaling\n\nNo critical issues. Want details on the watch list items?",
            },
        ],
    },
];

export const CHAT_GROUP_LABELS: Record<ChatGroup, string> = {
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This week",
    older: "Older",
};

export const CHAT_GROUP_ORDER: ChatGroup[] = [
    "today",
    "yesterday",
    "thisWeek",
    "older",
];
