"use client";

import { useState, type ReactNode } from "react";
import {
    ChevronUp,
    ChevronDown,
    Plus,
    ArrowUpRight,
    Workflow,
    Bot,
    File,
    Link2,
    Database,
} from "lucide-react";
import type {
    KnowledgeItem,
    Project,
    Resource,
} from "./projects-data";

interface ArtifactsPanelProps {
    project: Project;
    onOpenSettings: () => void;
}

type SectionKey = "resources" | "documents" | "knowledge";

export function ArtifactsPanel({ project, onOpenSettings }: ArtifactsPanelProps) {
    const [expanded, setExpanded] = useState<Record<SectionKey, boolean>>({
        resources: true,
        documents: true,
        knowledge: true,
    });

    const toggle = (key: SectionKey) =>
        setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

    return (
        <aside className="artifacts-panel">
            <div className="sections">
                <Section
                    label="Connected resources"
                    expanded={expanded.resources}
                    onToggle={() => toggle("resources")}
                    onAdd={() => console.debug("attach", "resources")}
                    items={project.resources.map((r) => (
                        <ArtifactItem
                            key={r.id}
                            icon={resourceIcon(r)}
                            name={r.name}
                            onClick={() => console.debug("open artifact", r)}
                        />
                    ))}
                />

                <Divider />

                <Section
                    label="Documents"
                    expanded={expanded.documents}
                    onToggle={() => toggle("documents")}
                    onAdd={() => console.debug("attach", "documents")}
                    items={project.documents.map((d) => (
                        <ArtifactItem
                            key={d.id}
                            icon={<File />}
                            name={d.name}
                            onClick={() => console.debug("open artifact", d)}
                        />
                    ))}
                />

                <Divider />

                <Section
                    label="Knowledge"
                    expanded={expanded.knowledge}
                    onToggle={() => toggle("knowledge")}
                    onAdd={() => console.debug("attach", "knowledge")}
                    items={project.knowledge.map((k) => (
                        <ArtifactItem
                            key={k.id}
                            icon={knowledgeIcon(k)}
                            name={k.name}
                            onClick={() => console.debug("open artifact", k)}
                        />
                    ))}
                />

                <Divider />

                <button
                    type="button"
                    className="settings-row"
                    onClick={onOpenSettings}
                >
                    <span className="settings-label">Settings</span>
                    <span className="settings-chevron">
                        <ChevronDown />
                    </span>
                </button>
            </div>

            <style jsx>{`
                .artifacts-panel {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    overflow-y: auto;
                }
                .sections {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--3xs) var(--spacing--3xs)
                        var(--spacing--sm);
                }
                .settings-row {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    min-height: 32px;
                    padding: 4px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .settings-row:hover {
                    background-color: var(--color--neutral-100);
                }
                .settings-label {
                    flex: 1;
                    text-align: left;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--color--neutral-800);
                }
                .settings-chevron {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    color: var(--color--neutral-500);
                }
                .settings-chevron :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </aside>
    );
}

interface SectionProps {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    onAdd: () => void;
    items: ReactNode[];
}

function Section({ label, expanded, onToggle, onAdd, items }: SectionProps) {
    return (
        <div className="section">
            <div className="header">
                <button
                    type="button"
                    className="header-btn"
                    onClick={onToggle}
                    aria-expanded={expanded}
                >
                    <span className="header-label">{label}</span>
                </button>
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
                        <div className="empty">No items yet</div>
                    )}
                </div>
            )}

            <style jsx>{`
                .section {
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    display: flex;
                    align-items: center;
                    min-height: 32px;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .header:hover {
                    background-color: var(--color--neutral-100);
                }
                .header:hover .add-btn {
                    opacity: 1;
                }
                .header-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
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
                    padding: 0 16px 16px;
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

interface ArtifactItemProps {
    icon: ReactNode;
    name: string;
    onClick: () => void;
}

function ArtifactItem({ icon, name, onClick }: ArtifactItemProps) {
    return (
        <button type="button" className="item" onClick={onClick}>
            <span className="icon">{icon}</span>
            <span className="name">{name}</span>
            <span className="arrow">
                <ArrowUpRight />
            </span>

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
                .arrow {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .arrow :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </button>
    );
}

function resourceIcon(resource: Resource): ReactNode {
    return resource.type === "agent" ? <Bot /> : <Workflow />;
}

function knowledgeIcon(item: KnowledgeItem): ReactNode {
    if (item.kind === "link") return <Link2 />;
    if (item.kind === "integration") return <Database />;
    return <File />;
}
