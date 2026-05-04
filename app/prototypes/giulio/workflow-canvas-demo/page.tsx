'use client'

import {
  WorkflowCanvas,
  type WorkflowCanvasNode,
  type WorkflowCanvasEdge,
} from '@/components/n8n/workflow-canvas'

const initialNodes: WorkflowCanvasNode[] = [
  { id: 't1', type: 'trigger', service: 'webhook', label: 'Webhook',          sublabel: 'GET',
    position: { x:   0, y: 200 } },
  { id: 't2', type: 'trigger', service: 'chat',   label: 'When chat received',
    position: { x:   0, y: 360 } },
  { id: 'a1', type: 'action',  service: 'ai',      label: 'AI Agent',
    position: { x: 280, y: 280 } },
  { id: 'a2', type: 'action',  service: 'http',    label: 'HTTP Request',     sublabel: 'GET',
    position: { x: 540, y: 280 } },
  { id: 'a3', type: 'action',  service: 'gmail',   label: 'Send Email',
    position: { x: 800, y: 280 } },
  { id: 's1', type: 'sticky',  color: 'yellow',
    text: 'This demo shows the embeddable WorkflowCanvas component. Drag nodes, connect them, delete, or add new ones with the toolbar.',
    position: { x: 0, y: 0 }, width: 360, height: 110 },
]

const initialEdges: WorkflowCanvasEdge[] = [
  { id: 'e1', source: 't1', target: 'a1' },
  { id: 'e2', source: 't2', target: 'a1' },
  { id: 'e3', source: 'a1', target: 'a2' },
  { id: 'e4', source: 'a2', target: 'a3' },
]

export default function WorkflowCanvasDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowCanvas initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  )
}
