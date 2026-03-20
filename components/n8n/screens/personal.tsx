'use client'

import { useStore, Tab, Workflow, Credential, Execution } from '@/lib/store'
import {
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle2,
  Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ServiceIcon } from '../shared/service-icon'
import { CredentialModal } from '../modals/credential-modal'
import { formatDistanceToNow, format } from 'date-fns'

type PersonalTab = 'workflows' | 'credentials' | 'executions' | 'data-tables'

function TabButton({ tab, label, active, onClick }: { tab: PersonalTab; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-[var(--font-size--sm)] font-[var(--font-weight--medium)] border-b-2 transition-snappy',
        active
          ? 'text-[var(--color--orange-300)] border-[var(--color--orange-300)]'
          : 'text-[var(--color--neutral-500)] border-transparent hover:text-[var(--color--neutral-700)]'
      )}
    >
      {label}
    </button>
  )
}

function WorkflowRow({ workflow, onClick }: { workflow: Workflow; onClick: () => void }) {
  const hasCheckmark = workflow.status === 'published' && workflow.tags?.includes('Production Workflows')
  
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] cursor-pointer transition-snappy"
    >
      <div className="flex-1">
        <div className="flex items-center gap-1">
          {hasCheckmark && <span className="text-[var(--color--green-500)]">✓</span>}
          <span className="text-[var(--font-size--sm)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
            {workflow.name}
          </span>
        </div>
        <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] mt-0.5">
          Last updated {formatDistanceToNow(workflow.lastUpdated)} ago | Created {format(workflow.createdAt, 'd MMMM, yyyy')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-2 py-1 text-[var(--font-size--2xs)] border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] flex items-center gap-1">
          <User className="w-3 h-3" />
          Personal
        </span>
        {workflow.status === 'published' && (
          <span className="flex items-center gap-1 text-[var(--font-size--2xs)] text-[var(--color--neutral-500)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color--green-500)]" />
            Published
          </span>
        )}
        <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
          <MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />
        </button>
      </div>
    </div>
  )
}

function CredentialRow({ credential, onClick }: { credential: Credential; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] cursor-pointer transition-snappy"
    >
      <ServiceIcon service={credential.icon} size={36} />
      <div className="flex-1">
        <span className="text-[var(--font-size--sm)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
          {credential.name}
        </span>
        <p className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] mt-0.5">
          {credential.type} | Last updated {formatDistanceToNow(credential.lastUpdated)} ago | Created {format(credential.createdAt, 'd MMMM, yyyy')}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-2 py-1 text-[var(--font-size--2xs)] border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] flex items-center gap-1">
          <User className="w-3 h-3" />
          Personal
        </span>
        <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
          <MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />
        </button>
      </div>
    </div>
  )
}

function ExecutionRow({ execution }: { execution: Execution }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--color--neutral-100)] hover:bg-[var(--color--neutral-50)] transition-snappy">
      <input type="checkbox" className="w-4 h-4 rounded border-[var(--color--neutral-200)]" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-[var(--color--green-500)]">✓</span>
        {execution.workflowIcon && <ServiceIcon service={execution.workflowIcon} size={20} />}
        <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-800)] truncate">
          {execution.workflowName}
        </span>
      </div>
      <div className="flex items-center gap-2 w-24">
        {execution.status === 'queued' ? (
          <>
            <Circle className="w-4 h-4 text-[var(--color--neutral-300)]" />
            <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-500)]">Queued</span>
          </>
        ) : execution.status === 'success' ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[var(--color--green-500)]" />
            <span className="text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">Success</span>
          </>
        ) : (
          <>
            <Circle className="w-4 h-4 text-[var(--color--red-500)]" />
            <span className="text-[var(--font-size--sm)] text-[var(--color--red-500)]">Error</span>
          </>
        )}
      </div>
      <div className="w-36 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
        {format(execution.startedAt, 'MMM d, HH:mm:ss')}
      </div>
      <div className="w-24 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
        {execution.runTime}
      </div>
      <div className="w-20 text-[var(--font-size--sm)] text-[var(--color--neutral-700)]">
        {execution.executionId}
      </div>
      {execution.status === 'queued' && (
        <Button variant="ghost" size="sm" className="text-[var(--color--neutral-500)]">
          Stop
        </Button>
      )}
      <button className="p-1 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)]">
        <MoreVertical className="w-4 h-4 text-[var(--color--neutral-400)]" />
      </button>
    </div>
  )
}

export function PersonalScreen() {
  const {
    currentTab,
    setTab,
    workflows,
    credentials,
    executions,
    openWorkflow,
    selectedCredentialId,
    selectCredential
  } = useStore()
  
  const selectedCredential = credentials.find(c => c.id === selectedCredentialId)
  
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--color--neutral-white)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color--neutral-150)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[var(--font-size--xl)] font-[var(--font-weight--bold)] text-[var(--color--neutral-800)]">
              Personal
            </h1>
            <p className="text-[var(--font-size--sm)] text-[var(--color--neutral-400)]">
              Workflows, credentials and data tables owned by you
            </p>
          </div>
          <div className="flex">
            <Button className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white rounded-r-none">
              {currentTab === 'credentials' ? 'Create credential' : 'Create workflow'}
            </Button>
            <Button className="bg-[var(--color--orange-300)] hover:bg-[var(--color--orange-400)] text-white rounded-l-none border-l border-[var(--color--orange-400)] px-2">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="px-6 border-b border-[var(--color--neutral-150)]">
        <div className="flex">
          <TabButton tab="workflows" label="Workflows" active={currentTab === 'workflows'} onClick={() => setTab('workflows')} />
          <TabButton tab="credentials" label="Credentials" active={currentTab === 'credentials'} onClick={() => setTab('credentials')} />
          <TabButton tab="executions" label="Executions" active={currentTab === 'executions'} onClick={() => setTab('executions')} />
          <TabButton tab="data-tables" label="Data tables" active={currentTab === 'data-tables'} onClick={() => setTab('data-tables')} />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="px-6 py-3 flex items-center justify-end gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color--neutral-400)]" />
            <Input
              placeholder={currentTab === 'credentials' ? 'Search credentials...' : 'Search'}
              className="pl-9 w-48 h-9 text-[var(--font-size--sm)]"
            />
          </div>
          <Button variant="outline" className="gap-2 h-9 text-[var(--font-size--sm)]">
            Sort by last updated
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        {/* List Content */}
        <div className="flex-1 overflow-y-auto n8n-scrollbar">
          {currentTab === 'workflows' && (
            <>
              {workflows.map((workflow) => (
                <WorkflowRow
                  key={workflow.id}
                  workflow={workflow}
                  onClick={() => openWorkflow(workflow.id)}
                />
              ))}
            </>
          )}
          
          {currentTab === 'credentials' && (
            <>
              {credentials.map((credential) => (
                <CredentialRow
                  key={credential.id}
                  credential={credential}
                  onClick={() => selectCredential(credential.id)}
                />
              ))}
            </>
          )}
          
          {currentTab === 'executions' && (
            <>
              <div className="px-4 py-2 flex items-center justify-between border-b border-[var(--color--neutral-100)]">
                <div className="flex items-center gap-2 text-[var(--font-size--sm)] text-[var(--color--neutral-500)]">
                  <Circle className="w-4 h-4" />
                  No active executions
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-[var(--font-size--sm)] text-[var(--color--neutral-500)] hover:text-[var(--color--neutral-700)]">
                    Stop all
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-2 bg-[var(--color--neutral-50)] border-b border-[var(--color--neutral-100)] text-[var(--font-size--2xs)] text-[var(--color--neutral-500)] font-[var(--font-weight--medium)]">
                <span className="w-4" />
                <span className="flex-1">Workflow</span>
                <span className="w-24">Status</span>
                <span className="w-36">Started</span>
                <span className="w-24">Run Time</span>
                <span className="w-20">Exec. ID</span>
                <span className="w-14" />
                <span className="w-8" />
              </div>
              {executions.map((execution) => (
                <ExecutionRow key={execution.id} execution={execution} />
              ))}
            </>
          )}
          
          {currentTab === 'data-tables' && (
            <div className="flex items-center justify-center h-full text-[var(--color--neutral-400)]">
              No data tables
            </div>
          )}
        </div>
      </div>
      
      {/* Credential Modal */}
      {selectedCredential && (
        <CredentialModal
          credential={selectedCredential}
          onClose={() => selectCredential(null)}
        />
      )}
    </div>
  )
}
