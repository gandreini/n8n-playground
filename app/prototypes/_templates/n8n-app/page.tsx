"use client"

import { PrototypeShell } from "@/components/n8n/prototype-shell"

export default function N8nAppPrototype() {
  return (
    <PrototypeShell>
      <div className="wrap">
        <h1>New Prototype</h1>
        <p>This prototype includes n8n app chrome with sidebar.</p>

        <style jsx>{`
          .wrap {
            padding: var(--spacing--xl);
          }
          h1 {
            font-size: var(--font-size--2xl);
            font-weight: var(--font-weight--bold);
            color: var(--color--text--shade-1);
          }
          p {
            margin-top: var(--spacing--2xs);
            color: var(--color--text);
          }
        `}</style>
      </div>
    </PrototypeShell>
  )
}
