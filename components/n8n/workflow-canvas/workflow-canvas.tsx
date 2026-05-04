// components/n8n/workflow-canvas/workflow-canvas.tsx
'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react'
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
        <Controls position="bottom-left" />
      </ReactFlow>
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
