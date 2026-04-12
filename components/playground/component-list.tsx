"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComponentEntry } from "@/lib/prototypes"
import { getComponentPreview } from "./component-previews"

interface ComponentListProps {
  components: ComponentEntry[]
  searchQuery: string
}

export function ComponentList({ components, searchQuery }: ComponentListProps) {
  const filtered = searchQuery.trim()
    ? components.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.path.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : components

  const n8nComponents = filtered.filter((c) => c.category === "n8n")
  const uiComponents = filtered.filter((c) => c.category === "ui")

  if (filtered.length === 0) {
    return (
      <p className="text-[var(--color--neutral-400)] text-sm py-8">
        No components found.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {n8nComponents.length > 0 && (
        <div>
          <h3 className="text-[var(--font-size--2xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-400)] uppercase tracking-wide mb-2">
            n8n Components
          </h3>
          <div className="space-y-0">
            {n8nComponents.map((c) => (
              <ComponentRow key={c.path} component={c} />
            ))}
          </div>
        </div>
      )}
      {uiComponents.length > 0 && (
        <div>
          <h3 className="text-[var(--font-size--2xs)] font-[var(--font-weight--medium)] text-[var(--color--neutral-400)] uppercase tracking-wide mb-2">
            shadcn/ui Components
          </h3>
          <div className="space-y-0">
            {uiComponents.map((c) => (
              <ComponentRow key={c.path} component={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ComponentRow({ component }: { component: ComponentEntry }) {
  const [expanded, setExpanded] = useState(false)
  const preview = getComponentPreview(component.path)

  return (
    <div className="border-b border-[var(--color--neutral-100)] last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 px-3 py-2.5 -mx-3 w-[calc(100%+24px)] rounded-[var(--radius--xs)] hover:bg-[var(--color--neutral-50)] transition-colors text-left"
      >
        <ChevronRight
          className={cn(
            "w-3.5 h-3.5 text-[var(--color--neutral-300)] transition-transform",
            expanded && "rotate-90"
          )}
        />
        <span className="text-sm text-[var(--color--neutral-800)]">
          {component.name}
        </span>
        <span className="text-[var(--font-size--2xs)] text-[var(--color--neutral-300)] font-mono">
          {component.path}
        </span>
      </button>
      {expanded && preview && (
        <div className="ml-6 mr-3 mb-3 p-4 rounded-[var(--radius--sm)] border border-[var(--color--neutral-100)] bg-[var(--color--neutral-50)]">
          {preview}
        </div>
      )}
    </div>
  )
}
