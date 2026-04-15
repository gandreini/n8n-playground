"use client";

import { useEffect, useRef, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    PanelLeftClose,
    PanelRightClose,
    Binoculars,
    FolderSync,
    Bot,
    Workflow,
    KeySquare,
    Database,
    ChartLine,
    RefreshCw,
    ListChecks,
    Map,
    ScrollText,
    Settings,
    File,
    ArrowUpRight,
    Link2,
} from "lucide-react";
import { N8nLogo } from "@/components/n8n/shared/n8n-logo";
import { PromptInput } from "@/components/n8n/shared/prompt-input";
import { cn } from "@/lib/utils";
import { usePulseChat, type ChatMessage } from "./use-pulse-chat";

// ─── Types ───

type Mode = "talk" | "write";

interface AgentSection {
    title: string;
    items: { name: string; icon: "file" | "link" | "app"; appIcon?: string }[];
}

const agentSections: AgentSection[] = [
    {
        title: "Memory",
        items: [
            { name: "PULSE.md", icon: "file" },
            { name: "MEMORY.md", icon: "file" },
            { name: "PROJECT.md", icon: "file" },
            { name: "DIARY.md", icon: "file" },
        ],
    },
    {
        title: "Knowledge",
        items: [
            { name: "guidelines.pdf", icon: "file" },
            { name: "AI_agent_building.pdf", icon: "file" },
            { name: "n8n-docs-html", icon: "link" },
            { name: "Notion Docs", icon: "link" },
            { name: "Airtable Design Team Base", icon: "app", appIcon: "🟨" },
        ],
    },
    { title: "Tools", items: [] },
    {
        title: "Skills",
        items: [
            { name: "BRAINSTORM.md", icon: "file" },
            { name: "COMPOUNDING_ENG.md", icon: "file" },
        ],
    },
    {
        title: "Connections",
        items: [
            { name: "Slack OAuth", icon: "app", appIcon: "🟣" },
            { name: "X APIs", icon: "app", appIcon: "✖" },
            { name: "Open AI - Api Key", icon: "app", appIcon: "🟢" },
            { name: "Airtable - Api Key", icon: "app", appIcon: "🟨" },
            { name: "Google Console", icon: "app", appIcon: "🔵" },
            { name: "Intercom", icon: "app", appIcon: "🔷" },
        ],
    },
];

// ─── Sidebar ───

function PulseSidebar() {
    return (
        <aside className="n8n-pulse-sidebar w-[280px] h-full flex flex-col bg-white p-4">
            <div className="flex flex-col flex-1 justify-between">
                {/* Top */}
                <div className="flex flex-col gap-6">
                    {/* Header: team select + collapse */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-between h-8 px-2 border border-[var(--color--black-alpha-200)] rounded-[var(--radius--3xs)] bg-white text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                                <span className="truncate">Design team</span>
                                <ChevronDown className="w-4 h-4 shrink-0 text-[var(--color--neutral-500)]" />
                            </button>
                            <PanelLeftClose className="w-4 h-4 text-[var(--color--neutral-500)] shrink-0 cursor-pointer" />
                        </div>
                        {/* n8n Pulse item */}
                        <div className="flex items-center gap-1 min-h-8 px-1 py-1 rounded-[var(--radius--3xs)] bg-[var(--color--neutral-125)]">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <N8nLogo size={20} />
                            </div>
                            <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                                n8n Pulse
                            </span>
                        </div>
                    </div>

                    {/* Pulse threads */}
                    <SidebarSection title="Pulse threads">
                        <SidebarItem
                            icon={<Binoculars className="w-4 h-4" />}
                            label="UXR automations"
                        />
                        <SidebarItem
                            icon={<FolderSync className="w-4 h-4" />}
                            label="Docs Linear issues sync"
                        />
                    </SidebarSection>

                    {/* Resources */}
                    <SidebarSection title="Resources">
                        <SidebarItem
                            icon={<Bot className="w-4 h-4" />}
                            label="Agents"
                        />
                        <SidebarItem
                            icon={<Workflow className="w-4 h-4" />}
                            label="Automations"
                        />
                        <SidebarItem
                            icon={<KeySquare className="w-4 h-4" />}
                            label="Connections"
                        />
                        <SidebarItem
                            icon={<Database className="w-4 h-4" />}
                            label="Data"
                        />
                    </SidebarSection>

                    {/* Activity */}
                    <SidebarSection title="Activity">
                        <SidebarItem
                            icon={<ChartLine className="w-4 h-4" />}
                            label="Insights"
                        />
                        <SidebarItem
                            icon={<RefreshCw className="w-4 h-4" />}
                            label="Executions"
                        />
                        <SidebarItem
                            icon={<ListChecks className="w-4 h-4" />}
                            label="Evals"
                        />
                        <SidebarItem
                            icon={<Map className="w-4 h-4" />}
                            label="Traces"
                        />
                        <SidebarItem
                            icon={<ScrollText className="w-4 h-4" />}
                            label="Logs"
                        />
                    </SidebarSection>
                </div>

                {/* Bottom: Settings */}
                <SidebarItem
                    icon={<Settings className="w-4 h-4" />}
                    label="Settings"
                />
            </div>
        </aside>
    );
}

function SidebarSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[length:var(--font-size--2xs)] font-[var(--font-weight--medium)] text-[color:var(--color--neutral-400)]">
                {title}
            </span>
            <div className="flex flex-col">{children}</div>
        </div>
    );
}

function SidebarItem({
    icon,
    label,
    active,
}: {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}) {
    return (
        <button
            className={cn(
                "flex items-center gap-1 min-h-8 px-1 py-1 rounded-[var(--radius--3xs)] transition-snappy text-left w-full",
                active
                    ? "bg-[var(--color--neutral-125)]"
                    : "hover:bg-[var(--color--neutral-50)]",
            )}
        >
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[var(--color--neutral-500)]">
                {icon}
            </div>
            <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                {label}
            </span>
        </button>
    );
}

// ─── Agent Header ───

function AgentHeader({
    mode,
    onModeChange,
    showPanel,
    onTogglePanel,
}: {
    mode: Mode;
    onModeChange: (m: Mode) => void;
    showPanel: boolean;
    onTogglePanel: () => void;
}) {
    return (
        <div className="n8n-pulse-header flex items-center py-4 shrink-0">
            {/* Left: logo + title */}
            <div className="flex-1 flex items-center gap-2">
                <N8nLogo size={24} />
                <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                    n8n AI
                </span>
            </div>

            {/* Center: Talk / Write toggle */}
            <div className="flex-1 flex items-center justify-center gap-1 h-6">
                <div className="flex items-center gap-1 bg-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] p-0.5">
                    <button
                        onClick={() => onModeChange("talk")}
                        className={cn(
                            "flex items-center justify-center h-5 px-2 rounded-[var(--radius--3xs)] text-[length:var(--font-size--sm)] transition-snappy",
                            mode === "talk"
                                ? "bg-white font-[var(--font-weight--medium)] text-[color:var(--color--neutral-800)]"
                                : "text-[color:var(--color--neutral-500)]",
                        )}
                    >
                        Talk
                    </button>
                    <button
                        onClick={() => onModeChange("write")}
                        className={cn(
                            "flex items-center justify-center h-5 px-2 rounded-[var(--radius--3xs)] text-[length:var(--font-size--sm)] transition-snappy",
                            mode === "write"
                                ? "bg-white font-[var(--font-weight--medium)] text-[color:var(--color--neutral-800)]"
                                : "text-[color:var(--color--neutral-500)]",
                        )}
                    >
                        Write
                    </button>
                </div>
            </div>

            {/* Right: panel toggle */}
            <div className="flex-1 flex items-center justify-end">
                <button
                    onClick={onTogglePanel}
                    className="flex items-center justify-center"
                >
                    <PanelRightClose
                        className={cn(
                            "w-4 h-4 text-[var(--color--neutral-500)]",
                            showPanel && "rotate-180",
                        )}
                    />
                </button>
            </div>
        </div>
    );
}

// ─── Voice View (Talk mode) ───

function VoiceView() {
    return (
        <div className="flex-1 flex items-center justify-center pb-6 pt-8">
            <div className="flex items-center -space-x-3">
                {/* Agent avatar */}
                <div className="relative w-[72px] h-[72px]">
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color--orange-200)] flex items-center justify-center">
                        <div className="w-[50px] h-[50px] flex items-center justify-center">
                            <N8nLogo size={40} />
                        </div>
                    </div>
                </div>
                {/* Human avatar */}
                <div className="relative w-[72px] h-[72px]">
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color--neutral-200)] bg-[var(--color--neutral-50)] flex items-center justify-center">
                        <span className="text-[26px] font-[var(--font-weight--bold)] text-[color:var(--color--neutral-800)]">
                            G
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Chat View (Write mode) ───

interface ChatViewProps {
    messages: ChatMessage[];
    onSubmit: (value: string) => void;
    isStreaming: boolean;
    error: string | null;
}

function ChatView({ messages, onSubmit, isStreaming, error }: ChatViewProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col gap-6 justify-end pb-6 pt-8 overflow-y-auto">
            {messages.length === 0 && !isStreaming && (
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-400)]">
                        Say hi to start a new conversation.
                    </p>
                </div>
            )}

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        msg.role === "user"
                            ? "flex flex-col items-end"
                            : "flex flex-col items-start",
                    )}
                >
                    <div
                        className={cn(
                            "rounded-2xl text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)] leading-5 whitespace-pre-wrap",
                            msg.role === "user"
                                ? "bg-[var(--color--neutral-150)] px-4 py-3 max-w-[80%]"
                                : "p-3 w-full",
                        )}
                    >
                        {msg.content || (
                            msg.pending ? (
                                <span className="inline-flex items-center gap-1 text-[color:var(--color--neutral-400)]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color--neutral-400)] animate-pulse" />
                                    Thinking…
                                </span>
                            ) : null
                        )}
                    </div>
                    {msg.role === "agent" &&
                        msg.toolActivity &&
                        msg.toolActivity.length > 0 && (
                            <div className="px-3 pb-1 flex flex-col gap-0.5">
                                {msg.toolActivity.map((label, i) => (
                                    <span
                                        key={i}
                                        className="text-[length:var(--font-size--2xs)] text-[color:var(--color--neutral-400)]"
                                    >
                                        {label}
                                    </span>
                                ))}
                            </div>
                        )}
                </div>
            ))}

            {error && (
                <div className="rounded-[var(--radius--xs)] bg-[var(--color--red-50)] border border-[var(--color--red-200)] px-4 py-3 text-[length:var(--font-size--xs)] text-[color:var(--color--red-500)]">
                    {error}
                </div>
            )}

            <div ref={scrollRef} />

            {/* Prompt input */}
            <div className="shrink-0">
                <PromptInput
                    onSubmit={onSubmit}
                    disabled={isStreaming}
                    placeholder={
                        isStreaming ? "Agent is working…" : "Type a message..."
                    }
                />
            </div>
        </div>
    );
}

// ─── Agent Panel (right sidebar) ───

function AgentPanel() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        Memory: true,
        Knowledge: true,
        Tools: false,
        Skills: true,
        Connections: true,
        "Guardrails and permissions": false,
        Settings: false,
    });

    const toggle = (key: string) =>
        setExpanded((p) => ({ ...p, [key]: !p[key] }));

    return (
        <div className="n8n-pulse-agent-panel flex-1 h-full bg-white border-l border-[var(--color--black-alpha-100)] rounded-bl-lg rounded-br-lg flex flex-col gap-4 pb-4 pt-3 px-3 overflow-y-auto">
            {agentSections.map((section) => (
                <div key={section.title}>
                    {/* Section header */}
                    <button
                        onClick={() => toggle(section.title)}
                        className="flex items-center justify-between w-full min-h-8 px-1 py-1 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-50)]"
                    >
                        <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                            {section.title}
                        </span>
                        {expanded[section.title] ? (
                            <ChevronUp className="w-4 h-4 text-[var(--color--neutral-400)]" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-[var(--color--neutral-400)]" />
                        )}
                    </button>

                    {/* Section items */}
                    {expanded[section.title] && section.items.length > 0 && (
                        <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                            {section.items.map((item) => (
                                <div
                                    key={item.name}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon === "file" && (
                                            <File className="w-4 h-4 text-[var(--color--neutral-400)]" />
                                        )}
                                        {item.icon === "link" && (
                                            <Link2 className="w-4 h-4 text-[var(--color--neutral-400)]" />
                                        )}
                                        {item.icon === "app" && (
                                            <span className="text-sm">
                                                {item.appIcon}
                                            </span>
                                        )}
                                        <span className="font-mono text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                                            {item.name}
                                        </span>
                                        <ArrowUpRight className="w-4 h-4 text-[var(--color--neutral-300)]" />
                                    </div>
                                    {section.title === "Connections" && (
                                        <div className="w-8 h-[18px] rounded-full bg-[var(--color--neutral-200)] relative">
                                            <div className="absolute left-0.5 top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="h-px bg-[var(--color--neutral-150)]" />
                </div>
            ))}

            {/* Extra collapsed sections */}
            {["Guardrails and permissions", "Settings"].map((title) => (
                <div key={title}>
                    <button
                        onClick={() => toggle(title)}
                        className="flex items-center justify-between w-full min-h-8 px-1 py-1 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-50)]"
                    >
                        <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)]">
                            {title}
                        </span>
                        <ChevronDown className="w-4 h-4 text-[var(--color--neutral-400)]" />
                    </button>
                    <div className="h-px bg-[var(--color--neutral-150)]" />
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ───

const PANEL_MIN_WIDTH = 280;
const PANEL_MAX_WIDTH = 720;
const PANEL_DEFAULT_WIDTH = 320;

export default function N8nPulsePage() {
    const [mode, setMode] = useState<Mode>("write");
    const [showPanel, setShowPanel] = useState(false);
    const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH);
    const { messages, send, isStreaming, error } = usePulseChat();

    const startResize = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = panelWidth;
        const onMove = (ev: MouseEvent) => {
            const delta = startX - ev.clientX;
            const next = Math.min(
                PANEL_MAX_WIDTH,
                Math.max(PANEL_MIN_WIDTH, startWidth + delta),
            );
            setPanelWidth(next);
        };
        const onUp = () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    };

    return (
        <div className="n8n-pulse flex h-screen overflow-hidden bg-[var(--color--neutral-100)]">
            {/* Left sidebar */}
            <PulseSidebar />

            {/* Main content */}
            <div className="flex flex-1 h-full min-w-0">
                <div className="flex flex-col flex-1 min-w-0 px-6">
                    <AgentHeader
                        mode={mode}
                        onModeChange={setMode}
                        showPanel={showPanel}
                        onTogglePanel={() => setShowPanel(!showPanel)}
                    />
                    <div className="flex flex-col flex-1 w-full max-w-[768px] mx-auto min-h-0">
                        {mode === "talk" ? (
                            <VoiceView />
                        ) : (
                            <ChatView
                                messages={messages}
                                onSubmit={(value) => send({ message: value })}
                                isStreaming={isStreaming}
                                error={error}
                            />
                        )}
                    </div>
                </div>

                {/* Right panel */}
                {showPanel && (
                    <div
                        className="h-full shrink-0 flex relative"
                        style={{ width: panelWidth }}
                    >
                        <div
                            onMouseDown={startResize}
                            className="absolute left-0 top-0 bottom-0 w-1 -translate-x-1/2 cursor-col-resize z-10 group"
                            role="separator"
                            aria-orientation="vertical"
                        >
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-transparent group-hover:bg-[var(--color--neutral-300)] group-active:bg-[var(--color--neutral-400)] transition-colors" />
                        </div>
                        <AgentPanel />
                    </div>
                )}
            </div>
        </div>
    );
}
