// components/n8n/workflow-canvas/node-picker.tsx
'use client'

import { useState, useMemo } from 'react'
import { Search, StickyNote } from 'lucide-react'
import { ServiceIcon } from '@/components/n8n/shared/service-icon'
import { SERVICE_CATALOG, type ServiceCatalogEntry } from './service-catalog'
import type { StickyColor } from './types'

interface NodePickerProps {
  open: boolean
  onClose: () => void
  onPickService: (service: ServiceCatalogEntry) => void
  onPickSticky: (color: StickyColor) => void
}

export function NodePicker({ open, onClose, onPickService, onPickSticky }: NodePickerProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SERVICE_CATALOG
    return SERVICE_CATALOG.filter((s) => s.label.toLowerCase().includes(q))
  }, [query])

  const stickyColors = useMemo((): StickyColor[] => {
    const all: StickyColor[] = ['yellow', 'blue', 'green', 'pink']
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((c) => c.includes(q))
  }, [query])

  const triggers = filtered.filter((s) => s.kind === 'trigger')
  const actions  = filtered.filter((s) => s.kind === 'action')

  if (!open) return null

  return (
    <>
      <div className="picker-backdrop" onClick={onClose} />
      <div className="picker-panel" role="dialog" aria-label="Add node">
        <div className="search-row">
          <Search size={14} style={{ color: 'var(--color--neutral-500)' }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
          />
        </div>

        {triggers.length > 0 && (
          <div className="section">
            <div className="section-title">Triggers</div>
            <div className="grid">
              {triggers.map((s) => (
                <button key={s.id} className="item" onClick={() => onPickService(s)} type="button">
                  <ServiceIcon service={s.id} size={20} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div className="section">
            <div className="section-title">Actions</div>
            <div className="grid">
              {actions.map((s) => (
                <button key={s.id} className="item" onClick={() => onPickService(s)} type="button">
                  <ServiceIcon service={s.id} size={20} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stickyColors.length > 0 && (
          <div className="section">
            <div className="section-title">Sticky note</div>
            <div className="grid">
              {stickyColors.map((c) => (
                <button key={c} className="item" onClick={() => onPickSticky(c)} type="button">
                  <span className="swatch" data-color={c}>
                    <StickyNote size={14} />
                  </span>
                  <span>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .picker-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
        }
        .picker-panel {
          position: absolute;
          top: 44px;
          right: 0;
          width: 300px;
          max-height: 480px;
          overflow: auto;
          background: var(--color--neutral-white);
          border: 1px solid var(--color--neutral-200);
          border-radius: var(--radius--md, 6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 51;
          padding: var(--spacing--2xs);
        }
        .search-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--2xs);
          border: 1px solid var(--color--neutral-150);
          border-radius: var(--radius--sm, 4px);
          margin-bottom: var(--spacing--2xs);
        }
        .search-row input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
        }
        .section + .section {
          margin-top: var(--spacing--2xs);
        }
        .section-title {
          font-size: var(--font-size--2xs, 10px);
          font-weight: var(--font-weight--medium, 500);
          color: var(--color--neutral-500);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: var(--spacing--3xs) var(--spacing--2xs);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
        }
        .item {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--2xs);
          background: transparent;
          border: none;
          border-radius: var(--radius--sm, 4px);
          font-size: var(--font-size--sm, 13px);
          color: var(--color--neutral-800);
          cursor: pointer;
          text-align: left;
        }
        .item:hover {
          background: var(--color--neutral-100);
        }
        .swatch {
          width: 20px;
          height: 20px;
          border-radius: var(--radius--sm, 4px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color--neutral-700);
        }
        .swatch[data-color='yellow'] { background: #FFF4B8; }
        .swatch[data-color='blue']   { background: #CFE6FF; }
        .swatch[data-color='green']  { background: #D1F0D6; }
        .swatch[data-color='pink']   { background: #FFD6E1; }
      `}</style>
    </>
  )
}
