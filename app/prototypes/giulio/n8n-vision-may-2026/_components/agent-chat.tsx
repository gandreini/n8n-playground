"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Plus,
    ChevronRight,
    Copy,
    RefreshCw,
    MoreHorizontal,
    Check,
    Loader2,
} from "lucide-react";
import { Composer } from "./composer";
import { AGENTS } from "./agents-data";

interface AgentChat {
    id: string;
    title: string;
}

const MOCK_CHATS: AgentChat[] = [
    { id: "ch1", title: "Create a news summarization workflow" },
    { id: "ch2", title: "Create me a workflow that summarizes" },
];

interface AgentChatProps {
    agentId: string;
    onBack: () => void;
    onOpenSettings: (agentId: string) => void;
}

export function AgentChatView({ agentId, onBack, onOpenSettings }: AgentChatProps) {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [composerValue, setComposerValue] = useState("");
    const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[0];
    const selectedChat = MOCK_CHATS.find((c) => c.id === selectedChatId);
    const headerTitle = selectedChat?.title ?? "";

    return (
        <div className="agent-chat">
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
                        onClick={() => setSelectedChatId(null)}
                    >
                        <span className="new-chat-icon">
                            <Plus />
                        </span>
                        <span>New chat</span>
                    </button>
                </div>

                <div className="chat-list n8n-scrollbar">
                    <div className="chat-group">
                        <div className="group-label">Today</div>
                        {MOCK_CHATS.map((chat) => (
                            <button
                                key={chat.id}
                                className="chat-item"
                                data-active={
                                    chat.id === selectedChatId ? "true" : undefined
                                }
                                onClick={() => setSelectedChatId(chat.id)}
                            >
                                <span className="chat-title">{chat.title}</span>
                                <span
                                    className="chat-menu"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            <div className="main">
                <div className="top-bar">
                    <span className="header-title">{headerTitle}</span>
                    <div className="top-bar-right">
                        <button
                            className="settings-link"
                            onClick={() => onOpenSettings(agentId)}
                            title="Open settings"
                        >
                            <span className="status-dots">
                                <span />
                                <span />
                                <span />
                            </span>
                        </button>
                    </div>
                </div>

                <div className="content">
                    {selectedChat ? (
                        <ConversationThread title={selectedChat.title} agentName={agent.name} />
                    ) : (
                        <div className="empty">
                            <h1 className="agent-name">n8n Agent</h1>
                            <Composer
                                placeholder="Send a message..."
                                leftButton="paperclip"
                                showAgentSelect={false}
                                value={composerValue}
                                onChange={setComposerValue}
                            />
                        </div>
                    )}

                    {selectedChat && (
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

            <style jsx>{`
                .agent-chat {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }

                /* SUB-SIDEBAR (matches AI Assistant) */
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
                .chat-item:hover .chat-menu {
                    opacity: 1;
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
                .chat-menu {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    color: var(--color--neutral-500);
                    opacity: 0;
                    transition: opacity var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .chat-menu :global(svg) {
                    width: 14px;
                    height: 14px;
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
                    justify-content: space-between;
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    border-bottom: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    flex-shrink: 0;
                }
                .header-title {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                    padding-left: var(--spacing--2xs);
                }
                .top-bar-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                }
                .settings-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 8px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .settings-link:hover {
                    background-color: var(--color--neutral-100);
                }
                .status-dots {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                .status-dots span {
                    display: block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--color--neutral-200);
                }

                .content {
                    position: relative;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .empty {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing--md);
                    padding: var(--spacing--xl);
                }
                .agent-name {
                    font-size: 22px;
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
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
            `}</style>
        </div>
    );
}

interface ConversationThreadProps {
    title: string;
    agentName: string;
}

function ConversationThread({ title }: ConversationThreadProps) {
    return (
        <div className="thread n8n-scrollbar">
            <div className="thread-inner">
                <div className="user-msg">
                    <p>Create a weekly report of competitor news.</p>
                    <p>
                        Look at Gumloop, Notion, Claude Code, CrewAI and more agent
                        platforms.
                    </p>
                    <p>&nbsp;</p>
                    <p>I want to get this every Monday at 9AM and also on demand.</p>
                    <p>
                        I want to be able to ask questions about the news to brainstorm
                        ideas.
                    </p>
                </div>

                <div className="assistant-msg">
                    <p>I&apos;ll configure an agent to compile competitor news</p>
                    <p>and deliver a weekly report on a set schedule.</p>

                    <div className="steps">
                        <div className="step done">
                            <Check />
                            <span>Researching tool availability</span>
                        </div>
                        <div className="step done">
                            <Check />
                            <span>Creating agent</span>
                        </div>
                        <div className="step done">
                            <Check />
                            <span>Adding tools</span>
                        </div>
                        <div className="step pending">
                            <Loader2 className="spin" />
                            <span>Adding schedule trigger</span>
                        </div>
                    </div>

                    <p>Done! Here is your agent.</p>
                    <p>&nbsp;</p>
                    <p>
                        I added a schedule trigger for Monday at 9AM as well as Firecrawl
                        and HackerNews to search for competitors announcements or
                        releases to prepare.
                    </p>
                    <p>If you want to change anything, let me know.</p>

                    <button className="agent-card">
                        <span className="agent-card-icon">📰</span>
                        <span className="agent-card-info">
                            <span className="agent-card-name">Competitor News Agent</span>
                            <span className="agent-card-meta">
                                Last updated now • Created 30 Mar
                            </span>
                        </span>
                        <ChevronRight />
                    </button>

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
