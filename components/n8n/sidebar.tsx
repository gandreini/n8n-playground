'use client'

import { useStore, Screen } from '@/lib/store'
import {
  Home,
  User,
  Upload,
  MessageSquare,
  Shield,
  LayoutGrid,
  BarChart3,
  HelpCircle,
  Settings,
  Plus,
  Search,
  Copy,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { N8nLogo } from './shared/n8n-logo'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: string
  hasSubmenu?: boolean
  hasNotification?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, active, badge, hasSubmenu, hasNotification, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-[var(--radius--xs)] transition-snappy text-left',
        active
          ? 'bg-[var(--color--neutral-100)] text-[var(--color--neutral-800)] font-[var(--font-weight--bold)]'
          : 'text-[var(--color--neutral-500)] hover:bg-[var(--color--neutral-100)] hover:text-[var(--color--neutral-700)]'
      )}
    >
      <span className="relative flex-shrink-0">
        {hasNotification && (
          <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[var(--color--red-500)]" />
        )}
        {icon}
      </span>
      <span className="flex-1 text-[var(--font-size--xs)]">{label}</span>
      {badge && (
        <span className="px-1.5 py-0.5 text-[var(--font-size--3xs)] bg-[var(--color--neutral-150)] text-[var(--color--neutral-500)] rounded-[var(--radius--3xs)]">
          {badge}
        </span>
      )}
      {hasSubmenu && (
        <ChevronRight className="w-4 h-4 text-[var(--color--neutral-300)]" />
      )}
    </button>
  )
}

export function Sidebar() {
  const { currentScreen, setScreen } = useStore()
  
  return (
    <aside className="w-[200px] h-screen flex flex-col bg-[var(--color--neutral-white)] border-r border-[var(--color--neutral-150)]">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <N8nLogo />
          <span className="text-[var(--font-size--md)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
            n8n
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-100)] transition-snappy">
            <Plus className="w-4 h-4 text-[var(--color--neutral-500)]" />
          </button>
          <button className="p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-100)] transition-snappy">
            <Search className="w-4 h-4 text-[var(--color--neutral-500)]" />
          </button>
          <button className="p-1.5 rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-100)] transition-snappy">
            <Copy className="w-4 h-4 text-[var(--color--neutral-500)]" />
          </button>
        </div>
      </div>
      
      {/* Main Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto n8n-scrollbar">
        <NavItem
          icon={<Home className="w-4 h-4" />}
          label="Overview"
          active={currentScreen === 'overview'}
          onClick={() => setScreen('overview')}
        />
        <NavItem
          icon={<User className="w-4 h-4" />}
          label="Personal"
          active={currentScreen === 'personal'}
          onClick={() => setScreen('personal')}
        />
        <NavItem
          icon={<Upload className="w-4 h-4" />}
          label="Shared with you"
          active={currentScreen === 'shared'}
          onClick={() => setScreen('shared')}
        />
        <NavItem
          icon={<MessageSquare className="w-4 h-4" />}
          label="Chat"
          badge="beta"
          active={currentScreen === 'chat'}
          onClick={() => setScreen('chat')}
        />
        
        {/* Projects Section */}
        <div className="pt-4 pb-2">
          <span className="px-3 text-[var(--font-size--2xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-400)] uppercase tracking-wide">
            Projects
          </span>
        </div>
        <NavItem
          icon={<Shield className="w-4 h-4" />}
          label="Customer Support"
        />
      </nav>
      
      {/* Bottom Nav */}
      <div className="px-2 py-4 border-t border-[var(--color--neutral-150)] space-y-0.5">
        <NavItem
          icon={<LayoutGrid className="w-4 h-4" />}
          label="Admin Panel"
        />
        <NavItem
          icon={<LayoutGrid className="w-4 h-4" />}
          label="Templates"
        />
        <NavItem
          icon={<BarChart3 className="w-4 h-4" />}
          label="Insights"
        />
        <NavItem
          icon={<HelpCircle className="w-4 h-4" />}
          label="Help"
          hasSubmenu
          hasNotification
        />
        <NavItem
          icon={<Settings className="w-4 h-4" />}
          label="Settings"
          hasSubmenu
          active={currentScreen === 'settings'}
          onClick={() => setScreen('settings')}
        />
      </div>
    </aside>
  )
}
