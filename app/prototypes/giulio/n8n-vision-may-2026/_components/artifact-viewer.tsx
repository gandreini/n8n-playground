"use client";

import { useMemo } from "react";
import { X, Maximize2, Workflow as WorkflowIcon } from "lucide-react";
import type { ReactNode } from "react";
import { sampleWorkflow } from "@/lib/store";
import {
    WorkflowCanvas,
    type WorkflowCanvasNode,
    type WorkflowCanvasEdge,
    type ServiceId,
} from "@/components/n8n/workflow-canvas";

export type ArtifactType =
    | "workflow"
    | "agent"
    | "table"
    | "document"
    | "knowledge";

export interface SelectedArtifact {
    type: ArtifactType;
    name: string;
}

interface ArtifactViewerProps {
    artifact: SelectedArtifact;
    onClose: () => void;
    /** Optional: open the artifact in its full-screen editor. Hidden when omitted. */
    onOpenFull?: () => void;
    /** Override the default width (480px). */
    width?: number;
}

export function ArtifactViewer({
    artifact,
    onClose,
    onOpenFull,
    width,
}: ArtifactViewerProps) {
    return (
        <aside
            className="artifact-viewer"
            aria-label={`${artifact.name} preview`}
            style={width ? { width } : undefined}
        >
            <div className="header">
                <div className="header-left">
                    <span className="header-icon">
                        <WorkflowIcon />
                    </span>
                    <span className="header-name" title={artifact.name}>
                        {artifact.name}
                    </span>
                </div>
                <div className="header-right">
                    {onOpenFull && (
                        <button
                            type="button"
                            className="open-full"
                            onClick={onOpenFull}
                        >
                            <Maximize2 />
                            <span>Open</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="icon-btn"
                        onClick={onClose}
                        aria-label="Close artifact"
                    >
                        <X />
                    </button>
                </div>
            </div>

            <div className="body">
                {artifact.type === "workflow" ? (
                    <WorkflowPreview />
                ) : (
                    <PlaceholderPreview type={artifact.type} />
                )}
            </div>

            <style jsx>{`
                .artifact-viewer {
                    width: 480px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                }
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing--3xs);
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    flex-shrink: 0;
                    border-bottom: 1px solid var(--color--neutral-150);
                }
                .header-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    min-width: 0;
                    flex: 1;
                }
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                }
                .header-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .header-icon :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .header-name {
                    font-family: var(--font-mono);
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: var(--font-weight--medium);
                }
                .open-full {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    height: 28px;
                    padding: 0 var(--spacing--2xs);
                    border: 1px solid var(--color--black-alpha-200);
                    background-color: var(--color--neutral-white);
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .open-full:hover {
                    background-color: var(--color--neutral-50);
                }
                .open-full :global(svg) {
                    width: 12px;
                    height: 12px;
                }
                .icon-btn {
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
                .icon-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .icon-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .body {
                    flex: 1;
                    min-height: 0;
                    overflow: hidden;
                    position: relative;
                    background-color: var(--color--background--light-2, #f5f5f5);
                }
            `}</style>
        </aside>
    );
}

function WorkflowPreview() {
    const nodes: WorkflowCanvasNode[] = useMemo(
        () =>
            sampleWorkflow.nodes.map(
                (n) =>
                    ({
                        id: n.id,
                        type: n.isTrigger ? "trigger" : "action",
                        service: n.icon as ServiceId,
                        label: n.name,
                        sublabel: n.operation,
                        position: n.position,
                    } as WorkflowCanvasNode)
            ),
        []
    );
    const edges: WorkflowCanvasEdge[] = useMemo(
        () =>
            sampleWorkflow.connections.map((c) => ({
                id: c.id,
                source: c.sourceId,
                target: c.targetId,
            })),
        []
    );
    return (
        <div className="preview-canvas">
            <WorkflowCanvas initialNodes={nodes} initialEdges={edges} />
            <style jsx>{`
                .preview-canvas {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    );
}

function PlaceholderPreview({ type }: { type: ArtifactType }) {
    const labels: Record<ArtifactType, string> = {
        workflow: "Workflow",
        agent: "Agent",
        table: "Data table",
        document: "Document",
        knowledge: "Knowledge",
    };
    return (
        <div className="placeholder" role="img" aria-label={`${labels[type]} preview`}>
            <span>{labels[type]} preview</span>
            <style jsx>{`
                .placeholder {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                    font-style: italic;
                }
            `}</style>
        </div>
    );
}

/** Convenience type for components that hold an open artifact. */
export type ArtifactSelectionHandler = (artifact: SelectedArtifact) => void;
export type { ReactNode };
