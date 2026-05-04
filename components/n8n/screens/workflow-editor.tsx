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
          background: var(--color--neutral-50);
        }
        .topbar {
          display: flex;
          align-items: center;
          height: 44px;
          padding: 0 var(--spacing--xs);
          background: var(--color--neutral-white);
          border-bottom: 1px solid var(--color--neutral-200);
          flex-shrink: 0;
        }
        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: var(--radius--sm, 4px);
          color: var(--color--neutral-700);
          cursor: pointer;
        }
        .back-btn:hover {
          background: var(--color--neutral-100);
        }
        .title {
          flex: 1;
          text-align: center;
          font-size: var(--font-size--sm, 13px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
        }
        .external-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          border-radius: var(--radius--sm, 4px);
          color: var(--color--neutral-700);
          cursor: pointer;
        }
        .external-btn:hover {
          background: var(--color--neutral-100);
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
