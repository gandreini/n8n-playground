// components/n8n/workflow-canvas/service-catalog.ts
import type { ServiceId } from './types'

export type ServiceKind = 'trigger' | 'action'

export interface ServiceCatalogEntry {
  id: ServiceId
  label: string
  kind: ServiceKind
}

export const SERVICE_CATALOG: ServiceCatalogEntry[] = [
  { id: 'webhook',         label: 'Webhook',          kind: 'trigger' },
  { id: 'clock',           label: 'Schedule',         kind: 'trigger' },
  { id: 'http',            label: 'HTTP Request',     kind: 'action'  },
  { id: 'gmail',           label: 'Gmail',            kind: 'action'  },
  { id: 'slack',           label: 'Slack',            kind: 'action'  },
  { id: 'google-calendar', label: 'Google Calendar',  kind: 'action'  },
  { id: 'spotify',         label: 'Spotify',          kind: 'action'  },
  { id: 'switch',          label: 'Switch',           kind: 'action'  },
  { id: 'code',            label: 'Code',             kind: 'action'  },
  { id: 'ai',              label: 'AI Agent',         kind: 'action'  },
]

export function findService(id: ServiceId): ServiceCatalogEntry | undefined {
  return SERVICE_CATALOG.find((s) => s.id === id)
}
