"use client";

import { MoreVertical, User } from "lucide-react";
import { formatDistanceToNowStrict, format } from "date-fns";
import type { Workflow } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Tag } from "./tag";

interface WorkflowRowProps {
    workflow: Workflow;
    onClick?: () => void;
}

function formatCreatedDate(date: Date) {
    const now = new Date();
    const sameYear = date.getFullYear() === now.getFullYear();
    return sameYear ? format(date, "d MMMM") : format(date, "d MMMM, yyyy");
}

export function WorkflowRow({ workflow, onClick }: WorkflowRowProps) {
    const hasProductionTag = workflow.tags?.includes("Production Workflows");
    const hasCheckmark = workflow.status === "published" && hasProductionTag;
    const sharedCount = workflow.linkedCount;

    return (
        <div
            onClick={onClick}
            data-clickable={onClick ? "true" : undefined}
            className={cn("n8n-workflow-row", onClick && "cursor-pointer")}
        >
            {/* Left: name + metadata */}
            <div className="col-left">
                <div className="heading">
                    {hasCheckmark && <span className="checkmark">✅</span>}
                    <span className="name">{workflow.name}</span>
                </div>
                <div className="subheading">
                    <span className="meta">
                        Last updated {formatDistanceToNowStrict(workflow.lastUpdated)} ago
                        <span className="separator">|</span>
                        Created {formatCreatedDate(workflow.createdAt)}
                    </span>
                    {workflow.tags?.map((tag) => (
                        <Tag key={tag} text={tag} />
                    ))}
                </div>
            </div>

            {/* Right: badges + menu */}
            <div className="col-right">
                <div className="badges">
                    {/* Ownership badge — segmented pill */}
                    <div className="pill">
                        <div className="pill-seg pill-seg-left">
                            <User className="pill-icon" />
                            {workflow.project || "Personal"}
                        </div>
                        {sharedCount && sharedCount > 0 ? (
                            <div className="pill-seg pill-seg-right">+{sharedCount}</div>
                        ) : null}
                    </div>

                    {/* Published badge */}
                    {workflow.status === "published" && (
                        <div className="published">
                            <span className="dot" />
                            Published
                        </div>
                    )}
                </div>

                <button className="menu">
                    <MoreVertical className="menu-icon" />
                </button>
            </div>

            <style jsx>{`
                .n8n-workflow-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: var(--color--neutral-white);
                    border: 1px solid var(--color--neutral-200);
                    border-radius: var(--radius--xs);
                    padding: var(--spacing--sm);
                    transition: border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-workflow-row[data-clickable="true"] {
                    cursor: pointer;
                }
                .n8n-workflow-row:hover {
                    border-color: var(--color--neutral-300);
                }

                .col-left {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }
                .heading {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .checkmark {
                    font-size: var(--font-size--sm);
                    line-height: 1;
                }
                .name {
                    font-size: 14px;
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    line-height: 20px;
                }
                .subheading {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    flex-wrap: wrap;
                }
                .meta {
                    font-size: var(--font-size--2xs);
                    color: var(--color--text--tint-1);
                    line-height: 18px;
                    white-space: nowrap;
                }
                .separator {
                    margin-inline: var(--spacing--4xs);
                }

                .col-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--sm);
                    flex-shrink: 0;
                    margin-left: var(--spacing--sm);
                }
                .badges {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                }
                .pill {
                    display: flex;
                    align-items: center;
                    height: 24px;
                    border-radius: var(--radius--3xs);
                }
                .pill-seg {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 100%;
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    background-color: var(--color--neutral-white);
                    border: 1px solid var(--color--neutral-200);
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-500);
                    line-height: 18px;
                    white-space: nowrap;
                }
                .pill-seg-left {
                    border-radius: var(--radius--3xs) 0 0 var(--radius--3xs);
                }
                .pill-seg-right {
                    border-left: 0;
                    border-radius: 0 var(--radius--3xs) var(--radius--3xs) 0;
                    color: var(--color--neutral-400);
                }
                .pill :global(.pill-icon) {
                    width: 10px;
                    height: 10px;
                    color: var(--color--neutral-500);
                }

                .published {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    height: 24px;
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    background-color: var(--color--neutral-white);
                    border: 1px solid var(--color--neutral-200);
                    border-radius: var(--radius--3xs);
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-500);
                    line-height: 18px;
                    white-space: nowrap;
                }
                .dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--color--green-500);
                }

                .menu {
                    padding: 2px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .menu:hover {
                    background-color: var(--color--neutral-100);
                }
                .menu :global(.menu-icon) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-800);
                }
            `}</style>
        </div>
    );
}
