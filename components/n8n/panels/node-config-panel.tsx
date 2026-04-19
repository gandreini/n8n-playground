'use client'

import { useStore } from '@/lib/store'
import { useState } from 'react'
import {
  X,
  ExternalLink,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Play,
  Pencil,
  Pin,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Switch } from '@/components/shadcn/switch'
import { ServiceIcon } from '../shared/service-icon'
import { toast } from 'sonner'

type DataViewTab = 'schema' | 'table' | 'json'
type ConfigTab = 'parameters' | 'settings'

// Mock input data
const mockInputData = {
  timestamp: '2026-03-20T10:16:15.190+01:00',
  'Readable date': 'March 20th 2026, 10:16:15 am',
  'Readable time': '10:16:15 am',
  'Day of week': 'Friday',
  Year: 2026,
  Month: 'March',
  'Day of month': 20,
  Hour: 10,
  Minute: 16,
  Second: 15,
  Timezone: 'Europe/Rome (UTC+01:00)',
}

// Mock output data
const mockOutputData = [
  {
    id: 'm2n17s1egabd4cj4p278nob8bk_20260320',
    summary: 'Home',
    start: { date: '2026-03-20' },
    end: { date: '2026-03-21' },
    creator: { email: 'giulio@n8n.io', self: true },
    organizer: { email: 'giulio@n8n.io', self: true },
    created: '2022-10-18T13:29:26.000Z',
    updated: '2024-01-25T12:16:55.166Z',
    etag: '"3412370030332000"',
    eventType: 'workingLocation',
    htmlLink: 'https://www.google.com/calendar/event?eid=...',
    iCalUID: 'm2n17s1egabd4cj4p278nob8bk@google.com',
    kind: 'calendar#event',
    originalStartTime: { date: '2026-03-20' },
    recurringEventId: 'm2n17s1egabd4cj4p278nob8bk',
  },
]

interface SchemaFieldProps {
  name: string
  value: string | number
  type: 'T' | 'N' | 'B'
}

function SchemaField({ name, value, type }: SchemaFieldProps) {
  return (
    <div className="schema-field">
      <span className="type-badge">{type}</span>
      <span className="field-name">{name}</span>
      <span className="field-value">{String(value)}</span>

      <style jsx>{`
        .schema-field {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding-block: var(--spacing--5xs);
        }
        .type-badge {
          padding: 2px 6px;
          font-size: var(--font-size--3xs);
          font-weight: var(--font-weight--medium);
          background-color: var(--color--neutral-100);
          color: var(--color--neutral-500);
          border-radius: var(--radius--3xs);
        }
        .field-name {
          font-size: var(--font-size--xs);
          color: var(--color--neutral-800);
        }
        .field-value {
          font-size: var(--font-size--xs);
          color: var(--color--neutral-400);
          margin-left: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 120px;
        }
      `}</style>
    </div>
  )
}

function DataViewToggle({
  activeTab,
  onTabChange,
}: {
  activeTab: DataViewTab
  onTabChange: (tab: DataViewTab) => void
}) {
  return (
    <div className="toggle">
      {(['schema', 'table', 'json'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          data-active={activeTab === tab ? 'true' : undefined}
          className="toggle-btn"
        >
          {tab === 'json' ? 'JSON' : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}

      <style jsx>{`
        .toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
          padding: var(--spacing--5xs);
          background-color: var(--color--neutral-50);
          border-radius: var(--radius--xs);
        }
        .toggle-btn {
          padding: var(--spacing--5xs) var(--spacing--2xs);
          font-size: var(--font-size--2xs);
          border: 0;
          background: transparent;
          border-radius: var(--radius--3xs);
          cursor: pointer;
          text-transform: capitalize;
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out),
            background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .toggle-btn:hover {
          color: var(--color--neutral-700);
        }
        .toggle-btn[data-active='true'] {
          background-color: #ffffff;
          color: var(--color--neutral-800);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  )
}

function JsonView({ data }: { data: unknown }) {
  const formatJson = (obj: unknown, indent = 0): React.ReactNode => {
    const indentStr = '  '.repeat(indent)

    if (obj === null) return <span style={{ color: 'var(--color--purple-600)' }}>null</span>
    if (typeof obj === 'boolean')
      return <span style={{ color: 'var(--color--purple-600)' }}>{String(obj)}</span>
    if (typeof obj === 'number')
      return <span style={{ color: 'var(--color--blue-500)' }}>{obj}</span>
    if (typeof obj === 'string')
      return <span style={{ color: 'var(--color--green-700)' }}>"{obj}"</span>

    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>
      return (
        <span>
          {'[\n'}
          {obj.map((item, i) => (
            <span key={i}>
              {indentStr} {formatJson(item, indent + 1)}
              {i < obj.length - 1 ? ',\n' : '\n'}
            </span>
          ))}
          {indentStr}]
        </span>
      )
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>)
      if (entries.length === 0) return <span>{'{}'}</span>
      return (
        <span>
          {'{\n'}
          {entries.map(([key, value], i) => (
            <span key={key}>
              {indentStr}{' '}
              <span style={{ color: 'var(--color--neutral-700)' }}>"{key}"</span>:{' '}
              {formatJson(value, indent + 1)}
              {i < entries.length - 1 ? ',\n' : '\n'}
            </span>
          ))}
          {indentStr}
          {'}'}
        </span>
      )
    }

    return <span>{String(obj)}</span>
  }

  return (
    <pre className="json-view">
      {formatJson(data)}

      <style jsx>{`
        .json-view {
          font-size: var(--font-size--xs);
          font-family: var(--font-family--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
          line-height: var(--line-height--relaxed, 1.625);
          overflow-x: auto;
        }
      `}</style>
    </pre>
  )
}

export function NodeConfigPanel() {
  const { currentWorkflow, selectedNodeId, closeNodeConfig, executeNode } = useStore()

  const [inputTab, setInputTab] = useState<DataViewTab>('schema')
  const [outputTab, setOutputTab] = useState<DataViewTab>('json')
  const [configTab, setConfigTab] = useState<ConfigTab>('parameters')
  const [leftWidth] = useState(280)
  const [rightWidth] = useState(350)
  const [hasOutput, setHasOutput] = useState(false)

  const selectedNode = currentWorkflow?.nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) return null

  const handleExecuteStep = () => {
    if (selectedNodeId) {
      executeNode(selectedNodeId)
      setHasOutput(true)
      toast.success('Node executed successfully')
    }
  }

  return (
    <div className="n8n-node-config-panel">
      {/* Backdrop */}
      <div className="backdrop" onClick={closeNodeConfig} />

      {/* Panel */}
      <div className="panel">
        {/* Header */}
        <div className="panel-header">
          <div className="header-left">
            <ServiceIcon service={selectedNode.icon} size={24} />
            <span className="node-name">{selectedNode.name}</span>
          </div>

          <div className="header-center">
            <GripVertical style={{ width: 16, height: 16, color: 'var(--color--neutral-300)' }} />
          </div>

          <div className="header-right">
            <a href="#" className="docs-link">
              Docs
              <ExternalLink style={{ width: 12, height: 12 }} />
            </a>
            <button onClick={closeNodeConfig} className="close-btn">
              <X style={{ width: 20, height: 20, color: 'var(--color--neutral-500)' }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="panel-content">
          {/* Left Column - INPUT */}
          <div className="column left" style={{ width: leftWidth }}>
            <div className="column-header">
              <div className="column-header-row">
                <span className="column-label">INPUT</span>
                <DataViewToggle activeTab={inputTab} onTabChange={setInputTab} />
              </div>
            </div>

            <div className="column-body n8n-scrollbar">
              {/* Source node */}
              <div style={{ marginBottom: 'var(--spacing--sm)' }}>
                <button className="source-node">
                  <div className="source-dot" />
                  <span className="source-name">Daily Check</span>
                  <Zap style={{ width: 12, height: 12, color: 'var(--color--orange-300)' }} />
                  <span className="source-count">1 item</span>
                  <ChevronDown
                    style={{ width: 12, height: 12, color: 'var(--color--neutral-400)' }}
                  />
                </button>
              </div>

              <p className="fields-note">
                The fields below come from the last successful execution.{' '}
                <button className="link">Execute node</button> to refresh them.
              </p>

              {inputTab === 'schema' && (
                <div className="schema-list">
                  {Object.entries(mockInputData).map(([key, value]) => (
                    <SchemaField
                      key={key}
                      name={key}
                      value={value}
                      type={typeof value === 'number' ? 'N' : 'T'}
                    />
                  ))}
                </div>
              )}

              {inputTab === 'json' && <JsonView data={[mockInputData]} />}

              {/* Variables section */}
              <div className="variables">
                <button className="variables-btn">
                  <ChevronRight style={{ width: 12, height: 12 }} />
                  Variables and context
                </button>
              </div>
            </div>
          </div>

          {/* Center Column - PARAMETERS */}
          <div className="column center">
            <div className="column-header">
              <div className="params-header-row">
                <div className="config-tabs">
                  {(['parameters', 'settings'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConfigTab(tab)}
                      data-active={configTab === tab ? 'true' : undefined}
                      className="config-tab"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <Button onClick={handleExecuteStep} className="execute-btn" size="sm">
                  <Play style={{ width: 12, height: 12, fill: 'white' }} />
                  Execute step
                </Button>
              </div>
            </div>

            <div className="column-body n8n-scrollbar center-body">
              {configTab === 'parameters' && (
                <div className="param-list">
                  {/* Credential */}
                  <div className="param">
                    <label className="param-label">Credential</label>
                    <div className="param-row">
                      <Select defaultValue="gcal">
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select credential" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gcal">Google Calendar account</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon">
                        <Pencil style={{ width: 16, height: 16 }} />
                      </Button>
                    </div>
                  </div>

                  {/* Resource */}
                  <div className="param">
                    <label className="param-label">Resource</label>
                    <Select defaultValue="event">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="calendar">Calendar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operation */}
                  <div className="param">
                    <label className="param-label">Operation</label>
                    <Select defaultValue="getMany">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="getMany">Get Many</SelectItem>
                        <SelectItem value="get">Get</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Calendar */}
                  <div className="param">
                    <label className="param-label">Calendar</label>
                    <div className="param-row">
                      <Select defaultValue="list">
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="list">From list</SelectItem>
                          <SelectItem value="id">By ID</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="giulio">
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="giulio">Giulio | n8n</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Return All */}
                  <div className="param-switch-row">
                    <label className="param-label">Return All</label>
                    <Switch defaultChecked />
                  </div>

                  {/* After */}
                  <div className="param">
                    <label className="param-label">After</label>
                    <div className="expr-field">
                      <span className="fx-badge">fx</span>
                      <code className="expr">{'{{ $now }}'}</code>
                      <button className="expr-edit">
                        <Pencil
                          style={{ width: 12, height: 12, color: 'var(--color--neutral-400)' }}
                        />
                      </button>
                    </div>
                    <p className="expr-hint">[DateTime: 2026-03-20T10:16:15.388+01:00]</p>
                  </div>

                  {/* Before */}
                  <div className="param">
                    <label className="param-label">Before</label>
                    <div className="expr-field">
                      <span className="fx-badge">fx</span>
                      <code className="expr">{'{{ $now.plus({ days: 30 }) }}'}</code>
                      <button className="expr-edit">
                        <Pencil
                          style={{ width: 12, height: 12, color: 'var(--color--neutral-400)' }}
                        />
                      </button>
                    </div>
                    <p className="expr-hint">[DateTime: 2026-04-19T10:16:15.389+02:00]</p>
                  </div>

                  {/* Options */}
                  <div className="param">
                    <label className="param-label">Options</label>
                    <p className="muted">No properties</p>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Add option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timezone">Timezone</SelectItem>
                        <SelectItem value="showDeleted">Show Deleted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Info box */}
                  <div className="info-box">
                    This node will use the time zone set in n8n's settings, but you can override
                    this in the workflow settings
                  </div>

                  {/* Feedback prompt */}
                  <div className="feedback">I wish this node would...</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - OUTPUT */}
          <div className="column right" style={{ width: rightWidth }}>
            <div className="column-header">
              <div className="column-header-row">
                <span className="column-label">OUTPUT</span>
                <div className="output-actions">
                  <DataViewToggle activeTab={outputTab} onTabChange={setOutputTab} />
                  <button className="icon-btn">
                    <Pencil
                      style={{ width: 12, height: 12, color: 'var(--color--neutral-400)' }}
                    />
                  </button>
                  <button className="icon-btn">
                    <Pin style={{ width: 12, height: 12, color: 'var(--color--neutral-400)' }} />
                  </button>
                </div>
              </div>
              {hasOutput && <p className="output-count">236 items</p>}
            </div>

            <div className="column-body n8n-scrollbar">
              {hasOutput ? (
                <>
                  {outputTab === 'json' && <JsonView data={mockOutputData} />}
                  {outputTab === 'schema' && (
                    <div className="schema-list">
                      {Object.keys(mockOutputData[0]).map((key) => (
                        <SchemaField
                          key={key}
                          name={key}
                          value={
                            typeof mockOutputData[0][key as keyof (typeof mockOutputData)[0]] ===
                            'object'
                              ? '[Object]'
                              : String(mockOutputData[0][key as keyof (typeof mockOutputData)[0]])
                          }
                          type="T"
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty">
                  <div className="empty-icon">
                    <ChevronRight
                      style={{ width: 24, height: 24, color: 'var(--color--neutral-400)' }}
                    />
                  </div>
                  <p className="empty-text">No output data</p>
                  <Button
                    variant="outline"
                    onClick={handleExecuteStep}
                    className="empty-cta"
                  >
                    <Play style={{ width: 12, height: 12 }} />
                    Execute step
                  </Button>
                  <p className="empty-hint">
                    or <button className="link">set mock data</button>
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {hasOutput && (
              <div className="pagination">
                <div className="page-buttons">
                  <button className="page-btn" data-active="true">
                    1
                  </button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn">4</button>
                  <span className="ellipsis">...</span>
                  <button className="page-btn">10</button>
                </div>
                <div className="page-size">
                  <span>Page Size</span>
                  <span className="page-size-value">25</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .n8n-node-config-panel {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
        }
        .backdrop {
          position: absolute;
          inset: 0;
          background-color: var(--color--black-alpha-300);
        }
        .panel {
          position: relative;
          margin: var(--spacing--sm);
          flex: 1;
          background-color: #ffffff;
          border-radius: var(--radius--md);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .panel-header {
          height: 48px;
          padding-inline: var(--spacing--sm);
          border-bottom: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
        }
        .node-name {
          font-size: var(--font-size--md);
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-800);
        }
        .header-center {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
        }
        .docs-link {
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
          font-size: var(--font-size--sm);
          color: var(--color--neutral-500);
          text-decoration: none;
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .docs-link:hover {
          color: var(--color--neutral-700);
        }
        .close-btn {
          padding: var(--spacing--5xs);
          border: 0;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius--3xs);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .close-btn:hover {
          background-color: var(--color--neutral-100);
        }
        .panel-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        .column {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .column.left {
          border-right: 1px solid var(--color--neutral-150);
        }
        .column.center {
          flex: 1;
        }
        .column.right {
          border-left: 1px solid var(--color--neutral-150);
        }
        .column-header {
          padding: var(--spacing--2xs);
          border-bottom: 1px solid var(--color--neutral-150);
        }
        .column-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing--2xs);
        }
        .column-header-row:last-child {
          margin-bottom: 0;
        }
        .column-label {
          font-size: var(--font-size--2xs);
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .output-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .icon-btn {
          padding: var(--spacing--5xs);
          border: 0;
          background: transparent;
          cursor: pointer;
          border-radius: var(--radius--3xs);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .icon-btn:hover {
          background-color: var(--color--neutral-100);
        }
        .output-count {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-500);
        }
        .column-body {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing--2xs);
        }
        .center-body {
          padding: var(--spacing--sm);
        }

        /* Source node */
        .source-node {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs);
          background-color: var(--color--neutral-50);
          border: 0;
          border-radius: var(--radius--xs);
          text-align: left;
          cursor: pointer;
        }
        .source-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--color--green-500);
        }
        .source-name {
          flex: 1;
          font-size: var(--font-size--xs);
          color: var(--color--neutral-700);
        }
        .source-count {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
        }
        .fields-note {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
          margin-bottom: var(--spacing--sm);
        }
        .link {
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--color--orange-300);
        }
        .link:hover {
          text-decoration: underline;
        }
        .schema-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--5xs);
        }
        .variables {
          margin-top: var(--spacing--sm);
          padding-top: var(--spacing--sm);
          border-top: 1px solid var(--color--neutral-100);
        }
        .variables-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          font-size: var(--font-size--xs);
          color: var(--color--neutral-500);
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }

        /* Center column */
        .params-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .config-tabs {
          display: flex;
          align-items: center;
          gap: var(--spacing--sm);
        }
        .config-tab {
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--medium);
          text-transform: capitalize;
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .config-tab:hover {
          color: var(--color--neutral-700);
        }
        .config-tab[data-active='true'] {
          color: var(--color--orange-300);
        }
        .execute-btn {
          background-color: var(--color--orange-300) !important;
          color: #ffffff !important;
          gap: var(--spacing--3xs);
        }
        .execute-btn:hover {
          background-color: var(--color--orange-400) !important;
        }

        /* Params */
        .param-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--sm);
        }
        .param {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--3xs);
        }
        .param-switch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .param-label {
          font-size: var(--font-size--xs);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-700);
        }
        .param-row {
          display: flex;
          gap: var(--spacing--3xs);
        }
        .expr-field {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--3xs);
          background-color: #ffffff;
        }
        .fx-badge {
          padding: 2px 6px;
          font-size: var(--font-size--3xs);
          background-color: var(--color--neutral-100);
          color: var(--color--neutral-500);
          border-radius: var(--radius--3xs);
        }
        .expr {
          flex: 1;
          font-size: var(--font-size--xs);
          color: var(--color--orange-300);
          font-family: var(--font-family--mono, ui-monospace, SFMono-Regular, Menlo, monospace);
        }
        .expr-edit {
          padding: var(--spacing--5xs);
          background: transparent;
          border: 0;
          cursor: pointer;
          border-radius: var(--radius--3xs);
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .expr-edit:hover {
          background-color: var(--color--neutral-100);
        }
        .expr-hint {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
        }
        .muted {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
        }
        .info-box {
          padding: var(--spacing--2xs);
          background-color: var(--color--yellow-100);
          border-radius: var(--radius--xs);
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-700);
        }
        .feedback {
          padding-top: var(--spacing--sm);
          font-size: var(--font-size--xs);
          color: var(--color--neutral-300);
        }

        /* Empty state */
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .empty-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: var(--color--neutral-100);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--spacing--sm);
        }
        .empty-text {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-500);
          margin-bottom: var(--spacing--sm);
        }
        .empty-cta {
          gap: var(--spacing--3xs);
          color: var(--color--orange-300) !important;
          border-color: var(--color--orange-300) !important;
        }
        .empty-cta:hover {
          background-color: var(--color--orange-50) !important;
        }
        .empty-hint {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
          margin-top: var(--spacing--3xs);
        }

        /* Pagination */
        .pagination {
          padding: var(--spacing--2xs);
          border-top: 1px solid var(--color--neutral-150);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .page-buttons {
          display: flex;
          align-items: center;
          gap: var(--spacing--5xs);
        }
        .page-btn {
          width: 24px;
          height: 24px;
          font-size: var(--font-size--xs);
          background: transparent;
          border: 0;
          color: var(--color--neutral-500);
          border-radius: var(--radius--3xs);
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .page-btn:hover {
          background-color: var(--color--neutral-100);
        }
        .page-btn[data-active='true'] {
          border: 1px solid var(--color--orange-300);
          color: var(--color--orange-300);
        }
        .ellipsis {
          font-size: var(--font-size--xs);
          color: var(--color--neutral-400);
        }
        .page-size {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          font-size: var(--font-size--xs);
          color: var(--color--neutral-500);
        }
        .page-size-value {
          font-weight: var(--font-weight--medium);
        }
      `}</style>
    </div>
  )
}
