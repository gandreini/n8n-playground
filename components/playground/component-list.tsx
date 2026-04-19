"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
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
      <p className="empty">
        No components found.

        <style jsx>{`
          .empty {
            color: var(--color--neutral-400);
            font-size: var(--font-size--sm);
            padding-block: var(--spacing--xl);
          }
        `}</style>
      </p>
    )
  }

  return (
    <div className="playground-component-list">
      {n8nComponents.length > 0 && (
        <section>
          <h3>n8n Components</h3>
          <div className="rows">
            {n8nComponents.map((c) => (
              <ComponentRow key={c.path} component={c} />
            ))}
          </div>
        </section>
      )}
      {uiComponents.length > 0 && (
        <section>
          <h3>shadcn/ui Components</h3>
          <div className="rows">
            {uiComponents.map((c) => (
              <ComponentRow key={c.path} component={c} />
            ))}
          </div>
        </section>
      )}

      <style jsx>{`
        .playground-component-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--lg);
        }
        h3 {
          font-size: var(--font-size--2xs);
          font-weight: var(--font-weight--medium);
          color: var(--color--neutral-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--spacing--2xs);
        }
      `}</style>
    </div>
  )
}

function ComponentRow({ component }: { component: ComponentEntry }) {
  const [expanded, setExpanded] = useState(false)
  const preview = getComponentPreview(component.path)

  return (
    <div className="row">
      <button
        onClick={() => setExpanded(!expanded)}
        className="trigger"
        data-expanded={expanded}
      >
        <ChevronRight className="chevron" />
        <span className="name">{component.name}</span>
        <span className="path">{component.path}</span>
      </button>
      {expanded && preview && <div className="preview">{preview}</div>}

      <style jsx>{`
        .row {
          border-bottom: 1px solid var(--color--neutral-100);
        }
        .row:last-child {
          border-bottom: 0;
        }
        .trigger {
          display: flex;
          align-items: center;
          gap: var(--spacing--xs);
          padding: 10px var(--spacing--xs);
          margin-inline: calc(var(--spacing--xs) * -1);
          width: calc(100% + 24px);
          border-radius: var(--radius--xs);
          text-align: left;
          background: none;
          border: 0;
          cursor: pointer;
          transition: background-color var(--duration--snappy) var(--easing--ease-out);
        }
        .trigger:hover {
          background-color: var(--color--neutral-50);
        }
        .trigger :global(.chevron) {
          width: 14px;
          height: 14px;
          color: var(--color--neutral-300);
          transition: transform var(--duration--snappy) var(--easing--ease-out);
        }
        .trigger[data-expanded="true"] :global(.chevron) {
          transform: rotate(90deg);
        }
        .name {
          font-size: var(--font-size--sm);
          color: var(--color--neutral-800);
        }
        .path {
          font-size: var(--font-size--2xs);
          color: var(--color--neutral-300);
          font-family: var(--font-mono);
        }
        .preview {
          margin-inline: var(--spacing--lg) var(--spacing--xs);
          margin-bottom: var(--spacing--xs);
          padding: var(--spacing--sm);
          border-radius: var(--radius--sm);
          border: 1px solid var(--color--neutral-100);
          background-color: var(--color--neutral-50);
        }
      `}</style>
    </div>
  )
}
