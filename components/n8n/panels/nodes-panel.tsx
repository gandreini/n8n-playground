'use client'

import { useStore } from '@/lib/store'
import { useState } from 'react'
import {
  ArrowLeft,
  Search,
  Bot,
  AppWindow,
  Shuffle,
  GitBranch,
  Code,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
  Globe,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Shield,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/shadcn/input'
import { ServiceIcon } from '../shared/service-icon'

const nodeCategories = [
  {
    id: 'ai',
    name: 'AI',
    icon: Bot,
    description: 'Build autonomous agents, summarize or search documents, etc.',
    nodes: [
      { id: 'ai-templates', name: 'AI Templates', description: 'See what\'s possible and get started 5x faster', icon: 'ai', badge: 'Recommended' },
      { id: 'ai-agent', name: 'AI Agent', description: 'Generates an action plan and executes it. Can use external tools.', icon: 'ai' },
      { id: 'anthropic', name: 'Anthropic', description: 'Interact with Anthropic AI models', icon: 'anthropic' },
      { id: 'google-gemini', name: 'Google Gemini', description: 'Interact with Google Gemini AI models', icon: 'ai' },
      { id: 'guardrails', name: 'Guardrails', description: 'Safeguard AI models from malicious input or prevent them from generating undesirable responses', icon: 'shield' },
      { id: 'ollama', name: 'Ollama', description: 'Interact with Ollama AI models', icon: 'ai' },
      { id: 'openai', name: 'OpenAI', description: 'Message an assistant or GPT, analyze images, generate audio, etc.', icon: 'openai' },
      { id: 'basic-llm-chain', name: 'Basic LLM Chain', description: 'A simple chain to prompt a large language model', icon: 'ai' },
      { id: 'info-extractor', name: 'Information Extractor', description: 'Extract information from text in a structured format', icon: 'ai' },
      { id: 'qa-chain', name: 'Question and Answer Chain', description: 'Answer questions about retrieved documents', icon: 'ai' }
    ]
  },
  {
    id: 'apps',
    name: 'Action in an app',
    icon: AppWindow,
    description: 'Do something in an app or service like Google Sheets, Telegram or Notion',
    nodes: [
      { id: 'slack', name: 'Slack', description: 'Send messages, manage channels, and more', icon: 'slack' },
      { id: 'google-sheets', name: 'Google Sheets', description: 'Read and write data to spreadsheets', icon: 'google-sheets' },
      { id: 'gmail', name: 'Gmail', description: 'Send and receive emails', icon: 'gmail' },
      { id: 'notion', name: 'Notion', description: 'Create and manage pages and databases', icon: 'notion' },
      { id: 'google-calendar', name: 'Google Calendar', description: 'Create and manage calendar events', icon: 'google-calendar' },
      { id: 'telegram', name: 'Telegram', description: 'Send messages and manage bots', icon: 'telegram' },
      { id: 'discord', name: 'Discord', description: 'Send messages and manage servers', icon: 'discord' },
      { id: 'github', name: 'GitHub', description: 'Manage repositories, issues, and pull requests', icon: 'github' },
      { id: 'airtable', name: 'Airtable', description: 'Read and write to Airtable bases', icon: 'airtable' },
      { id: 'http-request', name: 'HTTP Request', description: 'Make HTTP requests to any API', icon: 'http' },
      { id: 'postgres', name: 'Postgres', description: 'Query PostgreSQL databases', icon: 'database' },
      { id: 'hubspot', name: 'HubSpot', description: 'Manage contacts, deals, and more', icon: 'hubspot' }
    ]
  },
  {
    id: 'transform',
    name: 'Data transformation',
    icon: Shuffle,
    description: 'Manipulate, filter or convert data',
    nodes: [
      { id: 'set', name: 'Set/Edit Fields', description: 'Add, edit, or delete fields', icon: 'code' },
      { id: 'split', name: 'Split Out', description: 'Split items into multiple items', icon: 'code' },
      { id: 'aggregate', name: 'Aggregate', description: 'Combine items into a single item', icon: 'code' },
      { id: 'sort', name: 'Sort', description: 'Sort items by field values', icon: 'code' },
      { id: 'limit', name: 'Limit', description: 'Limit the number of items', icon: 'code' },
      { id: 'remove-duplicates', name: 'Remove Duplicates', description: 'Remove duplicate items', icon: 'code' },
      { id: 'summarize', name: 'Summarize', description: 'Summarize data with statistics', icon: 'code' },
      { id: 'code', name: 'Code', description: 'Write custom JavaScript or Python code', icon: 'code' },
      { id: 'merge', name: 'Merge', description: 'Merge multiple data streams', icon: 'code' },
      { id: 'compare', name: 'Compare Datasets', description: 'Compare two datasets', icon: 'code' }
    ]
  },
  {
    id: 'flow',
    name: 'Flow',
    icon: GitBranch,
    description: 'Branch, merge or loop the flow, etc.',
    nodes: [
      { id: 'if', name: 'IF', description: 'Route items based on conditions', icon: 'switch' },
      { id: 'switch', name: 'Switch', description: 'Route items to different outputs', icon: 'switch' },
      { id: 'merge', name: 'Merge', description: 'Merge multiple inputs', icon: 'switch' },
      { id: 'loop', name: 'Loop Over Items', description: 'Process items one by one', icon: 'switch' },
      { id: 'wait', name: 'Wait', description: 'Wait for a specified time', icon: 'clock' },
      { id: 'stop', name: 'Stop and Error', description: 'Stop workflow with error', icon: 'switch' },
      { id: 'subworkflow', name: 'Execute Sub-workflow', description: 'Execute another workflow', icon: 'switch' }
    ]
  },
  {
    id: 'core',
    name: 'Core',
    icon: Code,
    description: 'Run code, make HTTP requests, set webhooks, etc.',
    nodes: [
      { id: 'http-request', name: 'HTTP Request', description: 'Make HTTP requests to any API', icon: 'http' },
      { id: 'code', name: 'Code', description: 'Write custom JavaScript or Python code', icon: 'code' },
      { id: 'webhook', name: 'Webhook', description: 'Receive webhooks from external services', icon: 'webhook' },
      { id: 'function', name: 'Function', description: 'Run JavaScript functions', icon: 'code' },
      { id: 'execute-command', name: 'Execute Command', description: 'Execute shell commands', icon: 'code' },
      { id: 'set', name: 'Set', description: 'Set variables and data', icon: 'code' }
    ]
  },
  {
    id: 'human',
    name: 'Human review',
    icon: Users,
    description: 'Request approval via services like Slack and Telegram before making tool calls',
    nodes: []
  },
  {
    id: 'trigger',
    name: 'Add another trigger',
    icon: Zap,
    iconColor: 'var(--color--orange-300)',
    description: 'Triggers start your workflow. Workflows can have multiple triggers.',
    nodes: [
      { id: 'schedule', name: 'Schedule Trigger', description: 'Run workflow on a schedule', icon: 'clock' },
      { id: 'webhook', name: 'Webhook Trigger', description: 'Receive webhooks from external services', icon: 'webhook' },
      { id: 'manual', name: 'Manual Trigger', description: 'Start workflow manually', icon: 'code' }
    ]
  }
]

interface CategoryRowProps {
  category: typeof nodeCategories[0]
  onClick: () => void
}

function CategoryRow({ category, onClick }: CategoryRowProps) {
  const Icon = category.icon
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-[var(--color--neutral-50)] rounded-[var(--radius--xs)] transition-snappy text-left"
    >
      <div className="w-10 h-10 rounded-[var(--radius--xs)] bg-[var(--color--neutral-100)] flex items-center justify-center flex-shrink-0">
        <Icon 
          className="w-5 h-5" 
          style={{ color: category.iconColor || 'var(--color--neutral-500)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[var(--font-size--sm)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
          {category.name}
        </p>
        <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] truncate">
          {category.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--color--neutral-300)] flex-shrink-0" />
    </button>
  )
}

interface NodeRowProps {
  node: { id: string; name: string; description: string; icon: string; badge?: string }
  onClick: () => void
}

function NodeRow({ node, onClick }: NodeRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 hover:bg-[var(--color--neutral-50)] rounded-[var(--radius--xs)] transition-snappy text-left"
    >
      <ServiceIcon service={node.icon} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-[var(--font-size--sm)] font-[var(--font-weight--medium)] text-[var(--color--neutral-800)]">
            {node.name}
          </p>
          {node.badge && (
            <span className="px-1.5 py-0.5 text-[var(--font-size--3xs)] bg-[var(--color--neutral-100)] text-[var(--color--neutral-500)] rounded-[var(--radius--3xs)]">
              {node.badge}
            </span>
          )}
        </div>
        <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] truncate">
          {node.description}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-[var(--color--neutral-300)] flex-shrink-0" />
    </button>
  )
}

export function NodesPanel() {
  const { 
    closeNodesPanel, 
    nodesPanelLevel, 
    setNodesPanelLevel,
    nodesPanelCategory, 
    setNodesPanelCategory,
    addNode
  } = useStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  
  const selectedCategory = nodeCategories.find(c => c.id === nodesPanelCategory)
  
  const handleCategoryClick = (categoryId: string) => {
    setNodesPanelCategory(categoryId)
  }
  
  const handleBack = () => {
    if (nodesPanelLevel === 2) {
      setNodesPanelLevel(1)
      setNodesPanelCategory(null)
    }
  }
  
  const handleAddNode = (nodeType: string, nodeName: string, icon: string) => {
    addNode({
      type: nodeType,
      name: nodeName,
      icon: icon,
      position: { x: 400, y: 300 },
      inputs: ['main'],
      outputs: ['main'],
      status: 'idle'
    })
    closeNodesPanel()
  }
  
  const filteredCategories = nodeCategories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const filteredNodes = selectedCategory?.nodes.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []
  
  return (
    <div className="n8n-nodes-panel w-[350px] h-full bg-white border-l border-[var(--color--neutral-150)] flex flex-col transition-base">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color--neutral-150)]">
        <div className="flex items-center justify-between mb-4">
          {nodesPanelLevel > 1 ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)] transition-snappy"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[var(--font-size--lg)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
                {selectedCategory?.name || 'AI Nodes'}
              </span>
            </button>
          ) : (
            <h2 className="text-[var(--font-size--lg)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
              What happens next?
            </h2>
          )}
          <button 
            onClick={closeNodesPanel}
            className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy"
          >
            <X className="w-4 h-4 text-[var(--color--neutral-400)]" />
          </button>
        </div>
        
        {nodesPanelLevel > 1 && (
          <p className="text-[var(--font-size--sm)] text-[var(--color--neutral-400)] mb-4">
            Select an {selectedCategory?.name} Node to add to your workflow
          </p>
        )}
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color--neutral-400)]" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-[var(--font-size--sm)]"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto n8n-scrollbar p-2">
        {nodesPanelLevel === 1 ? (
          // Categories list
          <div className="space-y-1">
            {filteredCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        ) : (
          // Nodes list
          <div className="space-y-1">
            {filteredNodes.map((node) => (
              <NodeRow
                key={node.id}
                node={node}
                onClick={() => handleAddNode(node.id, node.name, node.icon)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
