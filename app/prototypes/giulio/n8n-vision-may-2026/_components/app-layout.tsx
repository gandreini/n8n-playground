"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Sidebar, type AgentsView } from "./sidebar";
import { AIAssistant } from "./ai-assistant";
import { NewAgent } from "./new-agent";
import { AgentChatView } from "./agent-chat";
import { AgentSettings } from "./agent-settings";
import { WorkspaceSettings } from "./workspace-settings";
import { OverviewScreen } from "@/components/n8n/screens/overview";
import { PersonalScreen } from "@/components/n8n/screens/personal";
import { WorkflowEditor } from "@/components/n8n/screens/workflow-editor";
import { SettingsScreen } from "@/components/n8n/screens/settings";
import { Toaster } from "@/components/shadcn/sonner";
import { ProjectView } from "./project-view";
import { WorkspaceHome } from "./workspace-home";

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
    );
}

type WorkspaceSettingsState = {
    id: string;
    name: string;
    avatar: string;
    bg: string;
} | null;

type WorkspaceHomeState = {
    id: string;
    name: string;
    agentIds: string[];
} | null;

export function AppLayout() {
    const { currentScreen } = useStore();
    const [aiAssistantActive, setAiAssistantActive] = useState(true);
    const [agentsView, setAgentsView] = useState<AgentsView>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [aiAssistantKey, setAiAssistantKey] = useState(0);
    const [workspaceSettings, setWorkspaceSettings] =
        useState<WorkspaceSettingsState>(null);
    const [workspaceHome, setWorkspaceHome] =
        useState<WorkspaceHomeState>(null);

    const clearActives = () => {
        setAiAssistantActive(false);
        setAgentsView(null);
        setActiveProjectId(null);
        setWorkspaceSettings(null);
        setWorkspaceHome(null);
    };

    /* Agent chat fullscreen — its own sub-sidebar */
    if (agentsView?.type === "chat") {
        return (
            <div className="n8n-app-layout">
                <AgentChatView
                    agentId={agentsView.agentId}
                    onBack={() => setAgentsView(null)}
                    onOpenSettings={(agentId) =>
                        setAgentsView({ type: "settings", agentId })
                    }
                />
                <Toaster position="bottom-right" />
                <style jsx>{`
                    .n8n-app-layout {
                        display: flex;
                        height: 100vh;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        );
    }

    if (activeProjectId !== null) {
        return (
            <div className="n8n-app-layout">
                <ProjectView
                    projectId={activeProjectId}
                    onBack={() => setActiveProjectId(null)}
                />
                <Toaster position="bottom-right" />
                <style jsx>{`
                    .n8n-app-layout {
                        display: flex;
                        height: 100vh;
                        overflow: hidden;
                    }
                `}</style>
            </div>
        );
    }

    /* Default — main sidebar + main area renders the active screen */
    const renderScreen = () => {
        if (workspaceHome) {
            return (
                <WorkspaceHome
                    workspaceName={workspaceHome.name}
                    workspaceAgentIds={workspaceHome.agentIds}
                    onAgentClick={(agentId) => {
                        clearActives();
                        setAgentsView({ type: "chat", agentId });
                    }}
                />
            );
        }
        if (workspaceSettings) {
            return (
                <WorkspaceSettings
                    workspaceId={workspaceSettings.id}
                    workspaceName={workspaceSettings.name}
                    workspaceAvatar={workspaceSettings.avatar}
                    workspaceBg={workspaceSettings.bg}
                    onClose={() => setWorkspaceSettings(null)}
                />
            );
        }
        if (aiAssistantActive) return <AIAssistant key={aiAssistantKey} />;
        if (agentsView?.type === "new") return <NewAgent />;
        if (agentsView?.type === "settings") {
            return (
                <AgentSettings
                    agentId={agentsView.agentId}
                    onCancel={() =>
                        setAgentsView({ type: "chat", agentId: agentsView.agentId })
                    }
                    onSave={() =>
                        setAgentsView({ type: "chat", agentId: agentsView.agentId })
                    }
                />
            );
        }

        switch (currentScreen) {
            case "overview":
                return <OverviewScreen />;
            case "personal":
                return <PersonalScreen />;
            case "workflow-editor":
                return <WorkflowEditor />;
            case "settings":
                return <SettingsScreen />;
            case "shared":
                return <ComingSoon label="Shared with you - Coming soon" />;
            case "chat":
                return <ComingSoon label="Chat (beta) - Coming soon" />;
            default:
                return <OverviewScreen />;
        }
    };

    const showSidebar = currentScreen !== "workflow-editor";

    return (
        <div className="n8n-app-layout">
            {showSidebar && (
                <Sidebar
                    aiAssistantActive={aiAssistantActive}
                    onAiAssistantClick={() => {
                        clearActives();
                        setAiAssistantActive(true);
                        setAiAssistantKey((k) => k + 1);
                    }}
                    agentsView={agentsView}
                    onNewAgentClick={() => {
                        clearActives();
                        setAgentsView({ type: "new" });
                    }}
                    onAgentClick={(agentId) => {
                        clearActives();
                        setAgentsView({ type: "chat", agentId });
                    }}
                    onScreenChange={() => {
                        setAiAssistantActive(false);
                        setAgentsView(null);
                        setActiveProjectId(null);
                        setWorkspaceSettings(null);
                        setWorkspaceHome(null);
                    }}
                    onOpenWorkspaceSettings={(ws) => {
                        clearActives();
                        setWorkspaceSettings(ws);
                    }}
                    onWorkspaceSelect={(ws) => {
                        clearActives();
                        setWorkspaceHome(ws);
                    }}
                    workspaceHomeId={workspaceHome?.id ?? null}
                    activeProjectId={activeProjectId}
                    onProjectClick={(id) => {
                        clearActives();
                        setActiveProjectId(id);
                    }}
                />
            )}
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
    );
}
