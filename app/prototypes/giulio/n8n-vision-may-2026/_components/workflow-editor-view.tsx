"use client";

import { useMemo, useState } from "react";
import { User, Plus, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import {
    WorkflowCanvas,
    type WorkflowCanvasNode,
    type WorkflowCanvasEdge,
    type ServiceId,
} from "@/components/n8n/workflow-canvas";

type EditorTab = "editor" | "executions" | "evaluations";

export function WorkflowEditorView() {
    const currentWorkflow = useStore((s) => s.currentWorkflow);
    const [tab, setTab] = useState<EditorTab>("editor");

    const nodes: WorkflowCanvasNode[] = useMemo(() => {
        if (!currentWorkflow) return [];
        return currentWorkflow.nodes.map(
            (n) =>
                ({
                    id: n.id,
                    type: n.isTrigger ? "trigger" : "action",
                    service: n.icon as ServiceId,
                    label: n.name,
                    sublabel: n.operation,
                    position: n.position,
                }) as WorkflowCanvasNode,
        );
    }, [currentWorkflow]);

    const edges: WorkflowCanvasEdge[] = useMemo(() => {
        if (!currentWorkflow) return [];
        return currentWorkflow.connections.map((c) => ({
            id: c.id,
            source: c.sourceId,
            target: c.targetId,
        }));
    }, [currentWorkflow]);

    return (
        <div className="workflow-editor-view">
            <header className="topbar">
                <div className="left">
                    <span className="breadcrumb">
                        <span className="crumb">
                            <User />
                            <span>Personal</span>
                        </span>
                        <span className="sep">/</span>
                        <span className="crumb workflow-name">
                            {currentWorkflow?.name ?? "Untitled workflow"}
                        </span>
                    </span>
                    <button type="button" className="add-tag">
                        <Plus />
                        <span>Add tag</span>
                    </button>
                </div>

                <div className="center">
                    <div className="tabs">
                        {(["editor", "executions", "evaluations"] as const).map(
                            (id) => (
                                <button
                                    key={id}
                                    type="button"
                                    data-active={tab === id ? "true" : undefined}
                                    onClick={() => setTab(id)}
                                >
                                    {id === "editor"
                                        ? "Editor"
                                        : id === "executions"
                                          ? "Executions"
                                          : "Evaluations"}
                                </button>
                            ),
                        )}
                    </div>
                </div>

                <div className="right">
                    <span className="status">
                        <AlertTriangle />
                        <span>Inactive</span>
                    </span>
                    <button type="button" className="save-btn">
                        Saved
                    </button>
                </div>
            </header>

            <div className="canvas-area">
                <WorkflowCanvas
                    key={currentWorkflow?.id ?? "empty"}
                    initialNodes={nodes}
                    initialEdges={edges}
                />
            </div>

            <style jsx>{`
                .workflow-editor-view {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    background: var(--color--background--light-2, #f5f5f5);
                }
                .topbar {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    background: var(--color--neutral-white);
                    border-bottom: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    flex-shrink: 0;
                }
                .left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    min-width: 0;
                }
                .breadcrumb {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    min-width: 0;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                }
                .crumb {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    min-width: 0;
                }
                .crumb :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .workflow-name {
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .sep {
                    color: var(--color--neutral-300);
                }
                .add-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    height: var(--height--sm);
                    padding: 0 var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    font-size: var(--font-size--xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .add-tag:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .add-tag :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                .center {
                    display: flex;
                    justify-content: center;
                }
                .tabs {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--md);
                }
                .tabs button {
                    height: 32px;
                    padding: 0 var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-bottom: 2px solid transparent;
                    color: var(--color--neutral-500);
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    cursor: pointer;
                    transition: color var(--duration--snappy)
                            var(--easing--ease-out),
                        border-color var(--duration--snappy)
                            var(--easing--ease-out);
                }
                .tabs button:hover {
                    color: var(--color--neutral-700);
                }
                .tabs button[data-active="true"] {
                    color: var(--color--neutral-800);
                    border-bottom-color: var(--color--neutral-800);
                }

                .right {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: var(--spacing--2xs);
                }
                .status {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                }
                .status :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-400);
                }
                .save-btn {
                    height: var(--height--sm);
                    padding: 0 var(--spacing--xs);
                    border: 1px solid var(--color--black-alpha-200);
                    background: var(--color--neutral-white);
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-700);
                    font-size: var(--font-size--xs);
                    cursor: pointer;
                }
                .save-btn:hover {
                    background-color: var(--color--neutral-50);
                }

                .canvas-area {
                    flex: 1;
                    position: relative;
                    min-height: 0;
                }
            `}</style>
        </div>
    );
}
