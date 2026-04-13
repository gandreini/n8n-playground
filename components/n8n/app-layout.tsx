'use client'

import { useStore } from '@/lib/store'
import { Sidebar } from './sidebar'
import { OverviewScreen } from './screens/overview'
import { PersonalScreen } from './screens/personal'
import { WorkflowEditor } from './screens/workflow-editor'
import { SettingsScreen } from './screens/settings'
import { Toaster } from '@/components/ui/sonner'

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
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--color--neutral-400)]">Shared with you - Coming soon</p>
          </div>
        )
      case 'chat':
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[var(--color--neutral-400)]">Chat (beta) - Coming soon</p>
          </div>
        )
      default:
        return <OverviewScreen />
    }
  }
  
  return (
    <div className="n8n-app-layout flex h-screen overflow-hidden">
      {currentScreen !== 'workflow-editor' && <Sidebar />}
      <main className="flex-1 overflow-hidden">
        {renderScreen()}
      </main>
      <Toaster position="bottom-right" />
    </div>
  )
}
