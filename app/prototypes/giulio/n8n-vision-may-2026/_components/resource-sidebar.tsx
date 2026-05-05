"use client";

import { useState, type ReactNode } from "react";
import {
    ChevronUp,
    ChevronDown,
    Plus,
    PanelRight,
    MoreHorizontal,
    ArrowUpRight,
} from "lucide-react";

export interface ResourceSection {
    key: string;
    label: string;
    items: ReactNode[];
    /** Optional handler for the "+" button. If omitted, no add button is shown. */
    onAdd?: () => void;
    /** Override the default empty state. */
    emptyState?: ReactNode;
    /** Optional trailing element next to the label (e.g. a "1/4" counter). */
    accessory?: ReactNode;
    /** Hide the section entirely. Useful for variants. */
    hidden?: boolean;
}

export interface ResourceSidebarProps {
    /** Whether the sidebar is collapsed to a thin rail. */
    collapsed: boolean;
    onToggleCollapse: () => void;
    sections: ResourceSection[];
    /** Optional click handler for the ellipsis "more" button. Hidden when omitted. */
    onMoreClick?: () => void;
    /** Optional row at the bottom (used by the project view for a Settings button). */
    footer?: ReactNode;
    /** Initial expanded state per section key. Defaults to all expanded. */
    defaultSectionExpanded?: Record<string, boolean>;
    /** Override the default width when expanded (272px). */
    width?: number;
}

export function ResourceSidebar({
    collapsed,
    onToggleCollapse,
    sections,
    onMoreClick,
    footer,
    defaultSectionExpanded,
    width,
}: ResourceSidebarProps) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
        const init: Record<string, boolean> = {};
        for (const s of sections) {
            init[s.key] = defaultSectionExpanded?.[s.key] ?? true;
        }
        return init;
    });

    const toggle = (key: string) =>
        setExpanded((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));

    if (collapsed) {
        return (
            <aside className="resource-sidebar collapsed" aria-label="Sidebar">
                <button
                    type="button"
                    className="rail-btn"
                    onClick={onToggleCollapse}
                    aria-label="Expand sidebar"
                >
                    <PanelRight />
                </button>

                <style jsx>{`
                    .resource-sidebar.collapsed {
                        width: 36px;
                        flex-shrink: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: var(--spacing--2xs) 0;
                        border-left: 1px solid
                            var(--border-color--subtle, var(--color--black-alpha-100));
                        background-color: var(--color--neutral-white);
                    }
                    .rail-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 28px;
                        height: 28px;
                        border: 0;
                        background: transparent;
                        border-radius: var(--radius--3xs);
                        color: var(--color--neutral-500);
                        cursor: pointer;
                        transition: background-color var(--duration--snappy)
                            var(--easing--ease-out),
                            color var(--duration--snappy) var(--easing--ease-out);
                    }
                    .rail-btn:hover {
                        background-color: var(--color--neutral-100);
                        color: var(--color--neutral-700);
                    }
                    .rail-btn :global(svg) {
                        width: 16px;
                        height: 16px;
                    }
                `}</style>
            </aside>
        );
    }

    return (
        <aside
            className="resource-sidebar"
            aria-label="Sidebar"
            style={width ? { width } : undefined}
        >
            <div className="header">
                <div className="header-spacer" />
                {onMoreClick && (
                    <button
                        type="button"
                        className="header-icon"
                        onClick={onMoreClick}
                        aria-label="More options"
                    >
                        <MoreHorizontal />
                    </button>
                )}
                <button
                    type="button"
                    className="header-icon"
                    onClick={onToggleCollapse}
                    aria-label="Collapse sidebar"
                >
                    <PanelRight />
                </button>
            </div>

            <div className="sections">
                {sections
                    .filter((s) => !s.hidden)
                    .map((s, i) => {
                        const isOpen = expanded[s.key] ?? true;
                        return (
                            <div key={s.key}>
                                {i > 0 && <Divider />}
                                <ResourceSidebarSection
                                    label={s.label}
                                    expanded={isOpen}
                                    onToggle={() => toggle(s.key)}
                                    onAdd={s.onAdd}
                                    items={s.items}
                                    emptyState={s.emptyState}
                                    accessory={s.accessory}
                                />
                            </div>
                        );
                    })}

                {footer && (
                    <>
                        <Divider />
                        <div className="footer">{footer}</div>
                    </>
                )}
            </div>

            <style jsx>{`
                .resource-sidebar {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    overflow: hidden;
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    padding: var(--spacing--3xs) var(--spacing--3xs);
                    flex-shrink: 0;
                }
                .header-spacer {
                    flex: 1;
                }
                .header-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .header-icon:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .header-icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .sections {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--2xs);
                    padding: 0 var(--spacing--3xs) var(--spacing--sm);
                }
                .footer {
                    padding-top: var(--spacing--2xs);
                }
            `}</style>
        </aside>
    );
}

interface SectionProps {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    onAdd?: () => void;
    items: ReactNode[];
    emptyState?: ReactNode;
    accessory?: ReactNode;
}

function ResourceSidebarSection({
    label,
    expanded,
    onToggle,
    onAdd,
    items,
    emptyState,
    accessory,
}: SectionProps) {
    return (
        <div className="section">
            <div className="header-row">
                <button
                    type="button"
                    className="header-btn"
                    onClick={onToggle}
                    aria-expanded={expanded}
                >
                    <span className="header-label">{label}</span>
                    {accessory && <span className="header-accessory">{accessory}</span>}
                </button>
                {onAdd && (
                    <button
                        type="button"
                        className="add-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd();
                        }}
                        aria-label={`Add to ${label.toLowerCase()}`}
                    >
                        <Plus />
                    </button>
                )}
                <button
                    type="button"
                    className="chevron-btn"
                    onClick={onToggle}
                    aria-label={expanded ? "Collapse section" : "Expand section"}
                >
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {expanded && (
                <div className="items">
                    {items.length > 0 ? (
                        items
                    ) : (
                        <div className="empty">
                            {emptyState ?? "No items yet"}
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .section {
                    display: flex;
                    flex-direction: column;
                }
                .header-row {
                    display: flex;
                    align-items: center;
                    min-height: 32px;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .header-row:hover {
                    background-color: var(--color--neutral-100);
                }
                .header-row:hover .add-btn {
                    opacity: 1;
                }
                .header-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    cursor: pointer;
                    text-align: left;
                    padding: 0 4px;
                }
                .header-label {
                    font-size: 14px;
                    line-height: 20px;
                    font-weight: 400;
                    color: var(--color--neutral-800);
                }
                .header-accessory {
                    font-size: var(--font-size--3xs);
                    color: var(--color--neutral-400);
                }
                .add-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity var(--duration--snappy)
                            var(--easing--ease-out),
                        background-color var(--duration--snappy)
                            var(--easing--ease-out);
                }
                .add-btn:hover {
                    background-color: var(--color--neutral-150);
                    color: var(--color--neutral-700);
                }
                .add-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .chevron-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border: 0;
                    background: transparent;
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    border-radius: 4px;
                }
                .chevron-btn:hover {
                    background-color: var(--color--neutral-150);
                }
                .chevron-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .items {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 0 16px 12px;
                }
                .empty {
                    color: var(--color--neutral-400);
                    font-size: 13px;
                    font-style: italic;
                    padding: 4px 0;
                }
            `}</style>
        </div>
    );
}

function Divider() {
    return (
        <>
            <hr className="divider" />
            <style jsx>{`
                .divider {
                    border: 0;
                    height: 1px;
                    background-color: var(--color--neutral-150);
                    margin: 0;
                }
            `}</style>
        </>
    );
}

interface ResourceItemProps {
    icon: ReactNode;
    name: string;
    onClick?: () => void;
    /** Optional trailing icon (defaults to a small "open" arrow). Pass null to hide. */
    trailing?: ReactNode | null;
}

/** Generic clickable row used inside ResourceSidebar sections. */
export function ResourceItem({ icon, name, onClick, trailing }: ResourceItemProps) {
    const arrow = trailing === undefined ? <ArrowUpRight /> : trailing;
    return (
        <button type="button" className="item" onClick={onClick}>
            <span className="icon">{icon}</span>
            <span className="name">{name}</span>
            {arrow !== null && <span className="trailing">{arrow}</span>}

            <style jsx>{`
                .item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border: 0;
                    background: transparent;
                    padding: 0;
                    cursor: pointer;
                    text-align: left;
                }
                .icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .name {
                    flex: 1;
                    font-family: var(--font-mono);
                    font-size: 14px;
                    line-height: 1.45;
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .trailing {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .trailing :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </button>
    );
}

interface TaskItemProps {
    label: string;
    status: "done" | "active" | "todo";
    icon: ReactNode;
}

/** Specialized task row with status-aware styling (used by Tasks sections). */
export function TaskItem({ label, status, icon }: TaskItemProps) {
    return (
        <div className="task" data-status={status}>
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>

            <style jsx>{`
                .task {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0;
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 1.4;
                }
                .icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    flex-shrink: 0;
                    color: var(--color--neutral-500);
                }
                .icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .label {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .task[data-status="done"] {
                    color: var(--color--neutral-400);
                    text-decoration: line-through;
                }
                .task[data-status="done"] .icon :global(svg) {
                    color: rgb(34, 197, 94);
                }
                .task[data-status="active"] .icon :global(svg) {
                    color: var(--color--neutral-400);
                }
                .task[data-status="todo"] .icon :global(svg) {
                    color: var(--color--neutral-300);
                }
                .task[data-status="active"] .icon :global(svg.spin) {
                    animation: rs-task-spin 1.4s linear infinite;
                }
                @keyframes rs-task-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
