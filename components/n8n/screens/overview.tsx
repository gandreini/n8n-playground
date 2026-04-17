"use client";

import { useStore, Tab } from "@/lib/store";
import { ChevronDown, Search, Filter, Sparkles, Circle } from "lucide-react";
import { Input } from "@/components/shadcn/input";
import { WorkflowRow } from "../shared/workflow-row";
import { CredentialRow } from "../shared/credential-row";
import { ExecutionRow } from "../shared/execution-row";
import { ExecutionListHeader } from "../shared/execution-list-header";
import { TabBar } from "../shared/tab-bar";
import { N8nButton } from "../shared/button";
import { IconButton } from "../shared/icon-button";
import { StatCard } from "../shared/stat-card";
import { Pagination } from "../shared/pagination";

export function OverviewScreen() {
    const {
        currentTab,
        setTab,
        workflows,
        credentials,
        executions,
        openWorkflow,
        selectCredential,
    } = useStore();

    return (
        <div className="n8n-overview h-full flex flex-col overflow-hidden bg-[var(--color--neutral-white)]">
            {/* Header */}
            <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0">
                        <h1 className="text-[length:var(--font-size--xl)] font-[var(--font-weight--bold)] text-[color:var(--color--neutral-800)]">
                            Overview
                        </h1>
                        <p className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-400)]">
                            All the workflows, credentials and data tables you
                            have access to
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <N8nButton
                            variant="subtle"
                            icon={<Sparkles className="w-4 h-4" />}
                        >
                            Run live demo
                        </N8nButton>
                        <div className="flex">
                            <N8nButton className="!rounded-r-none">
                                Create workflow
                            </N8nButton>
                            <N8nButton
                                className="!rounded-l-none !px-2 border-l border-[var(--color--orange-500)]"
                                iconOnly
                                icon={<ChevronDown className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex border border-[var(--color--neutral-150)] rounded-[var(--radius--xs)] overflow-hidden">
                    <StatCard label="Prod. executions" value="2,259" trend="8.65%" trendDown />
                    <StatCard label="Failed prod. executions" value="30" trend="16.67%" trendDown />
                    <StatCard label="Failure rate" value="1.3%" trend="0.2pp" trendDown />
                    <StatCard label="Time saved" value="38h" trend="3h" trendDown />
                    <StatCard label="Run time (avg.)" value="11.08s" trend="0.62s" />
                </div>
            </div>

            {/* Tabs */}
            <TabBar
                tabs={[
                    { id: "workflows", label: "Workflows" },
                    { id: "credentials", label: "Credentials" },
                    { id: "executions", label: "Executions" },
                    { id: "variables", label: "Variables" },
                    { id: "data-tables", label: "Data tables" },
                ]}
                activeTab={currentTab}
                onTabChange={(id) => setTab(id as Tab)}
            />

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Search Bar */}
                <div className="px-6 py-3 flex items-center justify-end gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color--neutral-400)]" />
                        <Input placeholder="Search" className="pl-9 w-48 h-9 text-[length:var(--font-size--sm)]" />
                    </div>
                    <N8nButton variant="subtle" size="small" icon={<ChevronDown className="w-4 h-4" />}>
                        Sort by last updated
                    </N8nButton>
                    <IconButton
                        icon={<Filter className="w-4 h-4 text-[var(--color--neutral-500)]" />}
                        label="Filter"
                    />
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto n8n-scrollbar">
                    {currentTab === "workflows" && (
                        <div className="px-6 py-2 space-y-2">
                            {workflows.map((workflow) => (
                                <WorkflowRow
                                    key={workflow.id}
                                    workflow={workflow}
                                    onClick={() => openWorkflow(workflow.id)}
                                />
                            ))}
                        </div>
                    )}

                    {currentTab === "credentials" && (
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

                    {currentTab === "executions" && (
                        <>
                            <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--color--neutral-100)]">
                                <div className="flex items-center gap-2 text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-500)]">
                                    <Circle className="w-4 h-4" />
                                    No active executions
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-500)] hover:text-[color:var(--color--neutral-700)]">
                                        Stop all
                                    </button>
                                    <IconButton
                                        icon={<Filter className="w-4 h-4 text-[var(--color--neutral-500)]" />}
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

                    {currentTab === "variables" && (
                        <div className="flex items-center justify-center h-full text-[color:var(--color--neutral-400)]">
                            No variables defined
                        </div>
                    )}

                    {currentTab === "data-tables" && (
                        <div className="flex items-center justify-center h-full text-[color:var(--color--neutral-400)]">
                            No data tables
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {(currentTab === "workflows" ||
                    currentTab === "credentials" ||
                    currentTab === "executions") && (
                    <Pagination
                        total={
                            currentTab === "workflows"
                                ? 308
                                : currentTab === "credentials"
                                  ? credentials.length
                                  : executions.length
                        }
                    />
                )}
            </div>
        </div>
    );
}
