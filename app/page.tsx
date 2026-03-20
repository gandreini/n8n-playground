"use client"

import { useStore } from "@/lib/store"
import { AppLayout } from "@/components/n8n/app-layout"
import { OverviewScreen } from "@/components/n8n/screens/overview"
import { PersonalScreen } from "@/components/n8n/screens/personal"
import { WorkflowEditor } from "@/components/n8n/screens/workflow-editor"
import { SettingsScreen } from "@/components/n8n/screens/settings"

export default function Home() {
  const { currentScreen } = useStore()

  const renderScreen = () => {
    switch (currentScreen) {
      case "overview":
        return <OverviewScreen />
      case "personal":
        return <PersonalScreen />
      case "shared":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Shared with you</h1>
            <p className="text-muted-foreground mb-8">Workflows and credentials shared with you</p>
            <div className="border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No items shared with you yet</p>
            </div>
          </div>
        )
      case "chat":
        return (
          <div className="p-8">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
              <span className="text-xs bg-n8n-primary/10 text-n8n-primary px-2 py-0.5 rounded-full font-medium">beta</span>
            </div>
            <p className="text-muted-foreground mb-8">Chat with AI to build workflows</p>
            <div className="border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Start a new conversation to build workflows with AI</p>
            </div>
          </div>
        )
      case "templates":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Templates</h1>
            <p className="text-muted-foreground mb-8">Browse and use pre-built workflow templates</p>
            <div className="grid grid-cols-3 gap-4">
              {["Email Automation", "Slack Bot", "Data Sync", "CRM Integration", "Social Media", "E-commerce"].map((template) => (
                <div key={template} className="border border-border rounded-lg p-4 hover:border-n8n-primary/50 transition-colors cursor-pointer">
                  <h3 className="font-medium text-foreground mb-2">{template}</h3>
                  <p className="text-sm text-muted-foreground">A template for {template.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "settings":
        return <SettingsScreen />
      case "workflow-editor":
        return <WorkflowEditor />
      default:
        return <OverviewScreen />
    }
  }

  return (
    <AppLayout>
      {renderScreen()}
    </AppLayout>
  )
}
