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
import { WorkflowEditorView } from "./workflow-editor-view";
import { SettingsScreen } from "@/components/n8n/screens/settings";
import { Toaster } from "@/components/shadcn/sonner";
import { ProjectView } from "./project-view";
import { WorkspaceHome } from "./workspace-home";
import { WORKSPACES } from "./workspaces-data";
import { useWorkspaceStore } from "./workspace-store";

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

export function AppLayout() {
    const { currentScreen } = useStore();
    const { currentWorkspaceId } = useWorkspaceStore();
    const [aiAssistantActive, setAiAssistantActive] = useState(true);
    const [agentsView, setAgentsView] = useState<AgentsView>(null);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeProjectChatId, setActiveProjectChatId] = useState<string | null>(null);
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [aiAssistantKey, setAiAssistantKey] = useState(0);
    const [workspaceSettings, setWorkspaceSettings] =
        useState<WorkspaceSettingsState>(null);
    const [workspaceHomeOpen, setWorkspaceHomeOpen] = useState(false);
    const [workspaceHomeTab, setWorkspaceHomeTab] =
        useState<"projects" | "workflows" | "agents">("projects");

    const clearActives = () => {
        setAiAssistantActive(false);
        setAgentsView(null);
        setActiveProjectId(null);
        setActiveProjectChatId(null);
        setNewProjectOpen(false);
        setWorkspaceSettings(null);
        setWorkspaceHomeOpen(false);
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

    /* Default — main sidebar + main area renders the active screen */
    const renderScreen = () => {
        if (newProjectOpen) {
            return (
                <ProjectView
                    key="__new__"
                    projectId="__new__"
                    isNew
                    onBack={() => setNewProjectOpen(false)}
                />
            );
        }
        if (activeProjectId !== null) {
            return (
                <ProjectView
                    key={`${activeProjectId}-${activeProjectChatId ?? "none"}`}
                    projectId={activeProjectId}
                    initialChatId={activeProjectChatId}
                    onBack={() => {
                        setActiveProjectId(null);
                        setActiveProjectChatId(null);
                    }}
                />
            );
        }
        if (workspaceHomeOpen) {
            return (
                <WorkspaceHome
                    key={workspaceHomeTab}
                    initialTab={workspaceHomeTab}
                    onAgentClick={(agentId) => {
                        clearActives();
                        setAgentsView({ type: "chat", agentId });
                    }}
                    onProjectClick={(projectId) => {
                        clearActives();
                        setActiveProjectId(projectId);
                    }}
                    onOpenSettings={() => {
                        const ws =
                            WORKSPACES.find((w) => w.id === currentWorkspaceId) ??
                            WORKSPACES[0];
                        clearActives();
                        setWorkspaceSettings({
                            id: ws.id,
                            name: ws.name,
                            avatar: ws.avatar,
                            bg: ws.bg,
                        });
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
        if (aiAssistantActive)
            return (
                <AIAssistant
                    key={aiAssistantKey}
                    onOpenProjectChat={(projectId, chatId) => {
                        clearActives();
                        setActiveProjectId(projectId);
                        setActiveProjectChatId(chatId);
                    }}
                />
            );
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
                return <WorkflowEditorView />;
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

    const showSidebar = true;

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
                        setWorkspaceHomeOpen(false);
                    }}
                    onOpenWorkspaceSettings={(ws) => {
                        clearActives();
                        setWorkspaceSettings(ws);
                    }}
                    onWorkspaceSelect={(tab) => {
                        clearActives();
                        setWorkspaceHomeTab(tab ?? "projects");
                        setWorkspaceHomeOpen(true);
                    }}
                    activeProjectId={activeProjectId}
                    onProjectClick={(id) => {
                        clearActives();
                        setActiveProjectId(id);
                        setActiveProjectChatId(null);
                    }}
                    onCreateProject={() => {
                        clearActives();
                        setNewProjectOpen(true);
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
