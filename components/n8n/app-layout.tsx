'use client'

import { useStore } from '@/lib/store'
import { Sidebar } from './sidebar'
import { OverviewScreen } from './screens/overview'
import { PersonalScreen } from './screens/personal'
import { WorkflowEditor } from './screens/workflow-editor'
import { SettingsScreen } from './screens/settings'
import { Toaster } from '@/components/shadcn/sonner'

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="coming-soon">
      <p>{label}</p>
      <style jsx>{`
        .coming-soon {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        p {
          color: var(--color--neutral-400);
        }
      `}</style>
    </div>
  )
}

export function AppLayout() {
  const { currentScreen } = useStore()

  const renderScreen = () => {
    switch (currentScreen) {
      case 'overview':
        return <OverviewScreen />
      case 'personal':
        return <PersonalScreen />
      case 'workflow-editor':
        return <WorkflowEditor />
      case 'settings':
        return <SettingsScreen />
      case 'shared':
        return <ComingSoon label="Shared with you - Coming soon" />
      case 'chat':
        return <ComingSoon label="Chat (beta) - Coming soon" />
      default:
        return <OverviewScreen />
    }
  }

  return (
    <div className="n8n-app-layout">
      {currentScreen !== 'workflow-editor' && <Sidebar />}
      <main className="main">{renderScreen()}</main>
      <Toaster position="bottom-right" />

      <style jsx>{`
        .n8n-app-layout {
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
