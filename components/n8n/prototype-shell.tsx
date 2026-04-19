'use client'

import { Sidebar } from './sidebar'
import { Toaster } from '@/components/shadcn/sonner'

interface PrototypeShellProps {
  children: React.ReactNode
  hideSidebar?: boolean
}

export function PrototypeShell({ children, hideSidebar = false }: PrototypeShellProps) {
  return (
    <div className="n8n-prototype-shell">
      {!hideSidebar && <Sidebar />}
      <main className="main">{children}</main>
      <Toaster position="bottom-right" />

      <style jsx>{`
        .n8n-prototype-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .main {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
