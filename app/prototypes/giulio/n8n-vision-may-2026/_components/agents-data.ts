export interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    avatarBg: string;
}

export const AGENTS: Agent[] = [
    {
        id: "darwin",
        name: "Darwin",
        description: "Research assistant for new feature ideas",
        avatar: "🐒",
        avatarBg: "#1F1F1F",
    },
    {
        id: "data-analyst",
        name: "Data Analyst",
        description:
            "Explores tables, answers questions with SQL, and documents from Snowflake",
        avatar: "📈",
        avatarBg: "#FEE2E2",
    },
    {
        id: "ux-auditor",
        name: "UX Auditor",
        description: "Reviews flows and surfaces accessibility + usability issues",
        avatar: "🔍",
        avatarBg: "#E0E7FF",
    },
    {
        id: "code-reviewer",
        name: "Code Reviewer",
        description: "Reviews PRs against your team's style guide and conventions",
        avatar: "👀",
        avatarBg: "#DCFCE7",
    },
    {
        id: "bug-triager",
        name: "Bug Triager",
        description: "Categorizes incoming GitHub issues and tags the right owner",
        avatar: "🪲",
        avatarBg: "#FEF3C7",
    },
    {
        id: "release-notes",
        name: "Release Notes Writer",
        description: "Drafts release notes from merged PRs and changelogs",
        avatar: "📝",
        avatarBg: "#E0F2FE",
    },
    {
        id: "incident-responder",
        name: "Incident Responder",
        description: "Pages the right oncall, writes a status update, and starts the war room",
        avatar: "🚨",
        avatarBg: "#FEE2E2",
    },
    {
        id: "dep-upgrader",
        name: "Dependency Upgrader",
        description: "Reviews dependency updates and runs the test suite before merge",
        avatar: "📦",
        avatarBg: "#FFEDD5",
    },
    {
        id: "perf-watchdog",
        name: "Performance Watchdog",
        description: "Watches p95 latency and flags regressions on every deploy",
        avatar: "⚡",
        avatarBg: "#FEF3C7",
    },
    {
        id: "security-scanner",
        name: "Security Scanner",
        description: "Scans new commits for secrets and known vulnerabilities",
        avatar: "🔒",
        avatarBg: "#DCFCE7",
    },
    {
        id: "oncall-summarizer",
        name: "Oncall Summarizer",
        description: "Compiles a Monday digest of weekend alerts and toils",
        avatar: "📟",
        avatarBg: "#E0E7FF",
    },
    {
        id: "schema-doc",
        name: "Schema Doc Updater",
        description: "Keeps the API and DB schema docs in sync with the codebase",
        avatar: "📚",
        avatarBg: "#F3E8FF",
    },
    {
        id: "flaky-test-hunter",
        name: "Flaky Test Hunter",
        description: "Identifies flaky tests in CI and quarantines them automatically",
        avatar: "🧪",
        avatarBg: "#FCE7F3",
    },
    {
        id: "feature-flag-ranger",
        name: "Feature Flag Ranger",
        description: "Tracks stale feature flags and proposes cleanup PRs",
        avatar: "🚩",
        avatarBg: "#FEF3C7",
    },
];

export interface AgentSuggestion {
    id: string;
    name: string;
    description: string;
    avatar: string;
}

export const AGENT_SUGGESTIONS: AgentSuggestion[] = [
    {
        id: "seo-audit",
        name: "SEO Audit",
        description:
            "An SEO auditor. Give it a website URL and it crawls the pages, identifies issues, and…",
        avatar: "🔍",
    },
    {
        id: "recruiting-sourcer",
        name: "Recruiting Sourcer",
        description:
            "A recruiting sourcer. Give it a job description and it finds matching candidat…",
        avatar: "👋",
    },
    {
        id: "inbox-sorter",
        name: "Inbox Sorter",
        description:
            "Sort your inbox, classifying emails by sender and marking them as read when the…",
        avatar: "📥",
    },
];
