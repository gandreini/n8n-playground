"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { format, isThisMonth, isThisYear } from "date-fns"
import type { PrototypeEntry } from "@/lib/prototypes"

interface PrototypeListProps {
  prototypes: PrototypeEntry[]
  searchQuery: string
}

function groupByMonth(entries: PrototypeEntry[]): Record<string, PrototypeEntry[]> {
  const groups: Record<string, PrototypeEntry[]> = {}

  for (const entry of entries) {
    if (!entry.date) {
      const key = "Undated"
      if (!groups[key]) groups[key] = []
      groups[key].push(entry)
      continue
    }

    const date = new Date(entry.date + "T00:00:00")
    let key: string
    if (isThisMonth(date)) {
      key = "This month"
    } else if (isThisYear(date)) {
      key = format(date, "MMMM")
    } else {
      key = format(date, "MMMM yyyy")
    }

    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }

  return groups
}

function filterEntries(entries: PrototypeEntry[], query: string): PrototypeEntry[] {
  if (!query.trim()) return entries
  const q = query.toLowerCase()
  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.author.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
  )
}

export function PrototypeList({ prototypes, searchQuery }: PrototypeListProps) {
  const filtered = filterEntries(
    prototypes.filter((p) => !p.template),
    searchQuery
  )
  const groups = groupByMonth(filtered)

  if (filtered.length === 0) {
    return (
      <p className="text-[var(--color--neutral-400)] text-sm py-8">
        No prototypes found.
      </p>
    )
  }

  return (
    <div className="playground-prototype-list space-y-6">
      {Object.entries(groups).map(([month, entries]) => (
        <div key={month}>
          <h3 className="text-[var(--font-size--2xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-400)] uppercase tracking-wide mb-2">
            {month}
          </h3>
          <div className="space-y-0">
            {entries.map((entry) => (
              <PrototypeRow key={entry.slug} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function PrototypeRow({ entry }: { entry: PrototypeEntry }) {
  const isExternal = !!entry.externalUrl
  const href = isExternal ? entry.externalUrl! : entry.path
  const formattedDate = entry.date
    ? format(new Date(entry.date + "T00:00:00"), "MMM d")
    : ""

  const content = (
    <div className="flex items-center gap-3 px-3 py-2.5 -mx-3 rounded-[var(--radius--xs)] hover:bg-[var(--color--neutral-50)] transition-colors group">
      <span className="flex-1 text-sm text-[var(--color--neutral-800)] group-hover:text-[var(--color--orange-500)] transition-colors">
        {entry.title}
      </span>
      {isExternal && (
        <ExternalLink className="w-3.5 h-3.5 text-[var(--color--neutral-300)]" />
      )}
      <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-400)]">
        {entry.author}
      </span>
      <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-300)] w-16 text-right">
        {formattedDate}
      </span>
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return <Link href={href} target="_blank">{content}</Link>
}
