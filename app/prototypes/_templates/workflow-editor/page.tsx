"use client"

import { useStore } from "@/lib/store"
import { AppLayout } from "@/components/n8n/app-layout"
import { OverviewScreen } from "@/components/n8n/screens/overview"
import { PersonalScreen } from "@/components/n8n/screens/personal"
import { WorkflowEditor } from "@/components/n8n/screens/workflow-editor"
import { SettingsScreen } from "@/components/n8n/screens/settings"

const TEMPLATE_CATEGORIES = [
  "Email Automation",
  "Slack Bot",
  "Data Sync",
  "CRM Integration",
  "Social Media",
  "E-commerce",
] as const

function PlaceholderScreen({
  title,
  subtitle,
  emptyLabel,
  betaBadge = false,
}: {
  title: string
  subtitle: string
  emptyLabel: string
  betaBadge?: boolean
}) {
  return (
    <div className="wrap">
      <div className="title-row">
        <h1>{title}</h1>
        {betaBadge && <span className="beta">beta</span>}
      </div>
      <p className="subtitle">{subtitle}</p>
      <div className="empty">
        <p>{emptyLabel}</p>
      </div>

      <style jsx>{`
        .wrap {
          padding: var(--spacing--xl);
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--2xs);
          margin-bottom: var(--spacing--2xs);
        }
        h1 {
          font-size: var(--font-size--2xl);
          font-weight: var(--font-weight--bold);
          color: var(--color--text--shade-1);
        }
        .beta {
          font-size: var(--font-size--2xs);
          font-weight: var(--font-weight--medium);
          color: var(--color--primary);
          background-color: var(--color--primary--tint-3);
          padding: 2px var(--spacing--2xs);
          border-radius: var(--radius--full);
        }
        .subtitle {
          color: var(--color--text);
          margin-bottom: var(--spacing--xl);
        }
        .empty {
          border: 1px solid var(--border-color--light);
          border-radius: var(--radius--sm);
          padding: var(--spacing--2xl);
          text-align: center;
        }
        .empty p {
          color: var(--color--text);
        }
      `}</style>
    </div>
  )
}

function TemplatesScreen() {
  return (
    <div className="wrap">
      <h1>Templates</h1>
      <p className="subtitle">Browse and use pre-built workflow templates</p>
      <div className="grid">
        {TEMPLATE_CATEGORIES.map((template) => (
          <div key={template} className="card">
            <h3>{template}</h3>
            <p>A template for {template.toLowerCase()}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .wrap {
          padding: var(--spacing--xl);
        }
        h1 {
          font-size: var(--font-size--2xl);
          font-weight: var(--font-weight--bold);
          color: var(--color--text--shade-1);
          margin-bottom: var(--spacing--2xs);
        }
        .subtitle {
          color: var(--color--text);
          margin-bottom: var(--spacing--xl);
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--spacing--sm);
        }
        .card {
          border: 1px solid var(--border-color--light);
          border-radius: var(--radius--sm);
          padding: var(--spacing--sm);
          cursor: pointer;
          transition: border-color var(--duration--snappy) var(--easing--ease-out);
        }
        .card:hover {
          border-color: var(--color--primary);
        }
        .card h3 {
          font-weight: var(--font-weight--medium);
          color: var(--color--text--shade-1);
          margin-bottom: var(--spacing--2xs);
        }
        .card p {
          font-size: var(--font-size--sm);
          color: var(--color--text);
        }
      `}</style>
    </div>
  )
}

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
          <PlaceholderScreen
            title="Shared with you"
            subtitle="Workflows and credentials shared with you"
            emptyLabel="No items shared with you yet"
          />
        )
      case "chat":
        return (
          <PlaceholderScreen
            title="Chat"
            subtitle="Chat with AI to build workflows"
            emptyLabel="Start a new conversation to build workflows with AI"
            betaBadge
          />
        )
      case "templates":
        return <TemplatesScreen />
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
