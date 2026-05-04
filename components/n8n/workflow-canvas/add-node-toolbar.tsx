// components/n8n/workflow-canvas/add-node-toolbar.tsx
'use client'

import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { NodePicker } from './node-picker'
import type {
  WorkflowCanvasNode,
  ActionNodeData,
  TriggerNodeData,
  StickyNodeData,
  StickyColor,
} from './types'
import type { ServiceCatalogEntry } from './service-catalog'

interface AddNodeToolbarProps {
  onAdd: (node: WorkflowCanvasNode) => void
}

let nodeIdCounter = 1
function nextNodeId(): string {
  const id = `n_${Date.now()}_${nodeIdCounter}`
  nodeIdCounter += 1
  return id
}

export function AddNodeToolbar({ onAdd }: AddNodeToolbarProps) {
  const [open, setOpen] = useState(false)
  const reactFlow = useReactFlow()

  const viewportCenter = useCallback(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 }
    return reactFlow.screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
  }, [reactFlow])

  const handlePickService = (service: ServiceCatalogEntry) => {
    const pos = viewportCenter()
    if (service.kind === 'trigger') {
      const node: TriggerNodeData = {
        id: nextNodeId(),
        type: 'trigger',
        service: service.id,
        label: service.label,
        position: pos,
      }
      onAdd(node)
    } else {
      const node: ActionNodeData = {
        id: nextNodeId(),
        type: 'action',
        service: service.id,
        label: service.label,
        position: pos,
      }
      onAdd(node)
    }
    setOpen(false)
  }

  const handlePickSticky = (color: StickyColor) => {
    const pos = viewportCenter()
    const node: StickyNodeData = {
      id: nextNodeId(),
      type: 'sticky',
      color,
      text: 'New note',
      position: pos,
      width: 220,
      height: 100,
    }
    onAdd(node)
    setOpen(false)
  }

  return (
    <div className="toolbar">
      <button
        type="button"
        className="add-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Plus size={14} />
        <span>Add node</span>
      </button>
      <NodePicker
        open={open}
        onClose={() => setOpen(false)}
        onPickService={handlePickService}
        onPickSticky={handlePickSticky}
      />

      <style jsx>{`
        .toolbar {
          position: absolute;
          top: var(--spacing--xs);
          right: var(--spacing--xs);
          z-index: 10;
        }
        .add-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--xs);
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--md, 6px);
          font-size: var(--font-size--sm, 13px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-800);
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .add-btn:hover {
          background: var(--color--neutral-50);
          border-color: var(--color--neutral-300);
        }
      `}</style>
    </div>
  )
}
