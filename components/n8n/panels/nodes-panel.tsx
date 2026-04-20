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
  X
} from 'lucide-react'
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
    <button onClick={onClick} className="category-row">
      <div className="icon-wrap">
        <Icon
          style={{
            width: 20,
            height: 20,
            color: category.iconColor || 'var(--color--neutral-500)',
          }}
        />
      </div>
      <div className="text">
        <p className="name">{category.name}</p>
        <p className="desc">{category.description}</p>
      </div>
      <ChevronRight
        style={{
          width: 16,
          height: 16,
          color: 'var(--color--neutral-300)',
          flexShrink: 0,
        }}
      />

      <style jsx>{`
        .category-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
          padding: var(--spacing--2xs);
          border: 0;
          background: transparent;
          border-radius: var(--radius--xs);
          text-align: left;
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .category-row:hover {
          background-color: var(--color--neutral-50);
        }
        .icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: var(--radius--xs);
          background-color: var(--color--neutral-100);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .text {
          flex: 1;
          min-width: 0;
        }
        .name {
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-800);
        }
        .desc {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </button>
  )
}

interface NodeRowProps {
  node: { id: string; name: string; description: string; icon: string; badge?: string }
  onClick: () => void
}

function NodeRow({ node, onClick }: NodeRowProps) {
  return (
    <button onClick={onClick} className="node-row">
      <ServiceIcon service={node.icon} size={28} />
      <div className="text">
        <div className="name-row">
          <p className="name">{node.name}</p>
          {node.badge && <span className="badge">{node.badge}</span>}
        </div>
        <p className="desc">{node.description}</p>
      </div>
      <ChevronRight
        style={{
          width: 16,
          height: 16,
          color: 'var(--color--neutral-300)',
          flexShrink: 0,
        }}
      />

      <style jsx>{`
        .node-row {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
          padding: var(--spacing--2xs);
          border: 0;
          background: transparent;
          border-radius: var(--radius--xs);
          text-align: left;
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .node-row:hover {
          background-color: var(--color--neutral-50);
        }
        .text {
          flex: 1;
          min-width: 0;
        }
        .name-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .name {
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-800);
        }
        .badge {
          padding: 2px 6px;
          font-size: var(--font-size--3xs);
          background-color: var(--color--neutral-100);
          color: var(--color--neutral-500);
          border-radius: var(--radius--3xs);
        }
        .desc {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
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
    addNode,
  } = useStore()

  const [searchQuery, setSearchQuery] = useState('')

  const selectedCategory = nodeCategories.find((c) => c.id === nodesPanelCategory)

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
      status: 'idle',
    })
    closeNodesPanel()
  }

  const filteredCategories = nodeCategories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredNodes =
    selectedCategory?.nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  return (
    <div className="n8n-nodes-panel">
      {/* Header */}
      <div className="header">
        <div className="title-row">
          {nodesPanelLevel > 1 ? (
            <button onClick={handleBack} className="back-btn">
              <ArrowLeft style={{ width: 16, height: 16 }} />
              <span className="title">{selectedCategory?.name || 'AI Nodes'}</span>
            </button>
          ) : (
            <h2 className="title">What happens next?</h2>
          )}
          <button onClick={closeNodesPanel} className="close-btn">
            <X style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
          </button>
        </div>

        {nodesPanelLevel > 1 && (
          <p className="subtitle">
            Select an {selectedCategory?.name} Node to add to your workflow
          </p>
        )}

        <div className="search">
          <Search className="search-icon" />
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="content n8n-scrollbar">
        {nodesPanelLevel === 1 ? (
          <div className="list">
            {filteredCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        ) : (
          <div className="list">
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

      <style jsx>{`
        .n8n-nodes-panel {
          width: 350px;
          height: 100%;
          background-color: #ffffff;
          border-left: 1px solid var(--color--neutral-150);
          display: flex;
          flex-direction: column;
          transition: transform var(--duration--base) var(--easing--ease-out);
        }
        .header {
          padding: var(--spacing--sm);
          border-bottom: 1px solid var(--color--neutral-150);
        }
        .title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing--sm);
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .back-btn:hover {
          color: var(--color--neutral-700);
        }
        .title {
          font-size: var(--font-size--lg);
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-800);
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
        .subtitle {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-400);
          margin-bottom: var(--spacing--sm);
        }
        .search {
          position: relative;
        }
        .search :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--color--neutral-400);
          z-index: 1;
        }
        .search :global(input) {
          padding-left: 36px;
          height: 40px;
          font-size: var(--font-size--sm);
        }
        .content {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing--3xs);
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--5xs);
        }
      `}</style>
    </div>
  )
}
