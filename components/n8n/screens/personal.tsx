'use client'

import { useStore, Tab } from '@/lib/store'
import { ChevronDown, Search, Filter, Circle } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { WorkflowRow } from '../shared/workflow-row'
import { CredentialRow } from '../shared/credential-row'
import { ExecutionRow } from '../shared/execution-row'
import { ExecutionListHeader } from '../shared/execution-list-header'
import { TabBar } from '../shared/tab-bar'
import { N8nButton } from '../shared/button'
import { IconButton } from '../shared/icon-button'
import { Pagination } from '../shared/pagination'
import { CredentialModal } from '../modals/credential-modal'

export function PersonalScreen() {
  const {
    currentTab,
    setTab,
    workflows,
    credentials,
    executions,
    openWorkflow,
    selectedCredentialId,
    selectCredential,
  } = useStore()

  const selectedCredential = credentials.find((c) => c.id === selectedCredentialId)

  return (
    <div className="n8n-personal">
      {/* Header */}
      <div className="header">
        <div className="title-row">
          <div className="title-text">
            <h1 className="title">Personal</h1>
            <p className="subtitle">Workflows, credentials and data tables owned by you</p>
          </div>
          <div className="split-btn">
            <N8nButton className="left-half">
              {currentTab === 'credentials' ? 'Create credential' : 'Create workflow'}
            </N8nButton>
            <N8nButton
              className="right-half"
              iconOnly
              icon={<ChevronDown style={{ width: 16, height: 16 }} />}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabBar
        tabs={[
          { id: 'workflows', label: 'Workflows' },
          { id: 'credentials', label: 'Credentials' },
          { id: 'executions', label: 'Executions' },
          { id: 'data-tables', label: 'Data tables' },
        ]}
        activeTab={currentTab}
        onTabChange={(id) => setTab(id as Tab)}
      />

      {/* Content */}
      <div className="content">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-wrap">
            <Search className="search-icon" />
            <Input
              placeholder={currentTab === 'credentials' ? 'Search credentials...' : 'Search'}
            />
          </div>
          <N8nButton
            variant="subtle"
            size="small"
            icon={<ChevronDown style={{ width: 16, height: 16 }} />}
          >
            Sort by last updated
          </N8nButton>
          <IconButton
            icon={<Filter style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }} />}
            label="Filter"
          />
        </div>

        {/* List Content */}
        <div className="list n8n-scrollbar">
          {currentTab === 'workflows' && (
            <div className="workflows-list">
              {workflows.map((workflow) => (
                <WorkflowRow
                  key={workflow.id}
                  workflow={workflow}
                  onClick={() => openWorkflow(workflow.id)}
                />
              ))}
            </div>
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
              <div className="exec-header">
                <div className="exec-status">
                  <Circle style={{ width: 16, height: 16 }} />
                  No active executions
                </div>
                <div className="exec-actions">
                  <button className="stop-all">Stop all</button>
                  <IconButton
                    icon={
                      <Filter
                        style={{ width: 16, height: 16, color: 'var(--color--neutral-500)' }}
                      />
                    }
                    label="Filter"
                  />
                </div>
              </div>
              <ExecutionListHeader />
              {executions.map((execution) => (
                <ExecutionRow key={execution.id} execution={execution} />
              ))}
            </>
          )}

          {currentTab === 'data-tables' && <div className="empty">No data tables</div>}
        </div>

        {/* Pagination */}
        {(currentTab === 'workflows' ||
          currentTab === 'credentials' ||
          currentTab === 'executions') && (
          <Pagination
            total={
              currentTab === 'workflows'
                ? workflows.length
                : currentTab === 'credentials'
                  ? credentials.length
                  : executions.length
            }
          />
        )}
      </div>

      {/* Credential Modal */}
      {selectedCredential && (
        <CredentialModal
          credential={selectedCredential}
          onClose={() => selectCredential(null)}
        />
      )}

      <style jsx>{`
        .n8n-personal {
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: var(--color--neutral-white, #ffffff);
        }
        .header {
          padding-inline: var(--spacing--md);
          padding-block: var(--spacing--sm);
          border-bottom: 1px solid var(--color--neutral-150);
        }
        .title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .title-text {
          min-width: 0;
        }
        .title {
          font-size: var(--font-size--xl);
          font-weight: var(--font-weight--bold);
          color: var(--color--neutral-800);
        }
        .subtitle {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-400);
        }
        .split-btn {
          display: flex;
        }
        .split-btn :global(.left-half button) {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .split-btn :global(.right-half button) {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          padding-inline: var(--spacing--3xs) !important;
          border-left: 1px solid var(--color--orange-500);
        }

        .content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .search-bar {
          padding-inline: var(--spacing--md);
          padding-block: var(--spacing--3xs);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--spacing--2xs);
        }
        .search-wrap {
          position: relative;
        }
        .search-wrap :global(.search-icon) {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: var(--color--neutral-400);
          z-index: 1;
        }
        .search-wrap :global(input) {
          padding-left: 36px;
          width: 192px;
          height: 36px;
          font-size: var(--font-size--sm);
        }

        .list {
          flex: 1;
          overflow-y: auto;
        }
        .workflows-list {
          padding-inline: var(--spacing--md);
          padding-block: var(--spacing--3xs);
          display: flex;
          flex-direction: column;
          gap: var(--spacing--3xs);
        }

        .exec-header {
          padding-inline: var(--spacing--sm);
          padding-block: var(--spacing--3xs);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color--neutral-100);
        }
        .exec-status {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          font-size: var(--font-size--sm);
          color: var(--color--neutral-500);
        }
        .exec-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
        }
        .stop-all {
          background: transparent;
          border: 0;
          padding: 0;
          cursor: pointer;
          font-size: var(--font-size--sm);
          color: var(--color--neutral-500);
          transition: color var(--duration--snappy) var(--easing--ease-out);
        }
        .stop-all:hover {
          color: var(--color--neutral-700);
        }
        .empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}
