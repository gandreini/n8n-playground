"use client";

import { useState } from "react";
import { ArrowLeft, Folder, Plus, MoreHorizontal } from "lucide-react";
import { PROJECTS, type Chat, type Project } from "./projects-data";
import { Composer } from "./composer";

interface ProjectViewProps {
    projectId: string;
    onBack: () => void;
}

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
    const project: Project =
        PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0];

    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [composerValue, setComposerValue] = useState("");

    const chatsByGroup: Record<Chat["group"], Chat[]> = {
        today: project.chats.filter((c) => c.group === "today"),
        yesterday: project.chats.filter((c) => c.group === "yesterday"),
        previous: project.chats.filter((c) => c.group === "previous"),
    };

    const groupLabels: Record<Chat["group"], string> = {
        today: "Today",
        yesterday: "Yesterday",
        previous: "Previous",
    };

    const selectedChat = project.chats.find((c) => c.id === selectedChatId) ?? null;
    const headerTitle = selectedChat?.title ?? project.name;

    return (
        <div className="project-view">
            <aside className="sub-sidebar">
                <div className="back-row">
                    <button className="back-btn" onClick={onBack}>
                        <ArrowLeft />
                        <span>Back</span>
                    </button>
                </div>

                <div className="project-header">
                    <span className="project-avatar">
                        <Folder />
                    </span>
                    <span className="project-name">{project.name}</span>
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
                    {(["today", "yesterday", "previous"] as const).map((group) =>
                        chatsByGroup[group].length === 0 ? null : (
                            <div className="chat-group" key={group}>
                                <div className="group-label">
                                    {groupLabels[group]}
                                </div>
                                {chatsByGroup[group].map((chat) => (
                                    <button
                                        key={chat.id}
                                        className="chat-item"
                                        data-active={
                                            chat.id === selectedChatId
                                                ? "true"
                                                : undefined
                                        }
                                        onClick={() => setSelectedChatId(chat.id)}
                                    >
                                        <span className="chat-title">
                                            {chat.title}
                                        </span>
                                        <span
                                            className="chat-menu"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreHorizontal />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ),
                    )}
                    {project.chats.length === 0 && (
                        <p className="empty">No chats yet</p>
                    )}
                </div>
            </aside>

            <div className="main">
                <div className="top-bar">
                    <span className="header-title">{headerTitle}</span>
                </div>

                <div className="content">
                    <div className="empty-state">
                        <h1 className="project-name-large">{project.name}</h1>
                        <p className="project-description">{project.description}</p>
                        <Composer
                            placeholder="Send a message..."
                            leftButton="paperclip"
                            showAgentSelect={false}
                            value={composerValue}
                            onChange={setComposerValue}
                        />
                    </div>
                </div>
            </div>

            <aside className="artifacts">
                <p className="placeholder">Artifacts panel</p>
            </aside>

            <style jsx>{`
                .project-view {
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

                .project-header {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    margin: 0 var(--spacing--3xs);
                    border-radius: var(--radius--3xs);
                }
                .project-avatar {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border-radius: 4px;
                    background-color: var(--color--orange-200);
                    color: var(--color--neutral-800);
                    flex-shrink: 0;
                }
                .project-avatar :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .project-name {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
                .empty {
                    padding: var(--spacing--md) var(--spacing--xs);
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                    text-align: center;
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

                /* ARTIFACTS (placeholder) */
                .artifacts {
                    width: 272px;
                    flex-shrink: 0;
                    height: 100%;
                    border-left: 1px solid
                        var(--border-color--subtle, var(--color--black-alpha-100));
                    background-color: var(--color--neutral-white);
                    padding: var(--spacing--sm);
                }
                .placeholder {
                    color: var(--color--neutral-400);
                    font-size: var(--font-size--xs);
                }
            `}</style>
        </div>
    );
}
