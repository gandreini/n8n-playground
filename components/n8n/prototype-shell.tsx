'use client'

import { Sidebar } from './sidebar'
import { Toaster } from '@/components/shadcn/sonner'

interface PrototypeShellProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export function PrototypeShell({ children, hideSidebar = false }: PrototypeShellProps) {
  return (
    <div className="n8n-prototype-shell flex h-screen overflow-hidden">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
}
