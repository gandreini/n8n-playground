'use client'

import { MoreVertical, User } from 'lucide-react'
import { formatDistanceToNowStrict, format } from 'date-fns'
import type { Workflow } from '@/lib/store'
import { cn } from '@/lib/utils'

interface WorkflowRowProps {
  workflow: Workflow
  onClick?: () => void
}

function formatCreatedDate(date: Date) {
  const now = new Date()
  const sameYear = date.getFullYear() === now.getFullYear()
  return sameYear ? format(date, 'd MMMM') : format(date, 'd MMMM, yyyy')
}

function Tag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-1 py-0.5 rounded-[var(--radius--3xs)] bg-[var(--color--neutral-125)] text-[var(--font-size--2xs)] text-[var(--color--neutral-500)] leading-[14px]">
      {text}
    </span>
  )
}

export function WorkflowRow({ workflow, onClick }: WorkflowRowProps) {
  const hasProductionTag = workflow.tags?.includes('Production Workflows')
  const hasCheckmark = workflow.status === 'published' && hasProductionTag
  const sharedCount = workflow.linkedCount

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between bg-[var(--color--neutral-white)] border border-[var(--color--neutral-200)] rounded-[var(--radius--xs)] p-4 hover:border-[var(--color--neutral-300)] transition-snappy',
        onClick && 'cursor-pointer'
      )}
    >
      {/* Left: name + metadata */}
      <div className="flex flex-col gap-0.5 min-w-0">
        {/* Heading */}
        <div className="flex items-center gap-1.5">
          {hasCheckmark && <span className="text-sm leading-none">✅</span>}
          <span className="text-[14px] font-[var(--font-weight--medium)] text-[var(--color--neutral-800)] leading-[20px]">
            {workflow.name}
          </span>
        </div>
        {/* Subheading */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] leading-[18px] whitespace-nowrap">
            Last updated {formatDistanceToNowStrict(workflow.lastUpdated)} ago
            <span className="mx-1">|</span>
            Created {formatCreatedDate(workflow.createdAt)}
          </span>
          {workflow.tags?.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </div>

      {/* Right: badges + menu */}
      <div className="flex items-center gap-4 shrink-0 ml-4">
        <div className="flex items-center gap-2">
          {/* Ownership badge — segmented pill */}
          <div className="flex items-center h-6 rounded-[var(--radius--3xs)]">
            {/* Personal segment */}
            <div className="flex items-center gap-1.5 h-full px-2 py-1 bg-[var(--color--neutral-white)] border border-[var(--color--neutral-200)] rounded-l-[var(--radius--3xs)] text-[var(--font-size--2xs)] text-[var(--color--neutral-500)] leading-[18px] whitespace-nowrap">
              <User className="w-2.5 h-2.5 text-[var(--color--neutral-500)]" />
              {workflow.project || 'Personal'}
            </div>
            {/* Shared count segment */}
            {sharedCount && sharedCount > 0 && (
              <div className="flex items-center h-full px-2 py-1 bg-[var(--color--neutral-white)] border border-l-0 border-[var(--color--neutral-200)] rounded-r-[var(--radius--3xs)] text-[var(--font-size--2xs)] text-[var(--color--neutral-400)] leading-[18px] whitespace-nowrap">
                +{sharedCount}
              </div>
            )}
            {/* Close the pill if no shared count */}
            {(!sharedCount || sharedCount === 0) && null}
          </div>

          {/* Published badge */}
          {workflow.status === 'published' && (
            <div className="flex items-center gap-1.5 h-6 px-2 py-1 bg-[var(--color--neutral-white)] border border-[var(--color--neutral-200)] rounded-[var(--radius--3xs)] text-[var(--font-size--2xs)] text-[var(--color--neutral-500)] leading-[18px] whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-[var(--color--green-500)]" />
              Published
            </div>
          )}
        </div>

        {/* More menu */}
        <button className="p-0.5 hover:bg-[var(--color--neutral-100)] rounded-[var(--radius--3xs)] transition-snappy">
          <MoreVertical className="w-3.5 h-3.5 text-[var(--color--neutral-800)]" />
        </button>
      </div>
    </div>
  )
}
