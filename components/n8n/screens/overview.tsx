"use client";

import { useStore, Tab, Workflow, Credential, Execution } from "@/lib/store";
import {
    ChevronDown,
    Search,
    Filter,
    Sparkles,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    User,
    CheckCircle2,
    Circle,
    Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceIcon } from "../shared/service-icon";
import { WorkflowRow } from "../shared/workflow-row";
import { formatDistanceToNowStrict, format } from "date-fns";

interface StatCardProps {
    label: string;
    value: string;
    trend?: string;
    trendDown?: boolean;
}

function StatCard({ label, value, trend, trendDown }: StatCardProps) {
    return (
        <div className="flex-1 min-w-0 p-4 bg-[var(--color--neutral-white)] border border-[var(--color--neutral-150)] rounded-[var(--radius--xs)]">
            <p className="text-[var(--font-size--xs)] text-[var(--color--neutral-500)] mb-1 whitespace-nowrap">
                {label}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="text-[var(--font-size--2xl)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)] whitespace-nowrap">
                    {value}
                </span>
                {trend && (
                    <span
                        className={cn(
                            "text-[var(--font-size--2xs)] whitespace-nowrap",
                            trendDown
                                ? "text-[var(--color--red-500)]"
                                : "text-[var(--color--neutral-400)]",
                        )}
                    >
                        {trendDown ? "▽" : "△"}
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}

function TabButton({
    tab,
    label,
    active,
    onClick,
}: {
    tab: Tab;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-4 py-2 text-[var(--font-size--sm)] font-[var(--font-weight--medium)] border-b-2 transition-snappy",
                active
                    ? "text-[var(--color--orange-300)] border-[var(--color--orange-300)]"
                    : "text-[var(--color--neutral-500)] border-transparent hover:text-[var(--color--neutral-700)]",
            )}
        >
            {label}
        </button>
    );
}

function CredentialRow({
    credential,
    onClick,
}: {
    credential: Credential;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] cursor-pointer transition-snappy"
        >
            <ServiceIcon service={credential.icon} size={36} />
            <div className="flex-1">
                <span className="text-[var(--font-size--sm)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
                    {credential.name}
                </span>
                <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] mt-0.5">
                    {credential.type} | Last updated{" "}
                    {formatDistanceToNowStrict(credential.lastUpdated)} ago |
                    Created {format(credential.createdAt, "d MMMM, yyyy")}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-[var(--font-size--2xs)] border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Personal
                </span>
                <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                    <MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />
                </button>
            </div>
        </div>
    );
}

function ExecutionRow({ execution }: { execution: Execution }) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] transition-snappy">
            <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color--neutral-200)]"
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[var(--color--green-500)]">✓</span>
                {execution.workflowIcon && (
                    <ServiceIcon service={execution.workflowIcon} size={20} />
                )}
                <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-800)] truncate">
                    {execution.workflowName}
                </span>
            </div>
            <div className="flex items-center gap-2 w-24">
                {execution.status === "queued" ? (
                    <>
                        <Circle className="w-4 h-4 text-[var(--color--neutral-300)]" />
                        <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-500)]">
                            Queued
                        </span>
                    </>
                ) : execution.status === "success" ? (
                    <>
                        <CheckCircle2 className="w-4 h-4 text-[var(--color--green-500)]" />
                        <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
                            Success
                        </span>
                    </>
                ) : (
                    <>
                        <Circle className="w-4 h-4 text-[var(--color--red-500)]" />
                        <span className="text-[var(--font-size--sm)] text-[var(--color--red-500)]">
                            Error
                        </span>
                    </>
                )}
            </div>
            <div className="w-36 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
                {format(execution.startedAt, "MMM d, HH:mm:ss")}
            </div>
            <div className="w-24 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
                {execution.runTime}
            </div>
            <div className="w-20 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
                {execution.executionId}
            </div>
            {execution.status === "queued" && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--color--neutral-500)]"
                >
                    Stop
                </Button>
            )}
            <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                <MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />
            </button>
        </div>
    );
}

function Pagination({
    total,
    currentPage = 1,
}: {
    total: number;
    currentPage?: number;
}) {
    return (
        <div className="flex items-center justify-end gap-4 px-4 py-3 text-[var(--font-size--sm)] text-[var(--color--neutral-500)]">
            <span>Total {total}</span>
            <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3, 4].map((page) => (
                    <button
                        key={page}
                        className={cn(
                            "w-7 h-7 rounded-[var(--radius--3xs)] text-[var(--font-size--sm)]",
                            page === currentPage
                                ? "border border-[var(--color--orange-300)] text-[var(--color--orange-300)]"
                                : "hover:bg-[var(--color--neutral-100)]",
                        )}
                    >
                        {page}
                    </button>
                ))}
                <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            <div className="flex items-center gap-1">
                <span>100/page</span>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}

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
        <div className="h-full flex flex-col overflow-hidden bg-[var(--color--neutral-white)]">
            {/* Header */}
            <div className="px-6 py-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0">
                        <h1 className="text-[var(--font-size--xl)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
                            Overview
                        </h1>
                        <p className="text-[var(--font-size--sm)] text-[var(--color--neutral-400)]">
                            All the workflows, credentials and data tables you
                            have access to
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="gap-2">
                            <Sparkles className="w-4 h-4" />
                            Run live demo
                        </Button>
                        <div className="flex">
                            <Button className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white rounded-r-none">
                                Create workflow
                            </Button>
                            <Button className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white rounded-l-none border-l border-[var(--color--orange-400)] px-2">
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-3">
                    <StatCard
                        label="Prod. executions"
                        value="2,259"
                        trend="8.65%"
                        trendDown
                    />
                    <StatCard
                        label="Failed prod. executions"
                        value="30"
                        trend="16.67%"
                        trendDown
                    />
                    <StatCard
                        label="Failure rate"
                        value="1.3%"
                        trend="0.2pp"
                        trendDown
                    />
                    <StatCard
                        label="Time saved"
                        value="38h"
                        trend="3h"
                        trendDown
                    />
                    <StatCard
                        label="Run time (avg.)"
                        value="11.08s"
                        trend="0.62s"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6">
                <div className="flex">
                    <TabButton
                        tab="workflows"
                        label="Workflows"
                        active={currentTab === "workflows"}
                        onClick={() => setTab("workflows")}
                    />
                    <TabButton
                        tab="credentials"
                        label="Credentials"
                        active={currentTab === "credentials"}
                        onClick={() => setTab("credentials")}
                    />
                    <TabButton
                        tab="executions"
                        label="Executions"
                        active={currentTab === "executions"}
                        onClick={() => setTab("executions")}
                    />
                    <TabButton
                        tab="variables"
                        label="Variables"
                        active={currentTab === "variables"}
                        onClick={() => setTab("variables")}
                    />
                    <TabButton
                        tab="data-tables"
                        label="Data tables"
                        active={currentTab === "data-tables"}
                        onClick={() => setTab("data-tables")}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Search Bar */}
                <div className="px-6 py-3 flex items-center justify-end gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color--neutral-400)]" />
                        <Input
                            placeholder="Search"
                            className="pl-9 w-48 h-9 text-[var(--font-size--sm)]"
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="gap-2 h-9 text-[var(--font-size--sm)]"
                    >
                        Sort by last updated
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Filter className="w-4 h-4" />
                    </Button>
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
                                    onClick={() =>
                                        selectCredential(credential.id)
                                    }
                                />
                            ))}
                        </>
                    )}

                    {currentTab === "executions" && (
                        <>
                            <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--color--neutral-100)]">
                                <div className="flex items-center gap-2 text-[var(--font-size--sm)] text-[var(--color--neutral-500)]">
                                    <Circle className="w-4 h-4" />
                                    No active executions
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="text-[var(--font-size--sm)] text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]">
                                        Stop all
                                    </button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                    >
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 px-4 py-2 bg-[var(--color--neutral-50)] border-b border-[var(--color--neutral-100)] text-[var(--font-size--2xs)] text-[var(--color--neutral-500)] font-[var(--font-weight--medium)]">
                                <span className="w-4" />
                                <span className="flex-1">Workflow</span>
                                <span className="w-24">Status</span>
                                <span className="w-36">Started</span>
                                <span className="w-24">Run Time</span>
                                <span className="w-20">Exec. ID</span>
                                <span className="w-14" />
                                <span className="w-8" />
                            </div>
                            {executions.map((execution) => (
                                <ExecutionRow
                                    key={execution.id}
                                    execution={execution}
                                />
                            ))}
                        </>
                    )}

                    {currentTab === "variables" && (
                        <div className="flex items-center justify-center h-full text-[var(--color--neutral-400)]">
                            No variables defined
                        </div>
                    )}

                    {currentTab === "data-tables" && (
                        <div className="flex items-center justify-center h-full text-[var(--color--neutral-400)]">
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
