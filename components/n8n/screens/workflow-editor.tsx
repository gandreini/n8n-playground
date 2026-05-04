'use client'

import { useMemo } from 'react'
import { ChevronsRight, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import {
  WorkflowCanvas,
  type WorkflowCanvasNode,
  type WorkflowCanvasEdge,
  type ServiceId,
} from '@/components/n8n/workflow-canvas'

export function WorkflowEditor() {
  const currentWorkflow = useStore((s) => s.currentWorkflow)
  const closeWorkflow = useStore((s) => s.closeWorkflow)

  const nodes: WorkflowCanvasNode[] = useMemo(() => {
    if (!currentWorkflow) return []
    return currentWorkflow.nodes.map((n) => ({
      id: n.id,
      type: n.isTrigger ? 'trigger' : 'action',
      service: n.icon as ServiceId,
      label: n.name,
      sublabel: n.operation,
      position: n.position,
    } as WorkflowCanvasNode))
  }, [currentWorkflow])

  const edges: WorkflowCanvasEdge[] = useMemo(() => {
    if (!currentWorkflow) return []
    return currentWorkflow.connections.map((c) => ({
      id: c.id,
      source: c.sourceId,
      target: c.targetId,
    }))
  }, [currentWorkflow])

  return (
    <div className="workflow-editor-screen">
      <header className="topbar">
        <button type="button" className="back-btn" onClick={closeWorkflow} aria-label="Back to overview">
          <ChevronsRight size={16} />
        </button>
        <div className="title">{currentWorkflow?.name ?? 'Untitled workflow'}</div>
        <button type="button" className="external-btn" aria-label="Open in n8n">
          <ArrowUpRight size={16} />
        </button>
      </header>
      <div className="canvas-area">
        <WorkflowCanvas
          key={currentWorkflow?.id ?? 'empty'}
          initialNodes={nodes}
          initialEdges={edges}
        />
      </div>

      <style jsx>{`
        .workflow-editor-screen {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background: var(--color--background--light-2, #f5f5f5);
        }
        /* ArtifactPanel/Header – Figma 125:3048 */
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: var(--background--surface, #ffffff);
          border-bottom: 1px solid var(--color--foreground--tint-1, #e0e0e0);
          flex-shrink: 0;
        }
        .back-btn,
        .external-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          border-radius: 6px;
          color: var(--color--text, #3d3d3d);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .back-btn:hover,
        .external-btn:hover {
          background: var(--background--surface--hover, var(--color--neutral-100));
        }
        .title {
          flex: 1;
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: var(--color--text, #3d3d3d);
          padding: 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .canvas-area {
          flex: 1;
          position: relative;
          min-height: 0;
        }
      `}</style>
    </div>
  )
}
