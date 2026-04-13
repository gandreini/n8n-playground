"use client"

import { PrototypeShell } from "@/components/n8n/prototype-shell"

export default function N8nAppPrototype() {
  return (
    <PrototypeShell>
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-foreground">New Prototype</h1>
        <p className="text-muted-foreground mt-2">This prototype includes n8n app chrome with sidebar.</p>
      </div>
    </PrototypeShell>
  )
}
