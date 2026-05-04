"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ChevronDown, Search, Filter, Sparkles, Circle } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { WorkflowRow } from "@/components/n8n/shared/workflow-row";
import { CredentialRow } from "@/components/n8n/shared/credential-row";
import { ExecutionRow } from "@/components/n8n/shared/execution-row";
import { ExecutionListHeader } from "@/components/n8n/shared/execution-list-header";
import { TabBar } from "@/components/n8n/shared/tab-bar";
import { N8nButton } from "@/components/n8n/shared/button";
import { IconButton } from "@/components/n8n/shared/icon-button";
import { Pagination } from "@/components/n8n/shared/pagination";
import { AGENTS } from "./agents-data";

type WorkspaceHomeTab =
    | "workflows"
    | "credentials"
    | "executions"
    | "agents"
    | "variables"
    | "data-tables";

interface WorkspaceHomeProps {
    workspaceName: string;
    workspaceAgentIds: string[];
    onAgentClick?: (agentId: string) => void;
}

export function WorkspaceHome({
    workspaceName,
    workspaceAgentIds,
    onAgentClick,
}: WorkspaceHomeProps) {
    const { workflows, credentials, executions, openWorkflow, selectCredential } =
        useStore();
    const [tab, setTab] = useState<WorkspaceHomeTab>("workflows");

    const workspaceAgents = workspaceAgentIds
        .map((id) => AGENTS.find((a) => a.id === id))
        .filter((a): a is (typeof AGENTS)[number] => Boolean(a));

    return (
        <div className="workspace-home">
            <div className="header">
                <div className="title-row">
                    <div className="title-text">
                        <h1 className="title">{workspaceName}</h1>
                        <p className="subtitle">
                            All the workflows, credentials and data tables in this
                            workspace
                        </p>
                    </div>
                    <div className="title-actions">
                        <N8nButton
                            variant="subtle"
                            icon={<Sparkles style={{ width: 16, height: 16 }} />}
                        >
                            Run live demo
                        </N8nButton>
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
                    </div>
                </div>
            </div>

            <TabBar
                tabs={[
                    { id: "workflows", label: "Workflows" },
                    { id: "credentials", label: "Credentials" },
                    { id: "executions", label: "Executions" },
                    { id: "agents", label: "Agents" },
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
                    <N8nButton
                        variant="subtle"
                        size="small"
                        icon={<ChevronDown style={{ width: 16, height: 16 }} />}
                    >
                        Sort by last updated
                    </N8nButton>
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

                <div className="list n8n-scrollbar">
                    {tab === "workflows" && (
                        <div className="workflows-list">
                            {workflows.map((workflow) => (
                                <WorkflowRow
                                    key={workflow.id}
                                    workflow={workflow}
                                    onClick={() => openWorkflow(workflow.id)}
                                />
                            ))}
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
                                ? 308
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
                    padding-inline: var(--spacing--md);
                    padding-block: var(--spacing--sm);
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
                    padding-inline: var(--spacing--md);
                    padding-block: var(--spacing--3xs);
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
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-400);
                    z-index: 1;
                }
                .search-wrap :global(input) {
                    padding-left: 36px;
                    width: 192px;
                    height: 36px;
                    font-size: var(--font-size--sm);
                }

                .list {
                    flex: 1;
                    overflow-y: auto;
                }
                .workflows-list {
                    padding-inline: var(--spacing--md);
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

                /* Agents tab */
                .agents-list {
                    padding-inline: var(--spacing--md);
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
