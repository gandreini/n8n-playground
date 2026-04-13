"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"
import type { PrototypeEntry } from "@/lib/prototypes"

interface VisionListProps {
  prototypes: PrototypeEntry[]
  searchQuery: string
}

export function VisionList({ prototypes, searchQuery }: VisionListProps) {
  const featured = prototypes.filter((p) => p.featured && !p.template)

  const filtered = searchQuery.trim()
    ? featured.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featured

  if (filtered.length === 0) {
    return (
      <p className="text-[var(--color--neutral-400)] text-sm py-8">
        No featured prototypes yet. Mark a prototype as featured in its metadata.json.
      </p>
    )
  }

  return (
    <div className="playground-vision-list space-y-0">
      {filtered.map((entry) => {
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
            <a key={entry.slug} href={href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          )
        }

        return (
          <Link key={entry.slug} href={href} target="_blank">
            {content}
          </Link>
        )
      })}
    </div>
  )
}
