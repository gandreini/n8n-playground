"use client";

import { useState } from "react";
import {
    Layers,
    MoreHorizontal,
    Check,
    Loader2,
    ChevronRight,
    Copy,
    RefreshCw,
    File,
    Link2,
    Database,
    Workflow,
    Bot,
    ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
    PROJECTS,
    type ConversationMessage,
    type KnowledgeItem,
    type Project,
    type Resource,
} from "./projects-data";
import { Composer } from "./composer";
import {
    ResourceSidebar,
    ResourceItem,
    type ResourceSection,
} from "./resource-sidebar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn/dialog";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";

interface ProjectViewProps {
    projectId: string;
    onBack: () => void;
    initialChatId?: string | null;
    isNew?: boolean;
}

const NEW_PROJECT: Project = {
    id: "__new__",
    name: "New project",
    description:
        "Describe what you're building. Add chats, workflows and docs as you go.",
    resources: [],
    documents: [],
    knowledge: [],
    chats: [],
};

export function ProjectView({
    projectId,
    onBack,
    initialChatId = null,
    isNew = false,
}: ProjectViewProps) {
    const project: Project = isNew
        ? NEW_PROJECT
        : PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];

    const firstThreadChatId = isNew
        ? null
        : project.chats.find((c) => c.thread)?.id ?? null;
    const [selectedChatId] = useState<string | null>(
        initialChatId ?? firstThreadChatId,
    );
    const [composerValue, setComposerValue] = useState("");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const openWorkflow = useStore((s) => s.openWorkflow);

    const sidebarSections: ResourceSection[] = [
        {
            key: "artifacts",
            label: "Artifacts",
            onAdd: () => console.debug("project: add artifact"),
            items: project.resources.map((r) => (
                <ResourceItem
                    key={r.id}
                    icon={resourceIcon(r)}
                    name={r.name}
                    onClick={() =>
                        r.type === "workflow"
                            ? openWorkflow(r.name)
                            : console.debug("open resource", r)
                    }
                />
            )),
        },
        {
            key: "tasks",
            label: "Tasks",
            onAdd: () => console.debug("project: add task"),
            items: [],
        },
        {
            key: "documents",
            label: "Documents",
            onAdd: () => console.debug("project: add document"),
            items: project.documents.map((d) => (
                <ResourceItem
                    key={d.id}
                    icon={<File />}
                    name={d.name}
                    onClick={() => console.debug("open document", d)}
                />
            )),
        },
        {
            key: "knowledge",
            label: "Knowledge",
            onAdd: () => console.debug("project: add knowledge"),
            items: project.knowledge.map((k) => (
                <ResourceItem
                    key={k.id}
                    icon={knowledgeIcon(k)}
                    name={k.name}
                    onClick={() => console.debug("open knowledge", k)}
                />
            )),
        },
    ];

    const sidebarFooter = (
        <button
            type="button"
            className="settings-row"
            onClick={() => setSettingsOpen(true)}
        >
            <span className="settings-label">Settings</span>
            <span className="settings-chevron">
                <ChevronDown />
            </span>
            <style jsx>{`
                .settings-row {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    min-height: 32px;
                    padding: 4px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .settings-row:hover {
                    background-color: var(--color--neutral-100);
                }
                .settings-label {
                    flex: 1;
                    text-align: left;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--color--neutral-800);
                }
                .settings-chevron {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    color: var(--color--neutral-500);
                }
                .settings-chevron :global(svg) {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </button>
    );

    const selectedChat = project.chats.find((c) => c.id === selectedChatId) ?? null;

    return (
        <div className="project-view">
            <div className="main">
                <div className="top-bar">
                    <span className="top-project">
                        <span className="top-project-icon">
                            <Layers />
                        </span>
                        <span className="top-project-name">{project.name}</span>
                    </span>
                    {selectedChat && (
                        <>
                            <span className="top-sep">/</span>
                            <span className="top-chat">{selectedChat.title}</span>
                        </>
                    )}
                </div>

                <div className="content">
                    {selectedChat?.thread ? (
                        <ConversationThread messages={selectedChat.thread} />
                    ) : (
                        <div className="empty-state">
                            <h1 className="project-name-large">
                                {selectedChat ? selectedChat.title : project.name}
                            </h1>
                            {!selectedChat && (
                                <p className="project-description">{project.description}</p>
                            )}
                            <Composer
                                placeholder="Send a message..."
                                leftButton="paperclip"
                                showAgentSelect={false}
                                value={composerValue}
                                onChange={setComposerValue}
                            />
                        </div>
                    )}

                    {selectedChat?.thread && (
                        <div className="composer-pin">
                            <Composer
                                placeholder="Send a message..."
                                leftButton="paperclip"
                                showAgentSelect={false}
                                value={composerValue}
                                onChange={setComposerValue}
                            />
                        </div>
                    )}
                </div>
            </div>

            <ResourceSidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
                onMoreClick={() => console.debug("project: more")}
                sections={sidebarSections}
                footer={sidebarFooter}
            />

            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Project settings</DialogTitle>
                        <DialogDescription>
                            These changes are not persisted in this prototype.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="settings-fields">
                        <div className="field">
                            <Label htmlFor="project-name">Project name</Label>
                            <Input id="project-name" defaultValue={project.name} />
                        </div>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => console.debug("archive project", project.id)}
                        >
                            Archive project
                        </Button>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSettingsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style jsx>{`
                .project-view {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }

                /* MAIN */
                .main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .top-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    height: 48px;
                    padding: 0 var(--spacing--sm);
                    flex-shrink: 0;
                }
                .top-project {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                }
                .top-project-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 4px;
                    background-color: var(--color--blue-50);
                    color: var(--color--blue-600);
                    flex-shrink: 0;
                }
                .top-project-icon :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .top-project-name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .top-sep {
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--sm);
                }
                .top-chat {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-700);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    min-width: 0;
                }

                .content {
                    position: relative;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .empty-state {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing--sm);
                    padding: var(--spacing--xl);
                    max-width: 720px;
                    margin: 0 auto;
                    width: 100%;
                }
                .project-name-large {
                    font-size: 22px;
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
                    margin: 0;
                }
                .project-description {
                    color: var(--color--neutral-500);
                    font-size: var(--font-size--sm);
                    text-align: center;
                    margin: 0 0 var(--spacing--xs);
                    max-width: 480px;
                }
                .composer-pin {
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;
                    padding: var(--spacing--md) var(--spacing--xl);
                    border-top: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(--color--background-base);
                }

                .settings-fields {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                    padding: var(--spacing--xs) 0;
                }
                .field {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }

            `}</style>
        </div>
    );
}

interface ConversationThreadProps {
    messages: ConversationMessage[];
}

function ConversationThread({ messages }: ConversationThreadProps) {
    return (
        <div className="thread n8n-scrollbar">
            <div className="thread-inner">
                {messages.map((msg, idx) =>
                    msg.role === "user" ? (
                        <div className="user-msg" key={idx}>
                            {msg.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    ) : (
                        <div className="assistant-msg" key={idx}>
                            {msg.paragraphs.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}

                            {msg.steps && (
                                <div className="steps">
                                    {msg.steps.map((step, i) => (
                                        <div
                                            className={`step ${step.status}`}
                                            key={i}
                                        >
                                            {step.status === "done" ? (
                                                <Check />
                                            ) : (
                                                <Loader2 className="spin" />
                                            )}
                                            <span>{step.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {msg.agentCard && (
                                <button className="agent-card">
                                    <span className="agent-card-icon">
                                        {msg.agentCard.icon}
                                    </span>
                                    <span className="agent-card-info">
                                        <span className="agent-card-name">
                                            {msg.agentCard.name}
                                        </span>
                                        <span className="agent-card-meta">
                                            {msg.agentCard.meta}
                                        </span>
                                    </span>
                                    <ChevronRight />
                                </button>
                            )}

                            <div className="msg-actions">
                                <button>
                                    <Copy />
                                </button>
                                <button>
                                    <RefreshCw />
                                </button>
                                <button>
                                    <MoreHorizontal />
                                </button>
                            </div>
                        </div>
                    ),
                )}
            </div>

            <style jsx>{`
                .thread {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--spacing--lg) var(--spacing--xl);
                }
                .thread-inner {
                    max-width: 720px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                }
                .user-msg {
                    align-self: flex-end;
                    max-width: 80%;
                    padding: var(--spacing--xs) var(--spacing--sm);
                    background-color: var(--color--neutral-100);
                    border-radius: var(--radius--md);
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 20px;
                }
                .user-msg p {
                    margin: 0;
                }
                .assistant-msg {
                    align-self: flex-start;
                    max-width: 80%;
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 22px;
                }
                .assistant-msg p {
                    margin: 0;
                }
                .steps {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: var(--spacing--xs) 0;
                }
                .step {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    font-size: 14px;
                    color: var(--color--neutral-700);
                }
                .step :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .step.done :global(svg) {
                    color: var(--color--neutral-700);
                }
                .step.pending :global(svg.spin) {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .agent-card {
                    width: 100%;
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    gap: var(--spacing--xs);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    margin-top: var(--spacing--sm);
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background: white;
                    border-radius: var(--radius--md);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .agent-card:hover {
                    background-color: var(--color--neutral-50);
                }
                .agent-card-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius--3xs);
                    background-color: var(--color--neutral-100);
                    font-size: 16px;
                }
                .agent-card-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .agent-card-name {
                    font-size: var(--font-size--sm);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .agent-card-meta {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-500);
                }
                .agent-card :global(svg) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-400);
                }

                .msg-actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    margin-top: var(--spacing--xs);
                }
                .msg-actions button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .msg-actions button:hover {
                    background-color: var(--color--neutral-100);
                }
                .msg-actions :global(svg) {
                    width: 14px;
                    height: 14px;
                }
            `}</style>
        </div>
    );
}

function resourceIcon(resource: Resource) {
    return resource.type === "agent" ? <Bot /> : <Workflow />;
}

function knowledgeIcon(item: KnowledgeItem) {
    if (item.kind === "link") return <Link2 />;
    if (item.kind === "integration") return <Database />;
    return <File />;
}
