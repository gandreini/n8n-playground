"use client";

import { useState } from "react";
import { useStore, type Screen } from "@/lib/store";
import {
    Home,
    Activity,
    Workflow,
    Folder,
    Cloud,
    PackageOpen,
    BarChart3,
    CircleHelp,
    Settings,
    Plus,
    Search,
    PanelLeft,
    WandSparkles,
    ChevronDown,
    Check,
    Users,
} from "lucide-react";
import { N8nLogo } from "@/components/n8n/shared/n8n-logo";
import { AGENTS } from "./agents-data";
import { PROJECTS } from "./projects-data";

interface Workspace {
    id: string;
    name: string;
    avatar: string;
    bg: string;
    members: number;
    projects: string[];
    workflows: string[];
    agentIds: string[];
}

const WORKSPACES: Workspace[] = [
    {
        id: "personal",
        name: "Personal",
        avatar: "RJ",
        bg: "var(--color--orange-200)",
        members: 1,
        projects: ["Personal tasks", "Side projects"],
        workflows: ["Daily news digest", "Receipt sorter"],
        agentIds: ["darwin", "data-analyst"],
    },
    {
        id: "design",
        name: "Design",
        avatar: "🎨",
        bg: "var(--color--neutral-100)",
        members: 12,
        projects: ["Design system", "User research"],
        workflows: ["Figma export", "Screenshot diff"],
        agentIds: ["ux-auditor"],
    },
    {
        id: "engineering",
        name: "Engineering",
        avatar: "🛠️",
        bg: "var(--color--neutral-100)",
        members: 87,
        projects: ["Backend services", "Mobile apps"],
        workflows: ["PR review bot", "Deploy notifications"],
        agentIds: ["code-reviewer", "bug-triager"],
    },
];

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    badge?: string;
    compact?: boolean;
    hasNotification?: boolean;
    onClick?: () => void;
}

function NavItem({
    icon,
    label,
    active,
    badge,
    compact,
    hasNotification,
    onClick,
}: NavItemProps) {
    return (
        <button
            onClick={onClick}
            data-active={active ? "true" : undefined}
            data-compact={compact ? "true" : undefined}
            className="n8n-menu-item"
            title={compact ? label : undefined}
        >
            <span className="icon">
                {hasNotification && <span className="dot" />}
                {icon}
            </span>
            {!compact && (
                <>
                    <span className="label">{label}</span>
                    {badge && <span className="badge">{badge}</span>}
                </>
            )}

            <style jsx>{`
                .n8n-menu-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    height: var(--height--md);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-menu-item[data-compact="true"] {
                    justify-content: center;
                    padding: var(--spacing--4xs);
                }
                .n8n-menu-item:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .n8n-menu-item[data-active="true"] {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-800);
                }
                .icon {
                    position: relative;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                }
                .icon :global(svg) {
                    width: 18px;
                    height: 18px;
                }
                .dot {
                    position: absolute;
                    right: -2px;
                    top: -2px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--color--orange-300);
                }
                .label {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .badge {
                    padding: 2px 6px;
                    font-size: var(--font-size--3xs);
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-500);
                    border-radius: var(--radius--3xs);
                    line-height: 1;
                }
            `}</style>
        </button>
    );
}

interface AgentAvatarProps {
    avatar: string;
    bg: string;
}

function AgentAvatar({ avatar, bg }: AgentAvatarProps) {
    return (
        <span className="agent-avatar" style={{ backgroundColor: bg }}>
            {avatar}
            <style jsx>{`
                .agent-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border-radius: 4px;
                    font-size: 11px;
                    line-height: 1;
                    overflow: hidden;
                }
            `}</style>
        </span>
    );
}

interface SectionLabelProps {
    label: string;
    badge?: string;
    badgeVariant?: "neutral" | "purple";
    showAdd?: boolean;
    onAdd?: () => void;
}

function SectionLabel({
    label,
    badge,
    badgeVariant = "neutral",
    showAdd = false,
    onAdd,
}: SectionLabelProps) {
    return (
        <div className="section-label">
            <span className="label-text">{label}</span>
            {badge && (
                <span className="section-badge" data-variant={badgeVariant}>
                    {badge}
                </span>
            )}
            {showAdd && (
                <button
                    type="button"
                    className="add-btn"
                    aria-label={`Add ${label.toLowerCase()}`}
                    onClick={onAdd}
                >
                    <Plus />
                </button>
            )}

            <style jsx>{`
                .section-label {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding-inline: var(--spacing--xs);
                    margin-top: var(--spacing--2xs);
                }
                .label-text {
                    flex: 1;
                    font-size: var(--font-size--2xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .add-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity var(--duration--snappy) var(--easing--ease-out),
                        background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .section-label:hover .add-btn {
                    opacity: 1;
                }
                .add-btn:hover {
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-700);
                }
                .add-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .section-badge {
                    padding: 1px 6px;
                    font-size: var(--font-size--3xs);
                    line-height: 1.4;
                    border-radius: var(--radius--3xs);
                }
                .section-badge[data-variant="neutral"] {
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-500);
                }
                .section-badge[data-variant="purple"] {
                    background-color: rgba(124, 58, 237, 0.12);
                    color: #7c3aed;
                }
            `}</style>
        </div>
    );
}

interface WorkspaceSelectProps {
    collapsed: boolean;
    currentWorkspaceId: string;
    onSelect: (id: string) => void;
    onOpenSettings: () => void;
}

function WorkspaceSelect({
    collapsed,
    currentWorkspaceId,
    onSelect,
    onOpenSettings,
}: WorkspaceSelectProps) {
    const [open, setOpen] = useState(false);
    const current =
        WORKSPACES.find((w) => w.id === currentWorkspaceId) ?? WORKSPACES[0];

    return (
        <div className="workspace-wrap">
            <button
                className="workspace-trigger"
                data-compact={collapsed ? "true" : undefined}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                title={collapsed ? current.name : undefined}
            >
                <span className="ws-avatar" style={{ backgroundColor: current.bg }}>
                    {current.avatar}
                </span>
                {!collapsed && (
                    <>
                        <span className="ws-name">{current.name}</span>
                        <ChevronDown />
                    </>
                )}
            </button>

            {open && !collapsed && (
                <div className="workspace-menu">
                    <div className="ws-current-card">
                        <div className="ws-current-row">
                            <span
                                className="ws-avatar-lg"
                                style={{ backgroundColor: current.bg }}
                            >
                                {current.avatar}
                            </span>
                            <div className="ws-current-info">
                                <div className="ws-current-name">{current.name}</div>
                                <div className="ws-current-meta">
                                    {current.members}{" "}
                                    {current.members === 1 ? "member" : "members"}
                                    {current.id === "personal" &&
                                        " · Your personal space"}
                                </div>
                            </div>
                        </div>
                        <div className="ws-current-actions">
                            <button
                                className="ws-action-btn"
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    onOpenSettings();
                                }}
                            >
                                <Settings />
                                <span>Settings</span>
                            </button>
                            <button className="ws-action-btn" type="button">
                                <Users />
                                <span>Members</span>
                            </button>
                        </div>
                    </div>

                    <div className="ws-divider" />

                    <div className="ws-list">
                        {WORKSPACES.map((ws) => (
                            <button
                                key={ws.id}
                                className="ws-option"
                                onClick={() => {
                                    onSelect(ws.id);
                                    setOpen(false);
                                }}
                            >
                                <span
                                    className="ws-avatar"
                                    style={{ backgroundColor: ws.bg }}
                                >
                                    {ws.avatar}
                                </span>
                                <span className="ws-name">{ws.name}</span>
                                {ws.id === currentWorkspaceId && (
                                    <Check className="ws-check" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <style jsx>{`
                .workspace-wrap {
                    position: relative;
                    padding: var(--spacing--3xs);
                }
                .workspace-trigger {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .workspace-trigger[data-compact="true"] {
                    justify-content: center;
                    padding: var(--spacing--4xs);
                }
                .workspace-trigger:hover {
                    background-color: var(--color--neutral-100);
                }
                .ws-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    flex-shrink: 0;
                }
                .ws-name {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .workspace-trigger :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }

                .workspace-menu {
                    position: absolute;
                    top: 100%;
                    left: var(--spacing--3xs);
                    margin-top: 4px;
                    width: 296px;
                    background-color: white;
                    border: 1px solid var(--color--black-alpha-200);
                    border-radius: var(--radius--xs, 8px);
                    box-shadow: 0 10px 24px 0
                        color-mix(
                            in srgb,
                            var(--color--foreground--shade-2) 12%,
                            transparent
                        );
                    z-index: 10;
                    padding: var(--spacing--2xs);
                    display: flex;
                    flex-direction: column;
                }

                /* Current workspace card */
                .ws-current-card {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--3xs) var(--spacing--3xs)
                        var(--spacing--2xs);
                }
                .ws-current-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
                .ws-avatar-lg {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    flex-shrink: 0;
                }
                .ws-current-info {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .ws-current-name {
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .ws-current-meta {
                    font-size: var(--font-size--3xs);
                    color: var(--color--neutral-500);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .ws-current-actions {
                    display: flex;
                    gap: var(--spacing--3xs);
                }
                .ws-action-btn {
                    flex: 1;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing--4xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-700);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .ws-action-btn:hover {
                    background-color: var(--color--neutral-50);
                }
                .ws-action-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }

                .ws-divider {
                    height: 1px;
                    background-color: var(
                        --border-color--light,
                        var(--color--neutral-150)
                    );
                    margin: var(--spacing--3xs) 0;
                }

                .ws-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .ws-option {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .ws-option:hover {
                    background-color: var(--color--neutral-100);
                }
                .ws-option :global(svg.ws-check) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--primary);
                }
            `}</style>
        </div>
    );
}

export type AgentsView =
    | { type: "new" }
    | { type: "chat"; agentId: string }
    | { type: "settings"; agentId: string }
    | null;

interface SidebarProps {
    aiAssistantActive: boolean;
    onAiAssistantClick: () => void;
    agentsView: AgentsView;
    onNewAgentClick: () => void;
    onAgentClick: (agentId: string) => void;
    onScreenChange: () => void;
    onOpenWorkspaceSettings: (workspace: {
        id: string;
        name: string;
        avatar: string;
        bg: string;
    }) => void;
    activeProjectId: string | null;
    onProjectClick: (id: string) => void;
}

export function Sidebar({
    aiAssistantActive,
    onAiAssistantClick,
    agentsView,
    onNewAgentClick,
    onAgentClick,
    onScreenChange,
    onOpenWorkspaceSettings,
    activeProjectId,
    onProjectClick,
}: SidebarProps) {
    const { currentScreen, setScreen } = useStore();
    const [collapsed, setCollapsed] = useState(false);
    const [workspaceId, setWorkspaceId] = useState("personal");

    const currentWorkspace =
        WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0];
    const workspaceAgents = currentWorkspace.agentIds
        .map((id) => AGENTS.find((a) => a.id === id))
        .filter((a): a is (typeof AGENTS)[number] => Boolean(a));

    const goToScreen = (screen: Screen) => {
        setScreen(screen);
        onScreenChange();
    };

    const isActive = (screen: Screen) =>
        !aiAssistantActive && agentsView === null && currentScreen === screen;

    const isAgentActive = (id: string) =>
        agentsView !== null &&
        (agentsView.type === "chat" || agentsView.type === "settings") &&
        agentsView.agentId === id;

    const isNewAgentActive = agentsView?.type === "new";

    return (
        <aside className="n8n-sidebar" data-collapsed={collapsed ? "true" : undefined}>
            <div className="header">
                <div className="logo-wrap">
                    <N8nLogo size={32} />
                    {!collapsed && (
                        <svg
                            className="logotype"
                            xmlns="http://www.w3.org/2000/svg"
                            width="26"
                            height="26"
                            fill="none"
                            viewBox="0 0 26 26"
                            aria-label="n8n"
                        >
                            <path
                                fill="#101330"
                                fillRule="evenodd"
                                d="M15.002 12.99v-.076c.558-.28 1.116-.762 1.116-1.716 0-1.372-1.13-2.198-2.69-2.198-1.598 0-2.74.877-2.74 2.224 0 .915.533 1.41 1.116 1.69v.076a2.16 2.16 0 0 0-1.42 2.059c0 1.385 1.141 2.351 3.032 2.351 1.89 0 2.994-.966 2.994-2.351a2.16 2.16 0 0 0-1.408-2.059m-1.587-2.82c.635 0 1.104.406 1.104 1.092s-.482 1.093-1.103 1.093c-.622 0-1.142-.407-1.142-1.093 0-.699.495-1.093 1.142-1.093m0 6.01c-.735 0-1.332-.47-1.332-1.27 0-.725.495-1.272 1.32-1.272.812 0 1.307.534 1.307 1.297 0 .775-.572 1.245-1.295 1.245"
                                clipRule="evenodd"
                            />
                            <path
                                fill="#101330"
                                d="M18.367 17.272h1.624V13.83c0-1.131.685-1.627 1.46-1.627.76 0 1.357.509 1.357 1.55v3.52h1.624v-3.851c0-1.664-.964-2.63-2.474-2.63-.952 0-1.485.381-1.865.877h-.102l-.14-.75h-1.484zm-14.376 0H2.367V10.92h1.485l.14.75h.1c.381-.496.914-.877 1.866-.877 1.51 0 2.474.966 2.474 2.63v3.85H6.808v-3.521c0-1.041-.596-1.55-1.358-1.55-.774 0-1.459.496-1.459 1.627z"
                            />
                        </svg>
                    )}
                </div>
                {!collapsed && (
                    <button className="hdr-btn" aria-label="Search">
                        <Search />
                    </button>
                )}
                <button
                    className="hdr-btn"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    onClick={() => setCollapsed((c) => !c)}
                >
                    <PanelLeft />
                </button>
            </div>

            <div className="group">
                <NavItem
                    icon={<WandSparkles />}
                    label="AI Assistant"
                    compact={collapsed}
                    active={aiAssistantActive}
                    onClick={onAiAssistantClick}
                />
            </div>

            <WorkspaceSelect
                collapsed={collapsed}
                currentWorkspaceId={workspaceId}
                onSelect={setWorkspaceId}
                onOpenSettings={() =>
                    onOpenWorkspaceSettings({
                        id: currentWorkspace.id,
                        name: currentWorkspace.name,
                        avatar: currentWorkspace.avatar,
                        bg: currentWorkspace.bg,
                    })
                }
            />

            <div className="scroll n8n-scrollbar">
                {/* Hidden — keep around to restore later
                <div className="group">
                    <NavItem
                        icon={<Home />}
                        label="Overview"
                        compact={collapsed}
                        active={isActive("overview")}
                        onClick={() => goToScreen("overview")}
                    />
                    <NavItem
                        icon={<Activity />}
                        label="Monitoring"
                        compact={collapsed}
                    />
                </div>
                */}

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

                {!collapsed && <SectionLabel label="Workflows" showAdd />}
                <div className="group">
                    {currentWorkspace.workflows.map((name) => (
                        <NavItem
                            key={name}
                            icon={<Workflow />}
                            label={name}
                            compact={collapsed}
                        />
                    ))}
                </div>

                {!collapsed && (
                    <SectionLabel
                        label="Agents"
                        showAdd
                        onAdd={onNewAgentClick}
                    />
                )}
                <div className="group">
                    {workspaceAgents.map((agent) => (
                        <NavItem
                            key={agent.id}
                            icon={<AgentAvatar avatar={agent.avatar} bg={agent.avatarBg} />}
                            label={agent.name}
                            compact={collapsed}
                            active={isAgentActive(agent.id)}
                            onClick={() => onAgentClick(agent.id)}
                        />
                    ))}
                    {collapsed && (
                        <NavItem
                            icon={<Plus />}
                            label="New agent"
                            compact={collapsed}
                            active={isNewAgentActive}
                            onClick={onNewAgentClick}
                        />
                    )}
                </div>
            </div>

            <div className="bottom">
                <div className="group">
                    <NavItem
                        icon={<Cloud />}
                        label="Admin Panel"
                        compact={collapsed}
                    />
                    <NavItem
                        icon={<PackageOpen />}
                        label="Templates"
                        compact={collapsed}
                    />
                    <NavItem
                        icon={<BarChart3 />}
                        label="Insights"
                        compact={collapsed}
                    />
                    <NavItem
                        icon={<CircleHelp />}
                        label="Help"
                        compact={collapsed}
                        hasNotification
                    />
                    <NavItem
                        icon={<Settings />}
                        label="Settings"
                        compact={collapsed}
                        active={isActive("settings")}
                        onClick={() => goToScreen("settings")}
                    />
                </div>
            </div>

            <style jsx>{`
                .n8n-sidebar {
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    width: 220px;
                    border-right: 1px solid var(--border-color--light, var(--color--neutral-150));
                    background-color: var(--menu--color--background, var(--color--neutral-50));
                    transition: width var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-sidebar[data-collapsed="true"] {
                    width: 56px;
                }
                .header {
                    display: flex;
                    align-items: center;
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                    gap: var(--spacing--4xs);
                }
                .n8n-sidebar[data-collapsed="true"] .header {
                    flex-direction: column;
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                }
                .logo-wrap {
                    margin-right: auto;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    padding-left: var(--spacing--2xs);
                }
                .logo-wrap :global(.n8n-logo path) {
                    fill: #ea4b71;
                }
                .logotype {
                    flex-shrink: 0;
                    width: 26px;
                    height: 26px;
                }
                .n8n-sidebar[data-collapsed="true"] .logo-wrap {
                    margin: 0 0 var(--spacing--3xs);
                    padding-left: 0;
                }
                .hdr-btn {
                    padding: 6px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hdr-btn:hover {
                    background-color: var(--color--neutral-125);
                }
                .hdr-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                }

                .scroll {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                    padding-top: var(--spacing--2xs);
                    overflow-y: auto;
                }
                .group {
                    padding-inline: var(--spacing--3xs);
                    padding-block: var(--spacing--2xs);
                }
                .n8n-sidebar[data-collapsed="true"] .group {
                    padding-inline: var(--spacing--4xs);
                }
                .bottom {
                    margin-top: auto;
                }
                .bottom .group {
                    padding-inline: var(--spacing--3xs);
                    padding-block: var(--spacing--3xs);
                }
                .n8n-sidebar[data-collapsed="true"] .bottom .group {
                    padding-inline: var(--spacing--4xs);
                }
            `}</style>
        </aside>
    );
}
