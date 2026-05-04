// components/n8n/workflow-canvas/types.ts

export type ServiceId =
  | 'webhook'
  | 'http'
  | 'gmail'
  | 'slack'
  | 'google-calendar'
  | 'spotify'
  | 'clock'
  | 'switch'
  | 'code'
  | 'ai'

export interface BaseNodeData {
  [key: string]: unknown
  id: string
  position: { x: number; y: number }
}

export interface ActionNodeData extends BaseNodeData {
  type: 'action'
  service: ServiceId
  label: string
  sublabel?: string
}

export interface TriggerNodeData extends BaseNodeData {
  type: 'trigger'
  service: ServiceId
  label: string
  sublabel?: string
}

export type StickyColor = 'yellow' | 'blue' | 'green' | 'pink'

export interface StickyNodeData extends BaseNodeData {
  type: 'sticky'
  text: string
  color: StickyColor
  width: number
  height: number
}

export type WorkflowCanvasNode =
  | ActionNodeData
  | TriggerNodeData
  | StickyNodeData

export interface WorkflowCanvasEdge {
  id: string
  source: string
  target: string
}
