// app/__canvas-test/page.tsx
'use client'

import { WorkflowCanvas, type WorkflowCanvasNode, type WorkflowCanvasEdge } from '@/components/n8n/workflow-canvas'

const nodes: WorkflowCanvasNode[] = [
  { id: '1', type: 'trigger', service: 'webhook', label: 'Webhook',  sublabel: 'GET',  position: { x:   0, y: 100 } },
  { id: '2', type: 'action',  service: 'ai',      label: 'AI Agent',                   position: { x: 240, y: 100 } },
  { id: '3', type: 'action',  service: 'gmail',   label: 'Send Email',                 position: { x: 480, y: 100 } },
  { id: '4', type: 'sticky',  color: 'yellow', text: 'Daily 9am summary',
    position: { x: 0, y: -120 }, width: 220, height: 80 },
]

const edges: WorkflowCanvasEdge[] = [
  { id: 'e1', source: '1', target: '2' },
  { id: 'e2', source: '2', target: '3' },
]

export default function CanvasTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <WorkflowCanvas initialNodes={nodes} initialEdges={edges} />
    </div>
  )
}
