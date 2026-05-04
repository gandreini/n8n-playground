// components/n8n/workflow-canvas/workflow-canvas.tsx
'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
import { Maximize2, Plus, Minus } from 'lucide-react'
import '@xyflow/react/dist/style.css'

import type {
  WorkflowCanvasNode,
  WorkflowCanvasEdge,
} from './types'
import { ActionNode } from './nodes/action-node'
import { TriggerNode } from './nodes/trigger-node'
import { StickyNode } from './nodes/sticky-node'
import { AddNodeToolbar } from './add-node-toolbar'

interface WorkflowCanvasProps {
  initialNodes: WorkflowCanvasNode[]
  initialEdges: WorkflowCanvasEdge[]
}

function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  return (
    <div className="canvas-controls">
      <button type="button" className="ctrl-btn" onClick={() => fitView({ padding: 0.2, duration: 200 })} aria-label="Fit view">
        <Maximize2 size={14} />
      </button>
      <button type="button" className="ctrl-btn" onClick={() => zoomIn({ duration: 150 })} aria-label="Zoom in">
        <Plus size={14} />
      </button>
      <button type="button" className="ctrl-btn" onClick={() => zoomOut({ duration: 150 })} aria-label="Zoom out">
        <Minus size={14} />
      </button>

      <style jsx>{`
        .canvas-controls {
          position: absolute;
          bottom: var(--spacing--xs);
          left: var(--spacing--xs);
          display: flex;
          gap: var(--spacing--3xs);
          z-index: 10;
        }
        .ctrl-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--md, 6px);
          color: var(--color--neutral-700);
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .ctrl-btn:hover {
          background: var(--color--neutral-50);
          border-color: var(--color--neutral-300);
        }
      `}</style>
    </div>
  )
}

const NODE_TYPES = {
  action: ActionNode,
  trigger: TriggerNode,
  sticky: StickyNode,
}

function toReactFlowNode(n: WorkflowCanvasNode): Node {
  const base = {
    id: n.id,
    position: n.position,
    data: n,
  }
  if (n.type === 'sticky') {
    return {
      ...base,
      type: 'sticky',
      style: { width: n.width, height: n.height },
    }
  }
  return { ...base, type: n.type }
}

function toReactFlowEdge(e: WorkflowCanvasEdge): Edge {
  return { id: e.id, source: e.source, target: e.target, type: 'default' }
}

function WorkflowCanvasInner({ initialNodes, initialEdges }: WorkflowCanvasProps) {
  const rfInitialNodes = useMemo(() => initialNodes.map(toReactFlowNode), [initialNodes])
  const rfInitialEdges = useMemo(() => initialEdges.map(toReactFlowEdge), [initialEdges])

  const [nodes, setNodes, onNodesChange] = useNodesState(rfInitialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfInitialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="workflow-canvas-root">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
      </ReactFlow>
      <CanvasControls />
      <AddNodeToolbar onAdd={(newNode) => setNodes((nds) => [...nds, toReactFlowNode(newNode)])} />

      <style jsx>{`
        .workflow-canvas-root {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--color--neutral-50);
        }
      `}</style>
    </div>
  )
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
