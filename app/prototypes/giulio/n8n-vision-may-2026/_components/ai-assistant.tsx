"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Plus,
    ChevronDown,
    ArrowRight,
    Search,
    X,
    Table,
    CheckCircle2,
    LoaderCircle,
    Circle,
    Workflow,
    Bot,
    Lightbulb,
    Zap,
    Layers,
    Filter,
} from "lucide-react";
import { N8nButton } from "@/components/n8n/shared/button";
import { useStore } from "@/lib/store";
import { Composer } from "./composer";
import {
    ResourceSidebar,
    ResourceItem,
    TaskItem,
    type ResourceSection,
} from "./resource-sidebar";
import {
    ArtifactViewer,
    type SelectedArtifact,
} from "./artifact-viewer";
import {
    CONVERSATIONS,
    CHAT_GROUP_LABELS as GROUP_LABELS,
    CHAT_GROUP_ORDER,
    formatConversationDate,
    type ChatGroup,
    type Conversation,
} from "./conversations-data";

const CHATS = CONVERSATIONS;

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    error?: boolean;
}

function makeId(prefix: string) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface AIAssistantProps {
    onBack?: () => void;
    showSubSidebar?: boolean;
    onOpenProjectChat?: (projectId: string, chatId: string) => void;
}

export function AIAssistant({
    onBack,
    showSubSidebar = false,
    onOpenProjectChat,
}: AIAssistantProps) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>(() => makeId("s"));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // Sidebar starts collapsed for new chats; we expand it once a chat is loaded.
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyView, setHistoryView] = useState(false);
    const [historySearch, setHistorySearch] = useState("");
    const [selectedArtifact, setSelectedArtifact] =
        useState<SelectedArtifact | null>(null);
    const [artifactWidth, setArtifactWidth] = useState(720);
    const [sidebarWidth, setSidebarWidth] = useState(272);
    // Defer time-of-day greeting until after mount to avoid SSR/client mismatch.
    const [greeting, setGreeting] = useState("Hi, Giulio");
    const threadEndRef = useRef<HTMLDivElement>(null);
    const openWorkflow = useStore((s) => s.openWorkflow);

    useEffect(() => {
        const hour = new Date().getHours();
        const pool =
            hour >= 5 && hour < 12
                ? [
                      "Morning, Giulio ☕",
                      "Buongiorno, Giulio 👋",
                      "Rise and automate, Giulio",
                      "Coffee's brewing — hi Giulio",
                      "Up and at 'em, Giulio",
                  ]
                : hour < 18
                ? [
                      "Hey Giulio, how's the day going?",
                      "Afternoon, Giulio 🌤️",
                      "Mid-day, Giulio. Let's ship something",
                      "Surviving the afternoon, Giulio?",
                      "Hey Giulio — past the lunch coma?",
                  ]
                : hour < 23
                ? [
                      "Evening, Giulio 🌙",
                      "Buonasera, Giulio",
                      "Still here, Giulio? Let's wrap something up",
                      "Hey Giulio. One more workflow before dinner?",
                      "Winding down, Giulio?",
                  ]
                : [
                      "Burning the midnight oil, Giulio?",
                      "Still up, Giulio? The bots are.",
                      "3 a.m. workflows, Giulio? 🦉",
                      "Late night hacking, Giulio?",
                      "Hey night owl, Giulio",
                  ];
        setGreeting(pool[Math.floor(Math.random() * pool.length)]);
    }, []);

    const selectedChat = CHATS.find((c) => c.id === selectedChatId);
    const headerTitle = historyView
        ? "All conversations"
        : selectedChat?.title ?? "New conversation";

    const groupedChats: Record<ChatGroup, Conversation[]> = {
        today: CHATS.filter((c) => c.group === "today"),
        yesterday: CHATS.filter((c) => c.group === "yesterday"),
        thisWeek: CHATS.filter((c) => c.group === "thisWeek"),
        older: CHATS.filter((c) => c.group === "older"),
    };

    const groupOrder = CHAT_GROUP_ORDER;

    useEffect(() => {
        threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isLoading]);

    const handleSelectChat = (chat: Conversation) => {
        if (chat.projectId && chat.projectChatId && onOpenProjectChat) {
            onOpenProjectChat(chat.projectId, chat.projectChatId);
            return;
        }
        startFreshChat(chat.id);
    };

    const startFreshChat = (chatId: string | null) => {
        setSelectedChatId(chatId);
        const chat = chatId ? CHATS.find((c) => c.id === chatId) : null;
        setMessages(
            chat
                ? chat.messages.map((m) => ({
                      id: m.id,
                      role: m.role,
                      content: m.content,
                  }))
                : []
        );
        setInput("");
        setIsLoading(false);
        setSessionId(makeId("s"));
        setHistoryOpen(false);
        setHistoryView(false);
        // Auto-expand sidebar when an existing chat is opened; collapse for new chat.
        setRightPanelOpen(Boolean(chat && chat.messages.length > 0));
        setSelectedArtifact(null);
    };

    const handleSend = async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = {
            id: makeId("u"),
            role: "user",
            content: trimmed,
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/agent-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: trimmed }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    typeof data?.error === "string"
                        ? data.error
                        : `Request failed (${res.status})`
                );
            }

            const reply =
                typeof data?.reply === "string" && data.reply.length > 0
                    ? data.reply
                    : "(no response)";

            setMessages((prev) => [
                ...prev,
                { id: makeId("a"), role: "assistant", content: reply },
            ]);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    id: makeId("e"),
                    role: "assistant",
                    content: e instanceof Error ? e.message : "Something went wrong.",
                    error: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const isEmpty = messages.length === 0;

    // The right-side ResourceSidebar contents. New chats stay empty until the
    // user actually does something; saved chats show demo artifacts/tasks.
    const showDemoSidebarData = Boolean(selectedChat);
    const tasks = showDemoSidebarData
        ? ([
              { label: "Check existing credentials for…", status: "done" as const },
              { label: "Check existing credentials for…", status: "done" as const },
              { label: "Text the workflow execution", status: "active" as const },
              { label: "Provide access URLs and usa…", status: "todo" as const },
          ])
        : [];
    const tasksDone = tasks.filter((t) => t.status === "done").length;
    const sidebarSections: ResourceSection[] = [
        {
            key: "artifacts",
            label: "Artifacts",
            onAdd: () => console.debug("ai-assistant: add artifact"),
            items: showDemoSidebarData
                ? [
                      <ResourceItem
                          key="wf-scraper"
                          icon={<Workflow />}
                          name="Record store scraper"
                          onClick={() =>
                              setSelectedArtifact({
                                  type: "workflow",
                                  name: "Record store scraper",
                              })
                          }
                      />,
                      <ResourceItem
                          key="agent-darwin"
                          icon={<Bot />}
                          name="Darwin"
                          onClick={() => console.debug("open agent: Darwin")}
                      />,
                      <ResourceItem
                          key="agent-analyst"
                          icon={<Bot />}
                          name="Data Analyst"
                          onClick={() => console.debug("open agent: Data Analyst")}
                      />,
                      <ResourceItem
                          key="table-hardwax"
                          icon={<Table />}
                          name="hardwax_vinyl_releases"
                          onClick={() => console.debug("open table: hardwax_vinyl_releases")}
                      />,
                  ]
                : [],
        },
        {
            key: "tasks",
            label: "Tasks",
            accessory:
                tasks.length > 0 ? `${tasksDone}/${tasks.length}` : undefined,
            onAdd: () => console.debug("ai-assistant: add task"),
            items: tasks.map((t, i) => (
                <TaskItem
                    key={i}
                    label={t.label}
                    status={t.status}
                    icon={
                        t.status === "done" ? (
                            <CheckCircle2 />
                        ) : t.status === "active" ? (
                            <LoaderCircle className="spin" />
                        ) : (
                            <Circle />
                        )
                    }
                />
            )),
        },
    ];

    return (
        <div className="ai-assistant">
            {showSubSidebar && (
                <aside className="sub-sidebar">
                    <div className="back-row">
                        <button className="back-btn" onClick={onBack}>
                            <ArrowLeft />
                            <span>Back</span>
                        </button>
                    </div>

                    <div className="new-chat-wrap">
                        <button
                            className="new-chat-btn"
                            onClick={() => startFreshChat(null)}
                        >
                            <span className="new-chat-icon">
                                <Plus />
                            </span>
                            <span>New chat</span>
                        </button>
                    </div>

                    <div className="chat-list n8n-scrollbar">
                        {groupOrder.map((group) => {
                            const chats = groupedChats[group];
                            if (!chats.length) return null;
                            return (
                                <div key={group} className="chat-group">
                                    <div className="group-label">{GROUP_LABELS[group]}</div>
                                    {chats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            className="chat-item"
                                            data-active={
                                                chat.id === selectedChatId ? "true" : undefined
                                            }
                                            onClick={() => handleSelectChat(chat)}
                                        >
                                            {chat.projectName && (
                                                <span
                                                    className="project-tag"
                                                    title={`In project: ${chat.projectName}`}
                                                >
                                                    <Layers />
                                                    <span>{chat.projectName}</span>
                                                </span>
                                            )}
                                            <span className="chat-title">{chat.title}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </aside>
            )}

            <div className="rest-of-app">
                <div className="top-bar">
                    <div className="top-bar-left">
                        <div className="title-trigger-wrap">
                            <button
                                className="title-trigger"
                                aria-label="Conversation menu"
                                aria-expanded={historyOpen}
                                onClick={() => setHistoryOpen((o) => !o)}
                            >
                                <span className="header-title">{headerTitle}</span>
                                <ChevronDown />
                            </button>

                            {historyOpen && (
                                <>
                                    <div
                                        className="dropdown-backdrop"
                                        onClick={() => setHistoryOpen(false)}
                                    />
                                    <div className="history-dropdown">
                                        <div className="dd-scroll">
                                            <button
                                                className="dd-new-chat"
                                                onClick={() => {
                                                    startFreshChat(null);
                                                    setHistoryOpen(false);
                                                }}
                                            >
                                                <Plus />
                                                <span>New conversation</span>
                                            </button>
                                            <div className="dd-divider" />
                                            <div className="dd-label">Recents</div>
                                            <div className="dd-list">
                                                {CHATS.slice(0, 10).map((chat) => (
                                                    <button
                                                        key={chat.id}
                                                        className="dd-item"
                                                        data-active={
                                                            chat.id === selectedChatId
                                                                ? "true"
                                                                : undefined
                                                        }
                                                        onClick={() => {
                                                            handleSelectChat(chat);
                                                            setHistoryOpen(false);
                                                        }}
                                                    >
                                                        {chat.projectName && (
                                                            <span className="project-tag">
                                                                <Layers />
                                                                <span>{chat.projectName}</span>
                                                            </span>
                                                        )}
                                                        <span className="dd-item-title">{chat.title}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="dd-footer">
                                            <button
                                                className="dd-view-all"
                                                onClick={() => {
                                                    setHistoryView(true);
                                                    setHistoryOpen(false);
                                                }}
                                            >
                                                <span>All conversations</span>
                                                <ArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="main">
                {historyView ? (
                    <div className="history-page">
                        <div className="history-page-header">
                            <h1 className="history-title">All conversations</h1>
                            <button
                                className="icon-btn"
                                aria-label="Close history"
                                onClick={() => setHistoryView(false)}
                            >
                                <X />
                            </button>
                        </div>

                        <div className="history-toolbar">
                            <div className="history-search">
                                <Search />
                                <input
                                    type="text"
                                    placeholder="Search conversations…"
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                />
                            </div>
                            <N8nButton
                                variant="subtle"
                                size="medium"
                                iconOnly
                                aria-label="Filter conversations"
                                icon={<Filter style={{ width: 16, height: 16 }} />}
                            />
                            <button
                                className="history-new-btn"
                                onClick={() => {
                                    startFreshChat(null);
                                    setHistoryView(false);
                                }}
                            >
                                <Plus />
                                <span>New conversation</span>
                            </button>
                        </div>

                        <div className="history-list n8n-scrollbar">
                            {groupOrder.map((group) => {
                                const filtered = groupedChats[group].filter((c) =>
                                    c.title
                                        .toLowerCase()
                                        .includes(historySearch.toLowerCase())
                                );
                                if (!filtered.length) return null;
                                return (
                                    <div key={group} className="history-group">
                                        <div className="history-group-label">
                                            {GROUP_LABELS[group]}
                                        </div>
                                        {filtered.map((chat) => (
                                            <button
                                                key={chat.id}
                                                className="history-item"
                                                onClick={() => {
                                                    handleSelectChat(chat);
                                                    setHistoryView(false);
                                                }}
                                            >
                                                {chat.projectName && (
                                                    <span className="project-tag">
                                                        <Layers />
                                                        <span>{chat.projectName}</span>
                                                    </span>
                                                )}
                                                <span className="history-item-title">{chat.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                <div className="content" data-mode={isEmpty ? "empty" : "conversation"}>
                    {isEmpty ? (
                        <div className="empty-stack">
                            <div className="hero">
                                <h1 className="title">{greeting}</h1>
                                <p className="subtitle">
                                    Your instance is healthy — 2,259 runs this week, 1.3% failure rate, 38h saved.
                                </p>
                            </div>

                            <Composer
                                placeholder="Ask anything..."
                                leftButton="plus"
                                showAgentSelect
                                value={input}
                                onChange={setInput}
                                onSend={handleSend}
                            />

                            <div className="shortcut-pills">
                                <button className="pill" type="button">
                                    <Workflow />
                                    <span>Build a workflow</span>
                                </button>
                                <button className="pill" type="button">
                                    <Bot />
                                    <span>Build an agent</span>
                                </button>
                                <button className="pill" type="button">
                                    <Lightbulb />
                                    <span>Find inspiration</span>
                                </button>
                                <button className="pill" type="button">
                                    <Zap />
                                    <span>Quick examples</span>
                                    <ChevronDown />
                                </button>
                            </div>

                            <div className="recents">
                                <div className="recents-header">
                                    <span className="recents-label">Recent conversations</span>
                                </div>
                                <div className="recents-list">
                                    {CHATS.slice(0, 8).map((chat) => (
                                        <button
                                            key={chat.id}
                                            className="recent-item"
                                            type="button"
                                            onClick={() => handleSelectChat(chat)}
                                        >
                                            {chat.projectName && (
                                                <span className="project-tag">
                                                    <Layers />
                                                    <span>{chat.projectName}</span>
                                                </span>
                                            )}
                                            <span className="recent-title">{chat.title}</span>
                                            <span className="recent-date">
                                                {formatConversationDate(chat.updatedAt)}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    className="recents-view-all"
                                    type="button"
                                    onClick={() => setHistoryView(true)}
                                >
                                    <span>See all conversations</span>
                                    <ArrowRight />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="thread n8n-scrollbar">
                                <div className="thread-inner">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className="message"
                                            data-role={m.role}
                                            data-error={m.error ? "true" : undefined}
                                        >
                                            <div className="message-content">{m.content}</div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="message" data-role="assistant">
                                            <div className="typing" aria-label="Assistant is typing">
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={threadEndRef} />
                                </div>
                            </div>
                            <div className="composer-wrap">
                                <Composer
                                    placeholder="Reply…"
                                    leftButton="plus"
                                    showAgentSelect
                                    value={input}
                                    onChange={setInput}
                                    onSend={handleSend}
                                />
                            </div>
                        </>
                    )}
                </div>
                )}
                </div>
            </div>

            {selectedArtifact && (
                <>
                    <Resizer
                        onResize={(delta) =>
                            setArtifactWidth((w) =>
                                clamp(w - delta, 360, 1200)
                            )
                        }
                        ariaLabel="Resize workflow panel"
                    />
                    <ArtifactViewer
                        artifact={selectedArtifact}
                        onClose={() => setSelectedArtifact(null)}
                        onOpenFull={
                            selectedArtifact.type === "workflow"
                                ? () => openWorkflow(selectedArtifact.name)
                                : undefined
                        }
                        width={artifactWidth}
                    />
                </>
            )}

            {rightPanelOpen && (
                <Resizer
                    onResize={(delta) =>
                        setSidebarWidth((w) => clamp(w - delta, 220, 480))
                    }
                    ariaLabel="Resize sidebar"
                />
            )}
            <ResourceSidebar
                collapsed={!rightPanelOpen}
                onToggleCollapse={() => setRightPanelOpen((open) => !open)}
                onMoreClick={() => console.debug("ai-assistant: more")}
                sections={sidebarSections}
                width={rightPanelOpen ? sidebarWidth : undefined}
            />

            <style jsx>{`
                .ai-assistant {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }

                /* SUB-SIDEBAR */
                .sub-sidebar {
                    width: 240px;
                    flex-shrink: 0;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(
                        --menu--color--background,
                        var(--color--neutral-50)
                    );
                }
                .back-row {
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                }
                .back-btn {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--4xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .back-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .back-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                .new-chat-wrap {
                    padding: var(--spacing--3xs) var(--spacing--2xs)
                        var(--spacing--2xs);
                }
                .new-chat-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .new-chat-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .new-chat-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: var(--radius--full);
                    background-color: var(--color--primary);
                    color: white;
                }
                .new-chat-icon :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                .chat-list {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding-bottom: var(--spacing--md);
                }
                .chat-group {
                    padding: 0 var(--spacing--3xs);
                    margin-top: var(--spacing--xs);
                }
                .group-label {
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .chat-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .chat-item:hover {
                    background-color: var(--color--neutral-100);
                }
                .chat-item[data-active="true"] {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-800);
                    font-weight: var(--font-weight--medium);
                }
                .chat-item .project-tag {
                    flex-shrink: 0;
                }
                .chat-title {
                    flex: 1;
                    min-width: 0;
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: var(--font-line-height--loose);
                }

                /* PROJECT TAG (shared) */
                .project-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    max-width: 100%;
                    padding: 2px 10px;
                    background-color: var(--color--blue-50);
                    color: var(--color--blue-600);
                    border-radius: var(--radius--full);
                    font-size: var(--font-size--2xs);
                    font-weight: var(--font-weight--medium);
                    line-height: 1.5;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .project-tag :global(svg) {
                    width: 12px;
                    height: 12px;
                    flex-shrink: 0;
                    color: currentColor;
                }
                .project-tag span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* MAIN AREA */
                .rest-of-app {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .main {
                    flex: 1;
                    min-height: 0;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                }
                .top-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    flex-shrink: 0;
                }
                .top-bar-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                }
                .title-trigger {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    height: 30px;
                    padding: 0 var(--spacing--2xs);
                    margin-left: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .title-trigger:hover {
                    background-color: var(--color--neutral-100);
                }
                .title-trigger :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .header-title {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                }
                .icon-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 28px;
                    height: 28px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .icon-btn:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .icon-btn[data-active="true"] {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-800);
                }
                .icon-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }

                .content {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                    flex-direction: column;
                }
                .content[data-mode="empty"] {
                    align-items: center;
                    overflow-y: auto;
                    padding: 8vh var(--spacing--xl) var(--spacing--xl);
                }
                .empty-stack {
                    width: 100%;
                    max-width: 680px;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    gap: var(--spacing--md);
                }
                .empty-stack .title {
                    text-align: center;
                }
                .title {
                    font-size: var(--font-size--xl);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .hero {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing--4xs);
                }
                .subtitle {
                    font-size: var(--font-size--sm);
                    color: var(--color--neutral-500);
                    text-align: center;
                    margin: 0;
                    line-height: 1.45;
                }

                /* SHORTCUT PILLS */
                .shortcut-pills {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: var(--spacing--3xs);
                    margin-top: var(--spacing--3xs);
                }
                .pill {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    height: 32px;
                    padding: 0 var(--spacing--xs);
                    border: 1px solid var(--color--black-alpha-200);
                    background-color: var(--color--neutral-white);
                    border-radius: var(--radius--full);
                    color: var(--color--neutral-700);
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        border-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .pill:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--black-alpha-300, var(--color--neutral-300));
                }
                .pill :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }

                /* RECENTS */
                .recents {
                    margin-top: var(--spacing--lg);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }
                .recents-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 var(--spacing--2xs);
                }
                .recents-label {
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .recents-list {
                    display: flex;
                    flex-direction: column;
                }
                .recent-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .recent-item:hover {
                    background-color: var(--color--neutral-100);
                }
                .recent-title {
                    flex: 1;
                    min-width: 0;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .recent-item .project-tag {
                    flex-shrink: 0;
                }
                .recent-date {
                    flex-shrink: 0;
                    font-size: var(--font-size--3xs);
                    color: var(--color--neutral-400);
                }
                .recents-view-all {
                    align-self: center;
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    margin-top: var(--spacing--2xs);
                    padding: var(--spacing--3xs) var(--spacing--xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    font-size: var(--font-size--xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        color var(--duration--snappy) var(--easing--ease-out);
                }
                .recents-view-all:hover {
                    background-color: var(--color--neutral-100);
                    color: var(--color--neutral-700);
                }
                .recents-view-all :global(svg) {
                    width: 14px;
                    height: 14px;
                }

                /* CONVERSATION THREAD */
                .thread {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: var(--spacing--lg) 0;
                }
                .thread-inner {
                    max-width: 560px;
                    margin: 0 auto;
                    padding: 0 var(--spacing--md);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                }
                .message {
                    display: flex;
                }
                .message[data-role="user"] {
                    justify-content: flex-end;
                }
                .message[data-role="assistant"] {
                    justify-content: flex-start;
                }
                .message-content {
                    max-width: 80%;
                    font-size: var(--font-size--xs);
                    line-height: 1.55;
                    color: var(--color--neutral-800);
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .message[data-role="user"] .message-content {
                    background-color: var(--color--neutral-100);
                    padding: var(--spacing--3xs) var(--spacing--xs);
                    border-radius: 14px;
                }
                .message[data-error="true"] .message-content {
                    color: var(--color--danger, #c0392b);
                }
                .typing {
                    display: inline-flex;
                    gap: 4px;
                    align-items: center;
                    padding: 6px 0;
                }
                .typing span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--color--neutral-400);
                    animation: typing-bounce 1s infinite ease-in-out;
                }
                .typing span:nth-child(2) {
                    animation-delay: 0.15s;
                }
                .typing span:nth-child(3) {
                    animation-delay: 0.3s;
                }
                @keyframes typing-bounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-4px);
                        opacity: 1;
                    }
                }
                .composer-wrap {
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;
                    padding: var(--spacing--md);
                }

                :global(svg.spin) {
                    animation: ai-assistant-spin 1.4s linear infinite;
                }
                @keyframes ai-assistant-spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* HISTORY DROPDOWN */
                .title-trigger-wrap {
                    position: relative;
                }
                .dropdown-backdrop {
                    position: fixed;
                    inset: 0;
                    z-index: 5;
                }
                .history-dropdown {
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    width: 360px;
                    max-height: 460px;
                    background-color: white;
                    border: 1px solid var(--color--black-alpha-200);
                    border-radius: var(--radius--3xs);
                    box-shadow: 0 10px 24px 0
                        color-mix(
                            in srgb,
                            var(--color--foreground--shade-2) 12%,
                            transparent
                        );
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .dd-scroll {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: var(--spacing--3xs);
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .dd-footer {
                    flex-shrink: 0;
                    padding: var(--spacing--3xs);
                    border-top: 1px solid var(--color--neutral-150);
                    background-color: white;
                }
                .dd-new-chat {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    color: var(--color--neutral-800);
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .dd-new-chat:hover {
                    background-color: var(--color--neutral-100);
                }
                .dd-new-chat :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }
                .dd-divider {
                    height: 1px;
                    background-color: var(--color--neutral-150);
                    margin: var(--spacing--3xs) 0;
                }
                .dd-label {
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .dd-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .dd-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    color: var(--color--neutral-700);
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .dd-item .project-tag {
                    flex-shrink: 0;
                }
                .dd-item-title {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .dd-item:hover {
                    background-color: var(--color--neutral-100);
                }
                .dd-item[data-active="true"] {
                    background-color: var(--color--neutral-100);
                }
                .dd-view-all {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    color: var(--color--neutral-700);
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .dd-view-all:hover {
                    background-color: var(--color--neutral-100);
                }
                .dd-view-all :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }

                /* HISTORY PAGE */
                .history-page {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    padding: var(--spacing--xl);
                    max-width: 880px;
                    width: 100%;
                    margin: 0 auto;
                    overflow: hidden;
                }
                .history-page-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: var(--spacing--md);
                }
                .history-title {
                    font-size: var(--font-size--xl);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .history-toolbar {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--xs);
                    margin-bottom: var(--spacing--md);
                }
                .history-search {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: 0 var(--spacing--xs);
                    height: 36px;
                    background-color: white;
                    border: 1px solid var(--color--black-alpha-200);
                    border-radius: var(--radius--3xs);
                }
                .history-search:focus-within {
                    border-color: var(--color--secondary);
                }
                .history-search :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-400);
                }
                .history-search input {
                    flex: 1;
                    border: 0;
                    outline: none;
                    background: transparent;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                }
                .history-search input::placeholder {
                    color: var(--color--neutral-400);
                }
                .history-new-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    height: 36px;
                    padding: 0 var(--spacing--md);
                    border: 0;
                    background-color: var(--color--primary);
                    color: white;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: opacity var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .history-new-btn:hover {
                    opacity: 0.9;
                }
                .history-new-btn :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .history-list {
                    flex: 1;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                }
                .history-group {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .history-group-label {
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    margin-bottom: var(--spacing--3xs);
                }
                .history-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--xs) var(--spacing--sm);
                    border: 1px solid transparent;
                    background: white;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    color: var(--color--neutral-800);
                    font-size: var(--font-size--sm);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out),
                        border-color var(--duration--snappy) var(--easing--ease-out);
                }
                .history-item-title {
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .history-item .project-tag {
                    flex-shrink: 0;
                }
                .history-item:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--black-alpha-200);
                }
            `}</style>
        </div>
    );
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

interface ResizerProps {
    onResize: (deltaX: number) => void;
    ariaLabel: string;
}

function Resizer({ onResize, ariaLabel }: ResizerProps) {
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startX = e.clientX;
        let lastX = startX;
        const onMove = (ev: PointerEvent) => {
            const delta = ev.clientX - lastX;
            lastX = ev.clientX;
            if (delta !== 0) onResize(delta);
        };
        const onUp = () => {
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
    };
    return (
        <div
            role="separator"
            aria-orientation="vertical"
            aria-label={ariaLabel}
            className="ai-resizer"
            onPointerDown={handlePointerDown}
        >
            <style jsx>{`
                .ai-resizer {
                    flex-shrink: 0;
                    width: 6px;
                    margin: 0 -3px;
                    cursor: ew-resize;
                    background: transparent;
                    position: relative;
                    z-index: 2;
                    transition: background-color 0.15s ease;
                }
                .ai-resizer:hover,
                .ai-resizer:active {
                    background-color: var(--color--orange-300, #ffb38a);
                }
            `}</style>
        </div>
    );
}
