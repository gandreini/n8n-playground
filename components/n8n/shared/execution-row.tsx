"use client";

import { MoreVertical, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";
import type { Execution } from "@/lib/store";
import { ServiceIcon } from "./service-icon";
import { IconButton } from "./icon-button";
import { N8nButton } from "./button";

interface ExecutionRowProps {
    execution: Execution;
}

export function ExecutionRow({ execution }: ExecutionRowProps) {
    return (
        <div className="n8n-execution-row flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] transition-snappy">
            <input
                type="checkbox"
                className="w-4 h-4 rounded border-[var(--color--neutral-200)]"
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[color:var(--color--green-500)]">✓</span>
                {execution.workflowIcon && (
                    <ServiceIcon service={execution.workflowIcon} size={20} />
                )}
                <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-800)] truncate">
                    {execution.workflowName}
                </span>
            </div>
            <div className="flex items-center gap-2 w-24">
                {execution.status === "queued" ? (
                    <>
                        <Circle className="w-4 h-4 text-[var(--color--neutral-300)]" />
                        <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-500)]">
                            Queued
                        </span>
                    </>
                ) : execution.status === "success" ? (
                    <>
                        <CheckCircle2 className="w-4 h-4 text-[var(--color--green-500)]" />
                        <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-700)]">
                            Success
                        </span>
                    </>
                ) : (
                    <>
                        <Circle className="w-4 h-4 text-[var(--color--red-500)]" />
                        <span className="text-[length:var(--font-size--sm)] text-[color:var(--color--red-500)]">
                            Error
                        </span>
                    </>
                )}
            </div>
            <div className="w-36 text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-700)]">
                {format(execution.startedAt, "MMM d, HH:mm:ss")}
            </div>
            <div className="w-24 text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-700)]">
                {execution.runTime}
            </div>
            <div className="w-20 text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-700)]">
                {execution.executionId}
            </div>
            {execution.status === "queued" && (
                <N8nButton variant="ghost" size="small">
                    Stop
                </N8nButton>
            )}
            <IconButton
                icon={<MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />}
                label="More options"
            />
        </div>
    );
}
