'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  Binoculars,
  FolderSync,
  Bot,
  Workflow,
  KeySquare,
  Database,
  ChartLine,
  RefreshCw,
  ListChecks,
  Map,
  ScrollText,
  Settings,
  File,
  ArrowUpRight,
  Link2,
  Plus,
} from 'lucide-react'
import { N8nLogo } from '@/components/n8n/shared/n8n-logo'
import { PromptInput } from '@/components/n8n/shared/prompt-input'
import { usePulseChat, type ChatMessage } from './use-pulse-chat'

// ─── Types ───

type Mode = 'talk' | 'write'

interface AgentSection {
  title: string
  items: { name: string; icon: 'file' | 'link' | 'app'; appIcon?: string }[]
}

const agentSections: AgentSection[] = [
  {
    title: 'Memory',
    items: [
      { name: 'PULSE.md', icon: 'file' },
      { name: 'MEMORY.md', icon: 'file' },
      { name: 'PROJECT.md', icon: 'file' },
      { name: 'DIARY.md', icon: 'file' },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { name: 'guidelines.pdf', icon: 'file' },
      { name: 'AI_agent_building.pdf', icon: 'file' },
      { name: 'n8n-docs-html', icon: 'link' },
      { name: 'Notion Docs', icon: 'link' },
      { name: 'Airtable Design Team Base', icon: 'app', appIcon: '🟨' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { name: 'web_search', icon: 'app', appIcon: '🔍' },
      { name: 'http_request', icon: 'app', appIcon: '🌐' },
      { name: 'send_slack_message', icon: 'app', appIcon: '🟣' },
      { name: 'query_database', icon: 'app', appIcon: '🗄️' },
      { name: 'send_email', icon: 'app', appIcon: '✉️' },
      { name: 'create_calendar_event', icon: 'app', appIcon: '📅' },
      { name: 'run_code', icon: 'app', appIcon: '⚙️' },
      { name: 'read_file', icon: 'app', appIcon: '📄' },
    ],
  },
  {
    title: 'Skills',
    items: [
      { name: 'BRAINSTORM.md', icon: 'file' },
      { name: 'COMPOUNDING_ENG.md', icon: 'file' },
    ],
  },
  {
    title: 'Connections',
    items: [
      { name: 'Slack OAuth', icon: 'app', appIcon: '🟣' },
      { name: 'X APIs', icon: 'app', appIcon: '✖' },
      { name: 'Open AI - Api Key', icon: 'app', appIcon: '🟢' },
      { name: 'Airtable - Api Key', icon: 'app', appIcon: '🟨' },
      { name: 'Google Console', icon: 'app', appIcon: '🔵' },
      { name: 'Intercom', icon: 'app', appIcon: '🔷' },
    ],
  },
]

// ─── Sidebar ───

function PulseSidebar({ onCollapse }: { onCollapse: () => void }) {
  return (
    <aside className="pulse-sidebar">
      <div className="sidebar-inner">
        {/* Top */}
        <div className="sidebar-top">
          {/* Header: team select + collapse */}
          <div className="sidebar-header">
            <div className="team-row">
              <button className="team-select">
                <span className="team-name">Design team</span>
                <ChevronDown style={{ width: 16, height: 16, flexShrink: 0, color: 'var(--color--neutral-500)' }} />
              </button>
              <button
                type="button"
                onClick={onCollapse}
                aria-label="Collapse sidebar"
                className="collapse-btn"
              >
                <PanelLeftClose style={{ width: 16, height: 16 }} />
              </button>
            </div>
            {/* n8n Pulse item (active) */}
            <div className="pulse-item active">
              <div className="pulse-icon">
                <N8nLogo size={20} />
              </div>
              <span className="pulse-label">n8n Pulse</span>
            </div>
          </div>

          {/* Pulse threads */}
          <SidebarSection title="Pulse threads" addable>
            <SidebarItem icon={<Binoculars style={{ width: 16, height: 16 }} />} label="UXR automations" />
            <SidebarItem icon={<FolderSync style={{ width: 16, height: 16 }} />} label="Docs Linear issues sync" />
          </SidebarSection>

          {/* Resources */}
          <SidebarSection title="Resources" addable>
            <SidebarItem icon={<Bot style={{ width: 16, height: 16 }} />} label="Agents" />
            <SidebarItem icon={<Workflow style={{ width: 16, height: 16 }} />} label="Automations" />
            <SidebarItem icon={<KeySquare style={{ width: 16, height: 16 }} />} label="Connections" />
            <SidebarItem icon={<Database style={{ width: 16, height: 16 }} />} label="Data" />
          </SidebarSection>

          {/* Activity */}
          <SidebarSection title="Activity">
            <SidebarItem icon={<ChartLine style={{ width: 16, height: 16 }} />} label="Insights" />
            <SidebarItem icon={<RefreshCw style={{ width: 16, height: 16 }} />} label="Executions" />
            <SidebarItem icon={<ListChecks style={{ width: 16, height: 16 }} />} label="Evals" />
            <SidebarItem icon={<Map style={{ width: 16, height: 16 }} />} label="Traces" />
            <SidebarItem icon={<ScrollText style={{ width: 16, height: 16 }} />} label="Logs" />
          </SidebarSection>
        </div>

        {/* Bottom: Settings */}
        <SidebarItem icon={<Settings style={{ width: 16, height: 16 }} />} label="Settings" />
      </div>

      <style jsx>{`
        .pulse-sidebar {
          width: 280px;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
          padding: var(--spacing--xs);
          flex-shrink: 0;
        }
        .sidebar-inner {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }
        .sidebar-top {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--md);
        }
        .sidebar-header {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--2xs);
        }
        .team-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .team-select {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 32px;
          padding-inline: var(--spacing--3xs);
          border: 1px solid var(--color--black-alpha-200);
          border-radius: var(--radius--3xs);
          background-color: #ffffff;
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
          cursor: pointer;
        }
        .team-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .collapse-btn {
          flex-shrink: 0;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .collapse-btn:hover {
          color: var(--color--neutral-800);
        }
        .pulse-item {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
          min-height: 32px;
          padding: var(--spacing--4xs);
          border-radius: var(--radius--3xs);
        }
        .pulse-item.active {
          background-color: var(--color--neutral-125);
        }
        .pulse-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-label {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
      `}</style>
    </aside>
  )
}

function SidebarSection({
  title,
  children,
  addable,
}: {
  title: string
  children: React.ReactNode
  addable?: boolean
}) {
  return (
    <div className="sb-section">
      <div className="sb-section-header">
        <span className="sb-section-title">{title}</span>
        {addable && (
          <button type="button" aria-label={`Add to ${title}`} className="sb-add-btn">
            <Plus style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>
      <div className="sb-section-items">{children}</div>

      <style jsx>{`
        .sb-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--4xs);
        }
        .sb-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: var(--spacing--4xs);
        }
        .sb-section-title {
          font-size: var(--font-size--2xs);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-400);
        }
        .sb-add-btn {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          color: var(--color--neutral-400);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .sb-add-btn:hover {
          color: var(--color--neutral-800);
        }
        .sb-section-items {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  )
}

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode
  label: string
  active?: boolean
}) {
  return (
    <button className="sb-item" data-active={active ? 'true' : undefined}>
      <div className="sb-item-icon">{icon}</div>
      <span className="sb-item-label">{label}</span>

      <style jsx>{`
        .sb-item {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
          min-height: 32px;
          padding: var(--spacing--4xs);
          border-radius: var(--radius--3xs);
          background: transparent;
          border: 0;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .sb-item[data-active='true'] {
          background-color: var(--color--neutral-125);
        }
        .sb-item:not([data-active='true']):hover {
          background-color: var(--color--neutral-50);
        }
        .sb-item-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color--neutral-500);
        }
        .sb-item-label {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
      `}</style>
    </button>
  )
}

// ─── Agent Header ───

function AgentHeader({
  mode,
  onModeChange,
  showPanel,
  onTogglePanel,
}: {
  mode: Mode
  onModeChange: (m: Mode) => void
  showPanel: boolean
  onTogglePanel: () => void
}) {
  return (
    <div className="agent-header">
      {/* Left: logo + title */}
      <div className="header-left">
        <N8nLogo size={24} />
        <span className="header-title">n8n AI</span>
      </div>

      {/* Center: Talk / Write toggle */}
      <div className="header-center">
        <div className="mode-toggle">
          <button
            onClick={() => onModeChange('talk')}
            className="mode-btn"
            data-active={mode === 'talk' ? 'true' : undefined}
          >
            Talk
          </button>
          <button
            onClick={() => onModeChange('write')}
            className="mode-btn"
            data-active={mode === 'write' ? 'true' : undefined}
          >
            Write
          </button>
        </div>
      </div>

      {/* Right: panel toggle */}
      <div className="header-right">
        <button onClick={onTogglePanel} className="panel-toggle-btn">
          <PanelRightClose
            style={{
              width: 16,
              height: 16,
              color: 'var(--color--neutral-500)',
              transform: showPanel ? 'rotate(180deg)' : undefined,
            }}
          />
        </button>
      </div>

      <style jsx>{`
        .agent-header {
          display: flex;
          align-items: center;
          padding-block: var(--spacing--xs);
          flex-shrink: 0;
        }
        .header-left {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .header-title {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
        .header-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing--4xs);
          height: 24px;
        }
        .mode-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
          background-color: var(--color--neutral-200);
          border-radius: var(--radius--3xs);
          padding: 2px;
        }
        .mode-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 20px;
          padding-inline: var(--spacing--3xs);
          border-radius: var(--radius--3xs);
          border: 0;
          background: transparent;
          font-size: var(--font-size--sm);
          cursor: pointer;
          color: var(--color--neutral-500);
          transition: background-color var(--duration--snappy) var(--easing--ease-out),
            color var(--duration--snappy) var(--easing--ease-out);
        }
        .mode-btn[data-active='true'] {
          background-color: #ffffff;
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-800);
        }
        .header-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .panel-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

// ─── Voice View (Talk mode) ───

function VoiceView() {
  return (
    <div className="voice-view">
      <div className="avatar-pair">
        {/* Agent avatar */}
        <div className="avatar">
          <div className="avatar-ring agent">
            <div className="avatar-inner">
              <N8nLogo size={40} />
            </div>
          </div>
        </div>
        {/* Human avatar */}
        <div className="avatar">
          <div className="avatar-ring human">
            <span className="avatar-letter">G</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .voice-view {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: var(--spacing--md);
          padding-top: var(--spacing--lg);
        }
        .avatar-pair {
          display: flex;
          align-items: center;
        }
        .avatar-pair > :global(.avatar:not(:first-child)) {
          margin-left: -12px;
        }
        .avatar {
          position: relative;
          width: 72px;
          height: 72px;
        }
        .avatar-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-ring.agent {
          border-color: var(--color--orange-200);
        }
        .avatar-ring.human {
          border-color: var(--color--neutral-200);
          background-color: var(--color--neutral-50);
        }
        .avatar-inner {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-letter {
          font-size: 26px;
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-800);
        }
      `}</style>
    </div>
  )
}

// ─── Chat View (Write mode) ───

interface ChatViewProps {
  messages: ChatMessage[]
  onSubmit: (value: string) => void
  isStreaming: boolean
  error: string | null
}

function ChatView({ messages, onSubmit, isStreaming, error }: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages])

  return (
    <div className="chat-view">
      {messages.length === 0 && !isStreaming && (
        <div className="empty-state">
          <p className="empty-text">Say hi to start a new conversation.</p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className="message" data-role={msg.role}>
          <div className="bubble" data-role={msg.role}>
            {msg.content ||
              (msg.pending ? (
                <span className="thinking">
                  <span className="thinking-dot" />
                  Thinking…
                </span>
              ) : null)}
          </div>
          {msg.role === 'agent' &&
            msg.toolActivity &&
            msg.toolActivity.length > 0 && (
              <div className="tool-activity">
                {msg.toolActivity.map((label, i) => (
                  <span key={i} className="tool-activity-item">
                    {label}
                  </span>
                ))}
              </div>
            )}
        </div>
      ))}

      {error && <div className="error">{error}</div>}

      <div ref={scrollRef} />

      {/* Prompt input */}
      <div className="prompt-wrap">
        <PromptInput
          onSubmit={onSubmit}
          disabled={isStreaming}
          placeholder={isStreaming ? 'Agent is working…' : 'Type a message...'}
        />
      </div>

      <style jsx>{`
        .chat-view {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing--md);
          justify-content: flex-end;
          padding-bottom: var(--spacing--md);
          padding-top: var(--spacing--lg);
          overflow-y: auto;
        }
        .empty-state {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .empty-text {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-400);
        }
        .message {
          display: flex;
          flex-direction: column;
        }
        .message[data-role='user'] {
          align-items: flex-end;
        }
        .message[data-role='agent'] {
          align-items: flex-start;
        }
        .bubble {
          border-radius: 16px;
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
          line-height: 20px;
          white-space: pre-wrap;
        }
        .bubble[data-role='user'] {
          background-color: var(--color--neutral-150);
          padding-inline: var(--spacing--xs);
          padding-block: var(--spacing--3xs);
          max-width: 80%;
        }
        .bubble[data-role='agent'] {
          padding: var(--spacing--3xs);
          width: 100%;
        }
        .thinking {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing--4xs);
          color: var(--color--neutral-400);
        }
        .thinking-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background-color: var(--color--neutral-400);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .tool-activity {
          padding-inline: var(--spacing--3xs);
          padding-bottom: var(--spacing--4xs);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .tool-activity-item {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-400);
        }
        .error {
          border-radius: var(--radius--xs);
          background-color: var(--color--red-50);
          border: 1px solid var(--color--red-200);
          padding-inline: var(--spacing--xs);
          padding-block: var(--spacing--3xs);
          font-size: var(--font-size--xs);
          color: var(--color--red-500);
        }
        .prompt-wrap {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  )
}

// ─── Agent Panel (right sidebar) ───

function AgentPanel() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Memory: true,
    Knowledge: true,
    Tools: true,
    Skills: true,
    Connections: true,
    'Guardrails and permissions': false,
    Settings: false,
  })

  const toggle = (key: string) => setExpanded((p) => ({ ...p, [key]: !p[key] }))

  return (
    <div className="agent-panel">
      {agentSections.map((section) => (
        <div key={section.title} className="section-wrap">
          {/* Section header */}
          <button onClick={() => toggle(section.title)} className="section-header">
            <span className="section-title">{section.title}</span>
            {expanded[section.title] ? (
              <ChevronUp style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
            ) : (
              <ChevronDown style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
            )}
          </button>

          {/* Section items */}
          {expanded[section.title] && section.items.length > 0 && (
            <div className="section-items">
              {section.items.map((item) => (
                <div key={item.name} className="item-row">
                  <div className="item-left">
                    {item.icon === 'file' && (
                      <File style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
                    )}
                    {item.icon === 'link' && (
                      <Link2 style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
                    )}
                    {item.icon === 'app' && <span className="app-icon">{item.appIcon}</span>}
                    <span className="item-name">{item.name}</span>
                    <ArrowUpRight style={{ width: 16, height: 16, color: 'var(--color--neutral-300)' }} />
                  </div>
                  {section.title === 'Connections' && (
                    <div className="toggle">
                      <div className="toggle-knob" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="divider" />
        </div>
      ))}

      {/* Extra collapsed sections */}
      {['Guardrails and permissions', 'Settings'].map((title) => (
        <div key={title} className="section-wrap">
          <button onClick={() => toggle(title)} className="section-header">
            <span className="section-title">{title}</span>
            <ChevronDown style={{ width: 16, height: 16, color: 'var(--color--neutral-400)' }} />
          </button>
          <div className="divider" />
        </div>
      ))}

      <style jsx>{`
        .agent-panel {
          flex: 1;
          height: 100%;
          background-color: #ffffff;
          border-left: 1px solid var(--color--black-alpha-100);
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing--xs);
          padding-bottom: var(--spacing--xs);
          padding-top: var(--spacing--2xs);
          padding-inline: var(--spacing--2xs);
          overflow-y: auto;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 32px;
          padding: var(--spacing--4xs);
          border-radius: var(--radius--3xs);
          border: 0;
          background: transparent;
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .section-header:hover {
          background-color: var(--color--neutral-50);
        }
        .section-title {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
        .section-items {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--3xs);
          padding-inline: var(--spacing--xs);
          padding-bottom: var(--spacing--xs);
          padding-top: var(--spacing--4xs);
        }
        .item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .item-left {
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
        }
        .app-icon {
          font-size: 14px;
        }
        .item-name {
          font-family: var(--font-family--mono, ui-monospace, monospace);
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
        .toggle {
          width: 32px;
          height: 18px;
          border-radius: 9999px;
          background-color: var(--color--neutral-200);
          position: relative;
        }
        .toggle-knob {
          position: absolute;
          left: 2px;
          top: 2px;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background-color: #ffffff;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .divider {
          height: 1px;
          background-color: var(--color--neutral-150);
        }
      `}</style>
    </div>
  )
}

// ─── Main Page ───

const PANEL_MIN_WIDTH = 280
const PANEL_MAX_WIDTH = 720
const PANEL_DEFAULT_WIDTH = 320

export default function N8nPulsePage() {
  const [mode, setMode] = useState<Mode>('write')
  const [showPanel, setShowPanel] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [panelWidth, setPanelWidth] = useState(PANEL_DEFAULT_WIDTH)
  const { messages, send, isStreaming, error } = usePulseChat()

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startWidth = panelWidth
    const onMove = (ev: MouseEvent) => {
      const delta = startX - ev.clientX
      const next = Math.min(PANEL_MAX_WIDTH, Math.max(PANEL_MIN_WIDTH, startWidth + delta))
      setPanelWidth(next)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return (
    <div className="n8n-pulse">
      {/* Left sidebar */}
      {showSidebar ? (
        <PulseSidebar onCollapse={() => setShowSidebar(false)} />
      ) : (
        <div className="sidebar-collapsed">
          <button
            type="button"
            onClick={() => setShowSidebar(true)}
            aria-label="Expand sidebar"
            className="expand-btn"
          >
            <PanelLeftOpen style={{ width: 16, height: 16 }} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="main-area">
        <div className="main-col">
          <AgentHeader
            mode={mode}
            onModeChange={setMode}
            showPanel={showPanel}
            onTogglePanel={() => setShowPanel(!showPanel)}
          />
          <div className="content-center">
            {mode === 'talk' ? (
              <VoiceView />
            ) : (
              <ChatView
                messages={messages}
                onSubmit={(value) => send({ message: value })}
                isStreaming={isStreaming}
                error={error}
              />
            )}
          </div>
        </div>

        {/* Right panel */}
        {showPanel && (
          <div className="right-panel" style={{ width: panelWidth }}>
            <div
              onMouseDown={startResize}
              className="resize-handle"
              role="separator"
              aria-orientation="vertical"
            >
              <div className="resize-line" />
            </div>
            <AgentPanel />
          </div>
        )}
      </div>

      <style jsx>{`
        .n8n-pulse {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background-color: var(--color--neutral-100);
        }
        .sidebar-collapsed {
          height: 100%;
          display: flex;
          align-items: flex-start;
          padding: var(--spacing--xs);
          flex-shrink: 0;
        }
        .expand-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius--3xs);
          background: transparent;
          border: 0;
          cursor: pointer;
          color: var(--color--neutral-500);
          transition: background-color var(--duration--snappy) var(--easing--ease-out),
            color var(--duration--snappy) var(--easing--ease-out);
        }
        .expand-btn:hover {
          background-color: var(--color--neutral-125);
          color: var(--color--neutral-800);
        }
        .main-area {
          display: flex;
          flex: 1;
          height: 100%;
          min-width: 0;
        }
        .main-col {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          padding-inline: var(--spacing--md);
        }
        .content-center {
          display: flex;
          flex-direction: column;
          flex: 1;
          width: 100%;
          max-width: 768px;
          margin-inline: auto;
          min-height: 0;
        }
        .right-panel {
          height: 100%;
          flex-shrink: 0;
          display: flex;
          position: relative;
        }
        .resize-handle {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          transform: translateX(-50%);
          cursor: col-resize;
          z-index: 10;
        }
        .resize-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          background-color: transparent;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .resize-handle:hover .resize-line {
          background-color: var(--color--neutral-300);
        }
        .resize-handle:active .resize-line {
          background-color: var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}
