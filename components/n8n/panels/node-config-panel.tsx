'use client'

import { useStore, WorkflowNode } from '@/lib/store'
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
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
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
  Timezone: 'Europe/Rome (UTC+01:00)'
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
    recurringEventId: 'm2n17s1egabd4cj4p278nob8bk'
  }
]

interface SchemaFieldProps {
  name: string
  value: string | number
  type: 'T' | 'N' | 'B'
}

function SchemaField({ name, value, type }: SchemaFieldProps) {
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="px-1.5 py-0.5 text-[var(--font-size--3xs)] font-[var(--font-weight--medium)] bg-[var(--color--neutral-100)] text-[var(--color--neutral-500)] rounded">
        {type}
      </span>
      <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-800)]">{name}</span>
      <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-400)] ml-auto truncate max-w-[120px]">
        {String(value)}
      </span>
    </div>
  )
}

function DataViewToggle({ 
  activeTab, 
  onTabChange 
}: { 
  activeTab: DataViewTab
  onTabChange: (tab: DataViewTab) => void 
}) {
  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--color--neutral-50)] rounded-[var(--radius--xs)]">
      {(['schema', 'table', 'json'] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            'px-3 py-1 text-[var(--font-size--2xs)] rounded-[var(--radius--3xs)] transition-snappy capitalize',
            activeTab === tab
              ? 'bg-white text-[var(--color--neutral-800)] shadow-sm'
              : 'text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]'
          )}
        >
          {tab === 'json' ? 'JSON' : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )
}

function JsonView({ data }: { data: unknown }) {
  const formatJson = (obj: unknown, indent = 0): React.ReactNode => {
    const indentStr = '  '.repeat(indent)
    
    if (obj === null) return <span className="text-[var(--color--purple-600)]">null</span>
    if (typeof obj === 'boolean') return <span className="text-[var(--color--purple-600)]">{String(obj)}</span>
    if (typeof obj === 'number') return <span className="text-[var(--color--blue-500)]">{obj}</span>
    if (typeof obj === 'string') return <span className="text-[var(--color--green-700)]">"{obj}"</span>
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return <span>[]</span>
      return (
        <span>
          {'[\n'}
          {obj.map((item, i) => (
            <span key={i}>
              {indentStr}  {formatJson(item, indent + 1)}
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
              {indentStr}  <span className="text-[var(--color--neutral-700)]">"{key}"</span>: {formatJson(value, indent + 1)}
              {i < entries.length - 1 ? ',\n' : '\n'}
            </span>
          ))}
          {indentStr}{'}'}
        </span>
      )
    }
    
    return <span>{String(obj)}</span>
  }
  
  return (
    <pre className="text-[var(--font-size--xs)] font-mono leading-relaxed overflow-x-auto">
      {formatJson(data)}
    </pre>
  )
}

export function NodeConfigPanel() {
  const { 
    currentWorkflow, 
    selectedNodeId, 
    closeNodeConfig,
    executeNode
  } = useStore()
  
  const [inputTab, setInputTab] = useState<DataViewTab>('schema')
  const [outputTab, setOutputTab] = useState<DataViewTab>('json')
  const [configTab, setConfigTab] = useState<ConfigTab>('parameters')
  const [leftWidth, setLeftWidth] = useState(280)
  const [rightWidth, setRightWidth] = useState(350)
  const [hasOutput, setHasOutput] = useState(false)
  
  const selectedNode = currentWorkflow?.nodes.find(n => n.id === selectedNodeId)
  
  if (!selectedNode) return null
  
  const handleExecuteStep = () => {
    if (selectedNodeId) {
      executeNode(selectedNodeId)
      setHasOutput(true)
      toast.success('Node executed successfully')
    }
  }
  
  return (
    <div className="n8n-node-config-panel fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[var(--color--black-alpha-300)]"
        onClick={closeNodeConfig}
      />
      
      {/* Panel */}
      <div className="relative m-4 flex-1 bg-white rounded-[var(--radius--md)] shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-12 px-4 border-b border-[var(--color--neutral-150)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ServiceIcon service={selectedNode.icon} size={24} />
            <span className="text-[var(--font-size--md)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
              {selectedNode.name}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-[var(--color--neutral-300)]" />
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              className="flex items-center gap-1 text-[var(--font-size--sm)] text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]"
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <button 
              onClick={closeNodeConfig}
              className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy"
            >
              <X className="w-5 h-5 text-[var(--color--neutral-500)]" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column - INPUT */}
          <div 
            className="border-r border-[var(--color--neutral-150)] flex flex-col overflow-hidden"
            style={{ width: leftWidth }}
          >
            <div className="p-3 border-b border-[var(--color--neutral-150)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--font-size--2xs)] font-[var(--font-weight--bold)] text-[var(--color--neutral-400)] uppercase tracking-wider">
                  INPUT
                </span>
                <DataViewToggle activeTab={inputTab} onTabChange={setInputTab} />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 n8n-scrollbar">
              {/* Source node */}
              <div className="mb-4">
                <button className="w-full flex items-center gap-2 p-2 bg-[var(--color--neutral-50)] rounded-[var(--radius--xs)] text-left">
                  <div className="w-2 h-2 rounded-full bg-[var(--color--green-500)]" />
                  <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-700)] flex-1">
                    Daily Check
                  </span>
                  <Zap className="w-3 h-3 text-[var(--color--orange-300)]" />
                  <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)]">1 item</span>
                  <ChevronDown className="w-3 h-3 text-[var(--color--neutral-400)]" />
                </button>
              </div>
              
              <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] mb-4">
                The fields below come from the last successful execution.{' '}
                <button className="text-[var(--color--orange-300)] hover:underline">
                  Execute node
                </button>
                {' '}to refresh them.
              </p>
              
              {inputTab === 'schema' && (
                <div className="space-y-1">
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
              <div className="mt-4 pt-4 border-t border-[var(--color--neutral-100)]">
                <button className="flex items-center gap-2 text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">
                  <ChevronRight className="w-3 h-3" />
                  Variables and context
                </button>
              </div>
            </div>
          </div>
          
          {/* Center Column - PARAMETERS */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-[var(--color--neutral-150)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(['parameters', 'settings'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setConfigTab(tab)}
                      className={cn(
                        'text-[var(--font-size--sm)] font-[var(--font-weight--medium)] capitalize',
                        configTab === tab
                          ? 'text-[var(--color--orange-300)]'
                          : 'text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]'
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleExecuteStep}
                  className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white gap-2"
                  size="sm"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Execute step
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 n8n-scrollbar">
              {configTab === 'parameters' && (
                <div className="space-y-4">
                  {/* Credential */}
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Credential
                    </label>
                    <div className="flex gap-2">
                      <Select defaultValue="gcal">
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select credential" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gcal">Google Calendar account</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Resource */}
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Resource
                    </label>
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
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Operation
                    </label>
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
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Calendar
                    </label>
                    <div className="flex gap-2">
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
                  <div className="flex items-center justify-between">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Return All
                    </label>
                    <Switch defaultChecked />
                  </div>
                  
                  {/* After */}
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      After
                    </label>
                    <div className="flex items-center gap-2 p-2 border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] bg-white">
                      <span className="px-1.5 py-0.5 text-[var(--font-size--3xs)] bg-[var(--color--neutral-100)] text-[var(--color--neutral-500)] rounded">
                        fx
                      </span>
                      <code className="text-[var(--font-size--xs)] text-[var(--color--orange-300)] font-mono flex-1">
                        {'{{ $now }}'}
                      </code>
                      <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded">
                        <Pencil className="w-3 h-3 text-[var(--color--neutral-400)]" />
                      </button>
                    </div>
                    <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)]">
                      [DateTime: 2026-03-20T10:16:15.388+01:00]
                    </p>
                  </div>
                  
                  {/* Before */}
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Before
                    </label>
                    <div className="flex items-center gap-2 p-2 border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] bg-white">
                      <span className="px-1.5 py-0.5 text-[var(--font-size--3xs)] bg-[var(--color--neutral-100)] text-[var(--color--neutral-500)] rounded">
                        fx
                      </span>
                      <code className="text-[var(--font-size--xs)] text-[var(--color--orange-300)] font-mono flex-1">
                        {'{{ $now.plus({ days: 30 }) }}'}
                      </code>
                      <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded">
                        <Pencil className="w-3 h-3 text-[var(--color--neutral-400)]" />
                      </button>
                    </div>
                    <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)]">
                      [DateTime: 2026-04-19T10:16:15.389+02:00]
                    </p>
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2">
                    <label className="text-[var(--font-size--xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-700)]">
                      Options
                    </label>
                    <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)]">
                      No properties
                    </p>
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
                  <div className="p-3 bg-[var(--color--yellow-100)] rounded-[var(--radius--xs)] text-[var(--font-size--2xs)] text-[var(--color--neutral-700)]">
                    This node will use the time zone set in n8n's settings, but you can override this in the workflow settings
                  </div>
                  
                  {/* Feedback prompt */}
                  <div className="pt-4 text-[var(--font-size--xs)] text-[var(--color--neutral-300)]">
                    I wish this node would...
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - OUTPUT */}
          <div 
            className="border-l border-[var(--color--neutral-150)] flex flex-col overflow-hidden"
            style={{ width: rightWidth }}
          >
            <div className="p-3 border-b border-[var(--color--neutral-150)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--font-size--2xs)] font-[var(--font-weight--bold)] text-[var(--color--neutral-400)] uppercase tracking-wider">
                  OUTPUT
                </span>
                <div className="flex items-center gap-2">
                  <DataViewToggle activeTab={outputTab} onTabChange={setOutputTab} />
                  <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                    <Pencil className="w-3 h-3 text-[var(--color--neutral-400)]" />
                  </button>
                  <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
                    <Pin className="w-3 h-3 text-[var(--color--neutral-400)]" />
                  </button>
                </div>
              </div>
              {hasOutput && (
                <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-500)]">
                  236 items
                </p>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 n8n-scrollbar">
              {hasOutput ? (
                <>
                  {outputTab === 'json' && <JsonView data={mockOutputData} />}
                  {outputTab === 'schema' && (
                    <div className="space-y-1">
                      {Object.keys(mockOutputData[0]).map((key) => (
                        <SchemaField 
                          key={key}
                          name={key}
                          value={typeof mockOutputData[0][key as keyof typeof mockOutputData[0]] === 'object' 
                            ? '[Object]' 
                            : String(mockOutputData[0][key as keyof typeof mockOutputData[0]])}
                          type="T"
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--color--neutral-100)] flex items-center justify-center mb-4">
                    <ChevronRight className="w-6 h-6 text-[var(--color--neutral-400)]" />
                  </div>
                  <p className="text-[var(--font-size--sm)] text-[var(--color--neutral-500)] mb-4">
                    No output data
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleExecuteStep}
                    className="gap-2 text-[var(--color--orange-300)] border-[var(--color--orange-300)] hover:bg-[var(--color--orange-50)]"
                  >
                    <Play className="w-3 h-3" />
                    Execute step
                  </Button>
                  <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] mt-2">
                    or{' '}
                    <button className="text-[var(--color--orange-300)] hover:underline">
                      set mock data
                    </button>
                  </p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {hasOutput && (
              <div className="p-3 border-t border-[var(--color--neutral-150)] flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 text-[var(--font-size--xs)] border border-[var(--color--orange-300)] text-[var(--color--orange-300)] rounded">
                    1
                  </button>
                  <button className="w-6 h-6 text-[var(--font-size--xs)] text-[var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] rounded">
                    2
                  </button>
                  <button className="w-6 h-6 text-[var(--font-size--xs)] text-[var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] rounded">
                    3
                  </button>
                  <button className="w-6 h-6 text-[var(--font-size--xs)] text-[var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] rounded">
                    4
                  </button>
                  <span className="text-[var(--font-size--xs)] text-[var(--color--neutral-400)]">...</span>
                  <button className="w-6 h-6 text-[var(--font-size--xs)] text-[var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] rounded">
                    10
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[var(--font-size--xs)] text-[var(--color--neutral-500)]">
                  <span>Page Size</span>
                  <span className="font-[var(--font-weight--medium)]">25</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
