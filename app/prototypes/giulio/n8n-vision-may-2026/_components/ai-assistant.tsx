"use client";

import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Plus,
    PanelRight,
    MoreHorizontal,
    ChevronDown,
    ArrowRight,
    Search,
    X,
    Link2,
    Table,
    CheckCircle2,
    LoaderCircle,
    Circle,
} from "lucide-react";
import { Composer } from "./composer";
import {
    CONVERSATIONS,
    CHAT_GROUP_LABELS as GROUP_LABELS,
    CHAT_GROUP_ORDER,
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
}

export function AIAssistant({ onBack, showSubSidebar = false }: AIAssistantProps) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>(() => makeId("s"));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyView, setHistoryView] = useState(false);
    const [historySearch, setHistorySearch] = useState("");
    const threadEndRef = useRef<HTMLDivElement>(null);

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
                                            onClick={() => startFreshChat(chat.id)}
                                        >
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
                                                            startFreshChat(chat.id);
                                                            setHistoryOpen(false);
                                                        }}
                                                    >
                                                        {chat.title}
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
                    <div className="top-bar-right">
                        <button className="icon-btn" aria-label="More">
                            <MoreHorizontal />
                        </button>
                        <button
                            className="icon-btn"
                            aria-label={rightPanelOpen ? "Hide artifacts panel" : "Show artifacts panel"}
                            aria-pressed={rightPanelOpen}
                            data-active={rightPanelOpen ? "true" : undefined}
                            onClick={() => setRightPanelOpen((open) => !open)}
                        >
                            <PanelRight />
                        </button>
                    </div>
                </div>

                <div className="below-top-bar">
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
                                                    startFreshChat(chat.id);
                                                    setHistoryView(false);
                                                }}
                                            >
                                                {chat.title}
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
                        <>
                            <h1 className="title">AI Assistant</h1>

                            <Composer
                                placeholder="Ask anything..."
                                leftButton="plus"
                                showAgentSelect
                                value={input}
                                onChange={setInput}
                                onSend={handleSend}
                            />
                        </>
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

                    {rightPanelOpen && (
                    <aside className="right-panel">
                <div className="panel-box">
                    <div className="panel-header">Artifacts</div>
                    <button className="panel-row">
                        <Link2 />
                        <span>Record store scraper</span>
                    </button>
                    <button className="panel-row">
                        <Table />
                        <span>hardwax_vinyl_releases</span>
                    </button>
                </div>

                <div className="panel-box">
                    <div className="panel-header">
                        <span>Tasks</span>
                        <span className="counter">1/4</span>
                    </div>
                    <div className="panel-row task" data-status="done">
                        <CheckCircle2 />
                        <span>Check existing credentials for…</span>
                    </div>
                    <div className="panel-row task" data-status="done">
                        <CheckCircle2 />
                        <span>Check existing credentials for…</span>
                    </div>
                    <div className="panel-row task" data-status="active">
                        <LoaderCircle className="spin" />
                        <span>Text the workflow execution</span>
                    </div>
                    <div className="panel-row task" data-status="todo">
                        <Circle />
                        <span>Provide access URLs and usa…</span>
                    </div>
                </div>
            </aside>
                    )}
                </div>
            </div>

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
                    padding: var(--spacing--4xs) var(--spacing--2xs);
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
                .chat-title {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    line-height: var(--font-line-height--loose);
                }

                /* MAIN AREA */
                .rest-of-app {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .below-top-bar {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                }
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
                    justify-content: space-between;
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    flex-shrink: 0;
                }
                .top-bar-left,
                .top-bar-right {
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
                    justify-content: center;
                    /* Bias the centering upward so the title + composer
                       group reads as visually balanced (title above the
                       composer otherwise makes the optical center feel low). */
                    padding: var(--spacing--xl) var(--spacing--xl) 18vh;
                    gap: var(--spacing--md);
                }
                .title {
                    font-size: var(--font-size--xl);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }

                /* CONVERSATION THREAD */
                .thread {
                    flex: 1;
                    min-height: 0;
                    overflow-y: auto;
                    padding: var(--spacing--lg) 0;
                }
                .thread-inner {
                    max-width: 680px;
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

                /* RIGHT PANEL — sidebar treatment */
                .right-panel {
                    width: 260px;
                    flex-shrink: 0;
                    padding: var(--spacing--xs) var(--spacing--3xs);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--xs);
                    overflow-y: auto;
                    border-left: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background-color: var(
                        --menu--color--background,
                        var(--color--neutral-50)
                    );
                }
                .panel-box {
                    background: transparent;
                    border: 0;
                    border-radius: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }
                .panel-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    font-size: var(--font-size--3xs);
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-400);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .counter {
                    color: var(--color--neutral-400);
                    font-weight: var(--font-weight--regular);
                    font-size: var(--font-size--3xs);
                    text-transform: none;
                    letter-spacing: 0;
                }
                .panel-row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    line-height: 1.3;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                button.panel-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .panel-row :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                    flex-shrink: 0;
                }
                .panel-row span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .panel-row.task[data-status="done"] {
                    color: var(--color--neutral-400);
                    text-decoration: line-through;
                }
                .panel-row.task[data-status="done"] :global(svg) {
                    color: rgb(34, 197, 94);
                }
                .panel-row.task[data-status="active"] :global(svg) {
                    color: var(--color--neutral-400);
                }
                .panel-row.task[data-status="todo"] :global(svg) {
                    color: var(--color--neutral-300);
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
                    padding: var(--spacing--3xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    color: var(--color--neutral-700);
                    font-size: var(--font-size--xs);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
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
                .history-item:hover {
                    background-color: var(--color--neutral-50);
                    border-color: var(--color--black-alpha-200);
                }
            `}</style>
        </div>
    );
}
