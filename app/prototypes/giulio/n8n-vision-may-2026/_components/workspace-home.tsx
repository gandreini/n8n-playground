"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChevronDown, Search, Filter, Circle, Layers, Settings } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { WorkflowRow } from "@/components/n8n/shared/workflow-row";
import { CredentialRow } from "@/components/n8n/shared/credential-row";
import { ExecutionRow } from "@/components/n8n/shared/execution-row";
import { ExecutionListHeader } from "@/components/n8n/shared/execution-list-header";
import { TabBar } from "@/components/n8n/shared/tab-bar";
import { N8nButton } from "@/components/n8n/shared/button";
import { IconButton } from "@/components/n8n/shared/icon-button";
import { Pagination } from "@/components/n8n/shared/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";
import { AGENTS } from "./agents-data";
import { PROJECTS } from "./projects-data";
import { WORKSPACES } from "./workspaces-data";
import { useWorkspaceStore } from "./workspace-store";

type WorkspaceHomeTab =
    | "projects"
    | "workflows"
    | "credentials"
    | "executions"
    | "agents"
    | "variables"
    | "data-tables";

interface WorkspaceHomeProps {
    onAgentClick?: (agentId: string) => void;
    onProjectClick?: (projectId: string) => void;
    onOpenSettings?: () => void;
    initialTab?: WorkspaceHomeTab;
}

export function WorkspaceHome({
    onAgentClick,
    onProjectClick,
    onOpenSettings,
    initialTab = "projects",
}: WorkspaceHomeProps) {
    const { credentials, executions, openWorkflow, selectCredential } =
        useStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    const [tab, setTab] = useState<WorkspaceHomeTab>(initialTab);
    const [sort, setSort] = useState("last-updated");

    const currentWorkspace =
        WORKSPACES.find((w) => w.id === currentWorkspaceId) ?? WORKSPACES[0];

    const workspaceProjects = PROJECTS.filter((p) =>
        currentWorkspace.projects.includes(p.name)
    );
    const workspaceWorkflows = currentWorkspace.workflows;
    const workspaceAgents = currentWorkspace.agentIds
        .map((id) => AGENTS.find((a) => a.id === id))
        .filter((a): a is (typeof AGENTS)[number] => Boolean(a));

    return (
        <div className="workspace-home">
            <div className="header">
                <div className="title-row">
                    <div className="title-text">
                        <h1 className="title">{currentWorkspace.name}</h1>
                        <p className="subtitle">
                            All the projects, workflows, credentials and data tables
                            in this workspace
                        </p>
                    </div>
                    <div className="title-actions">
                        <button
                            type="button"
                            className="member-stack"
                            onClick={onOpenSettings}
                            aria-label={`${currentWorkspace.members} member${
                                currentWorkspace.members === 1 ? "" : "s"
                            } — open settings`}
                        >
                            {getMemberAvatars(
                                currentWorkspace.id,
                                currentWorkspace.members
                            ).map((m, i) => (
                                <span
                                    key={i}
                                    className="member-avatar"
                                    style={{ backgroundColor: m.bg, color: m.fg }}
                                >
                                    {m.initials}
                                </span>
                            ))}
                            {currentWorkspace.members > 3 && (
                                <span className="member-overflow">
                                    +{currentWorkspace.members - 3}
                                </span>
                            )}
                        </button>
                        <div className="split-btn">
                            <N8nButton className="left-half">Create workflow</N8nButton>
                            <N8nButton
                                className="right-half"
                                iconOnly
                                icon={
                                    <ChevronDown style={{ width: 16, height: 16 }} />
                                }
                            />
                        </div>
                        <IconButton
                            icon={
                                <Settings
                                    style={{
                                        width: 18,
                                        height: 18,
                                        color: "var(--color--neutral-500)",
                                    }}
                                />
                            }
                            onClick={onOpenSettings}
                            label="Workspace settings"
                        />
                    </div>
                </div>
            </div>

            <TabBar
                tabs={[
                    { id: "projects", label: "Projects" },
                    { id: "workflows", label: "Workflows" },
                    { id: "agents", label: "Agents" },
                    { id: "credentials", label: "Credentials" },
                    { id: "executions", label: "Executions" },
                    { id: "variables", label: "Variables" },
                    { id: "data-tables", label: "Data tables" },
                ]}
                activeTab={tab}
                onTabChange={(id) => setTab(id as WorkspaceHomeTab)}
            />

            <div className="content">
                <div className="search-bar">
                    <div className="search-wrap">
                        <Search className="search-icon" />
                        <Input placeholder="Search" />
                    </div>
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger size="sm" className="sort-select" aria-label="Sort by">
                            <span className="sort-prefix">Sort by</span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last-updated">last updated</SelectItem>
                            <SelectItem value="name">name</SelectItem>
                            <SelectItem value="created">created</SelectItem>
                        </SelectContent>
                    </Select>
                    <N8nButton
                        variant="subtle"
                        size="medium"
                        iconOnly
                        icon={<Filter style={{ width: 16, height: 16 }} />}
                    />
                </div>

                <div className="list n8n-scrollbar">
                    {tab === "projects" && (
                        <div className="projects-list">
                            {workspaceProjects.length === 0 ? (
                                <div className="empty">
                                    No projects in this workspace
                                </div>
                            ) : (
                                workspaceProjects.map((project) => {
                                    const memberCount = getProjectMemberCount(
                                        project.id
                                    );
                                    return (
                                        <button
                                            key={project.id}
                                            className="project-row"
                                            onClick={() => onProjectClick?.(project.id)}
                                        >
                                            <span className="project-icon">
                                                <Layers />
                                            </span>
                                            <span className="project-info">
                                                <span className="project-name">
                                                    {project.name}
                                                </span>
                                                <span className="project-desc">
                                                    {project.description}
                                                </span>
                                            </span>
                                            <span
                                                className="project-members"
                                                aria-label={`${memberCount} member${
                                                    memberCount === 1 ? "" : "s"
                                                }`}
                                            >
                                                {getMemberAvatars(
                                                    project.id,
                                                    memberCount
                                                ).map((m, i) => (
                                                    <span
                                                        key={i}
                                                        className="member-avatar"
                                                        style={{
                                                            backgroundColor: m.bg,
                                                            color: m.fg,
                                                        }}
                                                    >
                                                        {m.initials}
                                                    </span>
                                                ))}
                                                {memberCount > 3 && (
                                                    <span className="member-overflow">
                                                        +{memberCount - 3}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {tab === "workflows" && (
                        <div className="workflows-list">
                            {workspaceWorkflows.length === 0 ? (
                                <div className="empty">
                                    No workflows in this workspace
                                </div>
                            ) : (
                                workspaceWorkflows.map((workflow) => (
                                    <WorkflowRow
                                        key={workflow.id}
                                        workflow={workflow}
                                        onClick={() => openWorkflow(workflow.id)}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {tab === "credentials" && (
                        <>
                            {credentials.map((credential) => (
                                <CredentialRow
                                    key={credential.id}
                                    credential={credential}
                                    onClick={() => selectCredential(credential.id)}
                                />
                            ))}
                        </>
                    )}

                    {tab === "executions" && (
                        <>
                            <div className="exec-header">
                                <div className="exec-status">
                                    <Circle style={{ width: 16, height: 16 }} />
                                    No active executions
                                </div>
                                <div className="exec-actions">
                                    <button className="stop-all">Stop all</button>
                                    <IconButton
                                        icon={
                                            <Filter
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    color: "var(--color--neutral-500)",
                                                }}
                                            />
                                        }
                                        label="Filter"
                                    />
                                </div>
                            </div>
                            <ExecutionListHeader />
                            {executions.map((execution) => (
                                <ExecutionRow key={execution.id} execution={execution} />
                            ))}
                        </>
                    )}

                    {tab === "agents" && (
                        <div className="agents-list">
                            {workspaceAgents.length === 0 ? (
                                <div className="empty">No agents in this workspace</div>
                            ) : (
                                workspaceAgents.map((agent) => (
                                    <button
                                        key={agent.id}
                                        className="agent-row"
                                        onClick={() => onAgentClick?.(agent.id)}
                                    >
                                        <span
                                            className="agent-emoji"
                                            style={{ backgroundColor: agent.avatarBg }}
                                        >
                                            {agent.avatar}
                                        </span>
                                        <span className="agent-info">
                                            <span className="agent-name">{agent.name}</span>
                                            <span className="agent-desc">
                                                {agent.description}
                                            </span>
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {tab === "variables" && (
                        <div className="empty">No variables defined</div>
                    )}

                    {tab === "data-tables" && <div className="empty">No data tables</div>}
                </div>

                {(tab === "workflows" ||
                    tab === "credentials" ||
                    tab === "executions") && (
                    <Pagination
                        total={
                            tab === "workflows"
                                ? workspaceWorkflows.length
                                : tab === "credentials"
                                  ? credentials.length
                                  : executions.length
                        }
                    />
                )}
            </div>

            <style jsx>{`
                .workspace-home {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    background-color: var(--color--neutral-white, #ffffff);
                }
                .header {
                    padding-inline: var(--spacing--xl);
                    padding-block: var(--spacing--md);
                }
                .title-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                }
                .title-text {
                    min-width: 0;
                }
                .title {
                    font-size: var(--font-size--xl);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
                }
                .subtitle {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-400);
                }
                .title-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
                .member-stack {
                    display: inline-flex;
                    align-items: center;
                    padding: 2px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--full);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .member-stack:hover {
                    background-color: var(--color--neutral-100);
                }
                .member-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    font-size: 10px;
                    font-weight: var(--font-weight--bold);
                    line-height: 1;
                    box-shadow: 0 0 0 2px var(--color--neutral-white);
                }
                .member-avatar + .member-avatar {
                    margin-left: -8px;
                }
                .member-overflow {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    height: 24px;
                    min-width: 24px;
                    padding: 0 6px;
                    margin-left: -8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-600);
                    background-color: var(--color--neutral-150);
                    box-shadow: 0 0 0 2px var(--color--neutral-white);
                }
                .split-btn {
                    display: flex;
                    gap: 1px;
                    background: var(--color--orange-600);
                    border-radius: var(--radius--3xs);
                }
                .split-btn :global(.left-half) {
                    border-top-right-radius: 0 !important;
                    border-bottom-right-radius: 0 !important;
                }
                .split-btn :global(.right-half) {
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                    padding-inline: var(--spacing--3xs) !important;
                }

                .content {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                .search-bar {
                    padding-inline: var(--spacing--xl);
                    padding-block: var(--spacing--xs);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--spacing--2xs);
                }
                .search-wrap {
                    position: relative;
                }
                .search-wrap :global(.search-icon) {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-400);
                    z-index: 1;
                }
                .search-wrap :global(input) {
                    padding-left: 32px;
                    width: 240px;
                    height: var(--height--md);
                    font-size: var(--font-size--sm);
                }

                .list {
                    flex: 1;
                    overflow-y: auto;
                }
                .workflows-list {
                    padding-inline: var(--spacing--xl);
                    padding-block: var(--spacing--3xs);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }

                .exec-header {
                    padding-inline: var(--spacing--sm);
                    padding-block: var(--spacing--3xs);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--color--neutral-100);
                }
                .exec-status {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-500);
                }
                .exec-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
                .stop-all {
                    background: transparent;
                    border: 0;
                    padding: 0;
                    cursor: pointer;
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-500);
                    transition: color var(--duration--snappy) var(--easing--ease-out);
                }
                .stop-all:hover {
                    color: var(--color--neutral-700);
                }
                .empty {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 240px;
                    color: var(--color--neutral-400);
                }

                /* Projects tab */
                .projects-list {
                    padding-inline: var(--spacing--xl);
                    padding-block: var(--spacing--xs);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }
                .project-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    background: white;
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .project-row:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--neutral-200);
                }
                .project-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius--3xs);
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .project-icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .project-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }
                .project-members {
                    display: inline-flex;
                    align-items: center;
                    flex-shrink: 0;
                    margin-left: var(--spacing--sm);
                }
                .project-name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .project-desc {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                /* Agents tab */
                .agents-list {
                    padding-inline: var(--spacing--xl);
                    padding-block: var(--spacing--xs);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }
                .agent-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    background: white;
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .agent-row:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--neutral-200);
                }
                .agent-emoji {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius--3xs);
                    font-size: 16px;
                    flex-shrink: 0;
                }
                .agent-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }
                .agent-name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .agent-desc {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>
        </div>
    );
}

interface MemberAvatar {
    initials: string;
    bg: string;
    fg: string;
}

const AVATAR_PALETTE: Array<{ bg: string; fg: string }> = [
    { bg: "#FEE7D6", fg: "#C04A1F" },
    { bg: "#DEEDFE", fg: "#1E5BA8" },
    { bg: "#DFF0E1", fg: "#2A7A3D" },
    { bg: "#F1E2FB", fg: "#6E2BB1" },
    { bg: "#FFE7E1", fg: "#B23A2A" },
    { bg: "#E5E5E5", fg: "#3D3D3D" },
];

const PLACEHOLDER_INITIALS = ["RJ", "MK", "AS", "JL", "TP", "NB", "EC", "DV"];

function getProjectMemberCount(projectId: string): number {
    const seed = projectId
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    // 2..12 members per project, deterministic per id
    return 2 + (seed % 11);
}

function getMemberAvatars(workspaceId: string, count: number): MemberAvatar[] {
    const visible = Math.min(count, 3);
    const seed = workspaceId
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return Array.from({ length: visible }, (_, i) => {
        const initialsIndex = (seed + i * 3) % PLACEHOLDER_INITIALS.length;
        const colorIndex = (seed + i * 2) % AVATAR_PALETTE.length;
        return {
            initials: PLACEHOLDER_INITIALS[initialsIndex],
            ...AVATAR_PALETTE[colorIndex],
        };
    });
}
