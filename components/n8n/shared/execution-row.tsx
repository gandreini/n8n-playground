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
        <div className="n8n-execution-row">
            <input type="checkbox" className="checkbox" />
            <div className="cell-workflow">
                <span className="tick">✓</span>
                {execution.workflowIcon && (
                    <ServiceIcon service={execution.workflowIcon} size={20} />
                )}
                <span className="workflow-name">{execution.workflowName}</span>
            </div>
            <div className="cell-status" data-status={execution.status}>
                {execution.status === "queued" ? (
                    <>
                        <Circle className="status-icon" />
                        <span className="status-label">Queued</span>
                    </>
                ) : execution.status === "success" ? (
                    <>
                        <CheckCircle2 className="status-icon" />
                        <span className="status-label">Success</span>
                    </>
                ) : (
                    <>
                        <Circle className="status-icon" />
                        <span className="status-label">Error</span>
                    </>
                )}
            </div>
            <div className="cell-started">{format(execution.startedAt, "MMM d, HH:mm:ss")}</div>
            <div className="cell-runtime">{execution.runTime}</div>
            <div className="cell-id">{execution.executionId}</div>
            {execution.status === "queued" && (
                <N8nButton variant="ghost" size="small">
                    Stop
                </N8nButton>
            )}
            <IconButton
                icon={
                    <MoreVertical
                        style={{ width: 16, height: 16, color: "var(--color--neutral-400)" }}
                    />
                }
                label="More options"
            />

            <style jsx>{`
                .n8n-execution-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    border-bottom: 1px solid var(--color--neutral-100);
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-execution-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .checkbox {
                    width: 16px;
                    height: 16px;
                    border: 1px solid var(--color--neutral-200);
                    border-radius: var(--radius--3xs);
                }
                .cell-workflow {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    flex: 1;
                    min-width: 0;
                }
                .tick {
                    color: var(--color--green-500);
                }
                .workflow-name {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .cell-status {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    width: 96px;
                }
                .cell-status :global(.status-icon) {
                    width: 16px;
                    height: 16px;
                }
                .cell-status[data-status="queued"] :global(.status-icon) {
                    color: var(--color--neutral-300);
                }
                .cell-status[data-status="queued"] .status-label {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-500);
                }
                .cell-status[data-status="success"] :global(.status-icon) {
                    color: var(--color--green-500);
                }
                .cell-status[data-status="success"] .status-label {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-700);
                }
                .cell-status[data-status="error"] :global(.status-icon) {
                    color: var(--color--red-500);
                }
                .cell-status[data-status="error"] .status-label {
                    font-size: var(--font-size--sm);
                    color: var(--color--red-500);
                }
                .cell-started,
                .cell-runtime {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-700);
                }
                .cell-started {
                    width: 144px;
                }
                .cell-runtime {
                    width: 96px;
                }
                .cell-id {
                    width: 80px;
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-700);
                }
            `}</style>
        </div>
    );
}
