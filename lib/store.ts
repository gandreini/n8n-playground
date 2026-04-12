import { create } from 'zustand'

// Types
export interface NodePosition {
  x: number
  y: number
}

export interface WorkflowNode {
  id: string
  type: string
  name: string
  icon: string
  iconColor?: string
  operation?: string
  position: NodePosition
  inputs: string[]
  outputs: string[]
  outputLabels?: string[]
  data?: Record<string, unknown>
  status?: 'idle' | 'running' | 'success' | 'error'
  isTrigger?: boolean
}

export interface Connection {
  id: string
  sourceId: string
  sourceOutput: number
  targetId: string
  targetInput: number
}

export interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  connections: Connection[]
  status: 'draft' | 'published'
  lastUpdated: Date
  createdAt: Date
  tags?: string[]
  project?: string
  linkedCount?: number
}

export interface Credential {
  id: string
  name: string
  type: string
  service: string
  icon: string
  lastUpdated: Date
  createdAt: Date
  project: string
  data?: Record<string, unknown>
}

export interface Execution {
  id: string
  workflowId: string
  workflowName: string
  workflowIcon?: string
  status: 'queued' | 'running' | 'success' | 'error'
  startedAt: Date
  runTime: string
  executionId: number
}

export type Screen = 'overview' | 'personal' | 'shared' | 'chat' | 'settings' | 'workflow-editor'
export type Tab = 'workflows' | 'credentials' | 'executions' | 'variables' | 'data-tables'
export type EditorTab = 'editor' | 'executions' | 'evaluations'

interface UIState {
  currentScreen: Screen
  currentTab: Tab
  currentEditorTab: EditorTab
  selectedWorkflowId: string | null
  selectedNodeId: string | null
  selectedCredentialId: string | null
  nodesPanelOpen: boolean
  nodesPanelLevel: 1 | 2 | 3
  nodesPanelCategory: string | null
  nodesPanelNode: string | null
  nodeConfigOpen: boolean
  zoom: number
  panOffset: { x: number; y: number }
}

interface WorkflowState {
  workflows: Workflow[]
  credentials: Credential[]
  executions: Execution[]
  currentWorkflow: Workflow | null
}

interface AppState extends UIState, WorkflowState {
  // UI Actions
  setScreen: (screen: Screen) => void
  setTab: (tab: Tab) => void
  setEditorTab: (tab: EditorTab) => void
  selectWorkflow: (id: string | null) => void
  selectNode: (id: string | null) => void
  selectCredential: (id: string | null) => void
  openNodesPanel: () => void
  closeNodesPanel: () => void
  setNodesPanelLevel: (level: 1 | 2 | 3) => void
  setNodesPanelCategory: (category: string | null) => void
  setNodesPanelNode: (node: string | null) => void
  openNodeConfig: () => void
  closeNodeConfig: () => void
  setZoom: (zoom: number) => void
  setPanOffset: (offset: { x: number; y: number }) => void
  
  // Workflow Actions
  createWorkflow: (name: string) => void
  openWorkflow: (id: string) => void
  closeWorkflow: () => void
  addNode: (node: Omit<WorkflowNode, 'id'>) => void
  updateNode: (id: string, updates: Partial<WorkflowNode>) => void
  deleteNode: (id: string) => void
  moveNode: (id: string, position: NodePosition) => void
  addConnection: (connection: Omit<Connection, 'id'>) => void
  deleteConnection: (id: string) => void
  executeWorkflow: () => void
  executeNode: (id: string) => void
  
  // Credential Actions
  createCredential: (credential: Omit<Credential, 'id'>) => void
  updateCredential: (id: string, updates: Partial<Credential>) => void
  deleteCredential: (id: string) => void
}

// Mock data
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Agent talk',
    nodes: [],
    connections: [],
    status: 'published',
    lastUpdated: new Date(Date.now() - 15 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-25'),
    project: 'Personal',
    linkedCount: 3
  },
  {
    id: '2',
    name: 'GCal - Auto-label UI Research Events in Google Calendar',
    nodes: [],
    connections: [],
    status: 'published',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-10-17'),
    project: 'Personal',
    tags: ['Production Workflows'],
    linkedCount: 5
  },
  {
    id: '3',
    name: 'My workflow 64',
    nodes: [],
    connections: [],
    status: 'draft',
    lastUpdated: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-20'),
    project: 'Personal'
  },
  {
    id: '4',
    name: 'My workflow 63',
    nodes: [],
    connections: [],
    status: 'draft',
    lastUpdated: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-19'),
    project: 'Personal'
  },
  {
    id: '5',
    name: 'My Work Assistant',
    nodes: [],
    connections: [],
    status: 'published',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-01-29'),
    project: 'Personal',
    tags: ['Production Workflows'],
    linkedCount: 2
  },
  {
    id: '6',
    name: 'My workflow 62',
    nodes: [],
    connections: [],
    status: 'draft',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-09'),
    project: 'Personal'
  },
  {
    id: '7',
    name: 'My workflow 61',
    nodes: [],
    connections: [],
    status: 'published',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-05'),
    project: 'Personal',
    tags: ['Production Workflows']
  }
]

const mockCredentials: Credential[] = [
  {
    id: '1',
    name: 'Google Calendar account',
    type: 'Google Calendar OAuth2 API',
    service: 'Google Calendar',
    icon: 'google-calendar',
    lastUpdated: new Date(),
    createdAt: new Date('2022-11-25'),
    project: 'Personal'
  },
  {
    id: '2',
    name: 'Gmail account (n8n)',
    type: 'Gmail OAuth2 API',
    service: 'Gmail',
    icon: 'gmail',
    lastUpdated: new Date(Date.now() - 4 * 60 * 1000),
    createdAt: new Date('2022-12-22'),
    project: 'Personal'
  },
  {
    id: '3',
    name: 'Gmail account 6',
    type: 'Gmail OAuth2 API',
    service: 'Gmail',
    icon: 'gmail',
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-02-24'),
    project: 'Personal'
  },
  {
    id: '4',
    name: 'Spotify account',
    type: 'Spotify OAuth2 API',
    service: 'Spotify',
    icon: 'spotify',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-10-31'),
    project: 'Personal'
  },
  {
    id: '5',
    name: 'Gmail account (Giulio)',
    type: 'Gmail OAuth2 API',
    service: 'Gmail',
    icon: 'gmail',
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2022-11-02'),
    project: 'Personal'
  },
  {
    id: '6',
    name: 'Slack API - App: n8n-giulio-private-app',
    type: 'Slack API',
    service: 'Slack',
    icon: 'slack',
    lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-12-17'),
    project: 'Personal'
  },
  {
    id: '7',
    name: 'Slack account 6',
    type: 'Slack OAuth2 API',
    service: 'Slack',
    icon: 'slack',
    lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2025-12-17'),
    project: 'Personal'
  }
]

const mockExecutions: Execution[] = [
  {
    id: '1',
    workflowId: '1',
    workflowName: 'Slack status',
    workflowIcon: 'slack',
    status: 'queued',
    startedAt: new Date(),
    runTime: '936h 16m 10s',
    executionId: 293200
  },
  {
    id: '2',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T10:10:35'),
    runTime: '13.757s',
    executionId: 307111
  },
  {
    id: '3',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T10:10:25'),
    runTime: '12.689s',
    executionId: 307110
  },
  {
    id: '4',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T10:00:35'),
    runTime: '14.334s',
    executionId: 307109
  },
  {
    id: '5',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T10:00:25'),
    runTime: '13.075s',
    executionId: 307108
  },
  {
    id: '6',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T10:00:15'),
    runTime: '161ms',
    executionId: 307107
  },
  {
    id: '7',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T09:50:35'),
    runTime: '11.991s',
    executionId: 307106
  },
  {
    id: '8',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T09:50:25'),
    runTime: '12.48s',
    executionId: 307105
  },
  {
    id: '9',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T09:40:35'),
    runTime: '13.64s',
    executionId: 307104
  },
  {
    id: '10',
    workflowId: '2',
    workflowName: 'Emails management',
    workflowIcon: 'gmail',
    status: 'success',
    startedAt: new Date('2026-03-20T09:40:25'),
    runTime: '12.515s',
    executionId: 307103
  }
]

// Create sample workflow for editor
const sampleWorkflow: Workflow = {
  id: 'sample',
  name: 'GCal - Auto-label UI Research Events in Google Calendar',
  status: 'published',
  lastUpdated: new Date(),
  createdAt: new Date('2025-10-17'),
  project: 'Personal',
  tags: ['Production Workflows'],
  nodes: [
    {
      id: 'trigger-1',
      type: 'schedule',
      name: 'Daily Check',
      icon: 'clock',
      iconColor: 'green',
      position: { x: 350, y: 300 },
      inputs: [],
      outputs: ['main'],
      isTrigger: true,
      status: 'idle'
    },
    {
      id: 'gcal-1',
      type: 'google-calendar',
      name: 'Get Upcoming Events',
      icon: 'google-calendar',
      operation: 'getAll: event',
      position: { x: 550, y: 300 },
      inputs: ['main'],
      outputs: ['main'],
      status: 'idle'
    },
    {
      id: 'switch-1',
      type: 'switch',
      name: 'Route by Event Type',
      icon: 'switch',
      iconColor: 'blue',
      operation: 'mode: Rules',
      position: { x: 750, y: 300 },
      inputs: ['main'],
      outputs: ['Research', 'Purple', 'Research-with...'],
      outputLabels: ['Research', 'Purple', 'Research-with...'],
      status: 'idle'
    },
    {
      id: 'gcal-2',
      type: 'google-calendar',
      name: 'Update Event with Research Label',
      icon: 'google-calendar',
      operation: 'update: event',
      position: { x: 1000, y: 200 },
      inputs: ['main'],
      outputs: ['main'],
      status: 'idle'
    },
    {
      id: 'gcal-3',
      type: 'google-calendar',
      name: 'Update Event with Purple Label',
      icon: 'google-calendar',
      operation: 'update: event',
      position: { x: 1000, y: 350 },
      inputs: ['main'],
      outputs: ['main'],
      status: 'idle'
    },
    {
      id: 'gcal-4',
      type: 'google-calendar',
      name: 'Update Event with Purple Label1',
      icon: 'google-calendar',
      operation: 'update: event',
      position: { x: 1000, y: 500 },
      inputs: ['main'],
      outputs: ['main'],
      status: 'idle'
    }
  ],
  connections: [
    { id: 'c1', sourceId: 'trigger-1', sourceOutput: 0, targetId: 'gcal-1', targetInput: 0 },
    { id: 'c2', sourceId: 'gcal-1', sourceOutput: 0, targetId: 'switch-1', targetInput: 0 },
    { id: 'c3', sourceId: 'switch-1', sourceOutput: 0, targetId: 'gcal-2', targetInput: 0 },
    { id: 'c4', sourceId: 'switch-1', sourceOutput: 1, targetId: 'gcal-3', targetInput: 0 },
    { id: 'c5', sourceId: 'switch-1', sourceOutput: 2, targetId: 'gcal-4', targetInput: 0 }
  ]
}

export const useStore = create<AppState>((set, get) => ({
  // Initial UI State
  currentScreen: 'overview',
  currentTab: 'workflows',
  currentEditorTab: 'editor',
  selectedWorkflowId: null,
  selectedNodeId: null,
  selectedCredentialId: null,
  nodesPanelOpen: false,
  nodesPanelLevel: 1,
  nodesPanelCategory: null,
  nodesPanelNode: null,
  nodeConfigOpen: false,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  
  // Initial Workflow State
  workflows: mockWorkflows,
  credentials: mockCredentials,
  executions: mockExecutions,
  currentWorkflow: null,
  
  // UI Actions
  setScreen: (screen) => set({ currentScreen: screen }),
  setTab: (tab) => set({ currentTab: tab }),
  setEditorTab: (tab) => set({ currentEditorTab: tab }),
  selectWorkflow: (id) => set({ selectedWorkflowId: id }),
  selectNode: (id) => set({ selectedNodeId: id }),
  selectCredential: (id) => set({ selectedCredentialId: id }),
  openNodesPanel: () => set({ nodesPanelOpen: true, nodesPanelLevel: 1 }),
  closeNodesPanel: () => set({ nodesPanelOpen: false, nodesPanelLevel: 1, nodesPanelCategory: null, nodesPanelNode: null }),
  setNodesPanelLevel: (level) => set({ nodesPanelLevel: level }),
  setNodesPanelCategory: (category) => set({ nodesPanelCategory: category, nodesPanelLevel: 2 }),
  setNodesPanelNode: (node) => set({ nodesPanelNode: node, nodesPanelLevel: 3 }),
  openNodeConfig: () => set({ nodeConfigOpen: true }),
  closeNodeConfig: () => set({ nodeConfigOpen: false }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  
  // Workflow Actions
  createWorkflow: (name) => {
    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name,
      nodes: [],
      connections: [],
      status: 'draft',
      lastUpdated: new Date(),
      createdAt: new Date(),
      project: 'Personal'
    }
    set((state) => ({
      workflows: [newWorkflow, ...state.workflows],
      currentWorkflow: newWorkflow,
      currentScreen: 'workflow-editor'
    }))
  },
  
  openWorkflow: (id) => {
    const workflow = get().workflows.find(w => w.id === id)
    if (workflow) {
      // Use sample workflow for demo
      set({
        currentWorkflow: id === '2' ? sampleWorkflow : workflow,
        currentScreen: 'workflow-editor',
        selectedWorkflowId: id
      })
    }
  },
  
  closeWorkflow: () => set({
    currentWorkflow: null,
    currentScreen: 'overview',
    selectedWorkflowId: null,
    nodesPanelOpen: false,
    nodeConfigOpen: false,
    selectedNodeId: null
  }),
  
  addNode: (node) => {
    const newNode: WorkflowNode = {
      ...node,
      id: crypto.randomUUID()
    }
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        nodes: [...state.currentWorkflow.nodes, newNode]
      } : null
    }))
  },
  
  updateNode: (id, updates) => {
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(n => 
          n.id === id ? { ...n, ...updates } : n
        )
      } : null
    }))
  },
  
  deleteNode: (id) => {
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.filter(n => n.id !== id),
        connections: state.currentWorkflow.connections.filter(
          c => c.sourceId !== id && c.targetId !== id
        )
      } : null,
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId
    }))
  },
  
  moveNode: (id, position) => {
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(n =>
          n.id === id ? { ...n, position } : n
        )
      } : null
    }))
  },
  
  addConnection: (connection) => {
    const newConnection: Connection = {
      ...connection,
      id: crypto.randomUUID()
    }
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        connections: [...state.currentWorkflow.connections, newConnection]
      } : null
    }))
  },
  
  deleteConnection: (id) => {
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        connections: state.currentWorkflow.connections.filter(c => c.id !== id)
      } : null
    }))
  },
  
  executeWorkflow: () => {
    const workflow = get().currentWorkflow
    if (!workflow) return
    
    // Simulate execution
    const nodes = workflow.nodes
    let delay = 0
    
    nodes.forEach((node, index) => {
      setTimeout(() => {
        set((state) => ({
          currentWorkflow: state.currentWorkflow ? {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.map(n =>
              n.id === node.id ? { ...n, status: 'running' } : n
            )
          } : null
        }))
      }, delay)
      
      setTimeout(() => {
        set((state) => ({
          currentWorkflow: state.currentWorkflow ? {
            ...state.currentWorkflow,
            nodes: state.currentWorkflow.nodes.map(n =>
              n.id === node.id ? { ...n, status: 'success' } : n
            )
          } : null
        }))
      }, delay + 500)
      
      delay += 600
    })
    
    // Add execution to history
    setTimeout(() => {
      const execution: Execution = {
        id: crypto.randomUUID(),
        workflowId: workflow.id,
        workflowName: workflow.name,
        status: 'success',
        startedAt: new Date(),
        runTime: `${(nodes.length * 0.5).toFixed(2)}s`,
        executionId: Math.floor(Math.random() * 100000) + 300000
      }
      set((state) => ({
        executions: [execution, ...state.executions]
      }))
    }, delay)
  },
  
  executeNode: (id) => {
    set((state) => ({
      currentWorkflow: state.currentWorkflow ? {
        ...state.currentWorkflow,
        nodes: state.currentWorkflow.nodes.map(n =>
          n.id === id ? { ...n, status: 'running' } : n
        )
      } : null
    }))
    
    setTimeout(() => {
      set((state) => ({
        currentWorkflow: state.currentWorkflow ? {
          ...state.currentWorkflow,
          nodes: state.currentWorkflow.nodes.map(n =>
            n.id === id ? { ...n, status: 'success' } : n
          )
        } : null
      }))
    }, 1000)
  },
  
  // Credential Actions
  createCredential: (credential) => {
    const newCredential: Credential = {
      ...credential,
      id: crypto.randomUUID()
    }
    set((state) => ({
      credentials: [newCredential, ...state.credentials]
    }))
  },
  
  updateCredential: (id, updates) => {
    set((state) => ({
      credentials: state.credentials.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }))
  },
  
  deleteCredential: (id) => {
    set((state) => ({
      credentials: state.credentials.filter(c => c.id !== id),
      selectedCredentialId: state.selectedCredentialId === id ? null : state.selectedCredentialId
    }))
  }
}))
