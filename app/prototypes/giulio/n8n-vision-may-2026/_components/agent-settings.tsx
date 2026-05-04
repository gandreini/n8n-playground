"use client";

import { useState } from "react";
import {
    PanelLeftClose,
    PanelRight,
    ChevronDown,
    ChevronRight,
    Plus,
    MoreHorizontal,
} from "lucide-react";
import { Composer } from "./composer";
import { AGENTS } from "./agents-data";

interface AgentSettingsProps {
    agentId: string;
    onCancel: () => void;
    onSave: () => void;
}

export function AgentSettings({ agentId, onCancel, onSave }: AgentSettingsProps) {
    const agent = AGENTS.find((a) => a.id === agentId) ?? AGENTS[1];
    const [composerValue, setComposerValue] = useState("");
    const [instructions, setInstructions] = useState(
        `A data analyst for your Snowflake warehouse. It explores tables, answers questions with SQL, and documents what it learns along the way so it gets smarter over time.\n\nYou can:`,
    );
    const [triggersOpen, setTriggersOpen] = useState(true);
    const [toolsOpen, setToolsOpen] = useState(true);
    const [advancedOpen, setAdvancedOpen] = useState(false);

    return (
        <div className="agent-settings">
            <div className="top-bar">
                <div className="top-bar-left">
                    <span className="agent-title">{agent.name}</span>
                </div>
                <div className="top-bar-center">
                    <button className="icon-btn" aria-label="Toggle outline">
                        <PanelLeftClose />
                    </button>
                    <button className="icon-btn" aria-label="Toggle settings panel">
                        <PanelRight />
                    </button>
                </div>
                <div className="top-bar-right">
                    <button className="link-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="primary-btn" onClick={onSave}>
                        Save
                    </button>
                </div>
            </div>

            <div className="body">
                <div className="chat-pane">
                    <div className="agent-header">
                        <span className="agent-emoji" style={{ backgroundColor: agent.avatarBg }}>
                            {agent.avatar}
                        </span>
                        <h1 className="agent-name">{agent.name}</h1>
                        <p className="agent-desc">
                            Explores tables, answers questions with SQL,
                            <br />
                            and documents from Snowflake
                        </p>
                    </div>

                    <div className="composer-pin">
                        <Composer
                            placeholder="Send a message..."
                            leftButton="paperclip"
                            showAgentSelect={false}
                            value={composerValue}
                            onChange={setComposerValue}
                        />
                    </div>
                </div>

                <aside className="settings-pane">
                    <h2 className="settings-title">Settings</h2>

                    <div className="field">
                        <div className="field-header">
                            <label>Model</label>
                            <button className="field-action" aria-label="More">
                                <MoreHorizontal />
                            </button>
                        </div>
                        <button className="select-row">
                            <span className="model-icon">✦</span>
                            <span className="model-name">Claude Opus 4.6</span>
                            <span className="model-account">Anthropic Account</span>
                            <ChevronDown />
                        </button>
                    </div>

                    <div className="field">
                        <label>Instructions</label>
                        <textarea
                            className="instructions"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <details
                        className="section"
                        open={triggersOpen}
                        onToggle={(e) => setTriggersOpen(e.currentTarget.open)}
                    >
                        <summary>
                            <span className="section-chevron">
                                {triggersOpen ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <span className="section-title">Triggers</span>
                            <button
                                className="section-add"
                                aria-label="Add trigger"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Plus />
                            </button>
                        </summary>
                        <div className="section-body">
                            <div className="row">
                                <span className="row-icon">💬</span>
                                <span className="row-label">n8n Chat</span>
                            </div>
                        </div>
                    </details>

                    <details
                        className="section"
                        open={toolsOpen}
                        onToggle={(e) => setToolsOpen(e.currentTarget.open)}
                    >
                        <summary>
                            <span className="section-chevron">
                                {toolsOpen ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <span className="section-title">Tools</span>
                            <button
                                className="section-add"
                                aria-label="Add tool"
                                onClick={(e) => e.preventDefault()}
                            >
                                <Plus />
                            </button>
                        </summary>
                        <div className="section-body">
                            <div className="row">
                                <span className="row-icon snowflake">❄</span>
                                <span className="row-label">
                                    <strong>Snowflake</strong> Snowflake Account
                                </span>
                            </div>
                            <div className="row">
                                <span className="row-icon">⚙️</span>
                                <span className="row-label">
                                    <strong>Get Data from Wharehouse</strong> Workflow
                                </span>
                            </div>
                        </div>
                    </details>

                    <details
                        className="section"
                        open={advancedOpen}
                        onToggle={(e) => setAdvancedOpen(e.currentTarget.open)}
                    >
                        <summary>
                            <span className="section-chevron">
                                {advancedOpen ? <ChevronDown /> : <ChevronRight />}
                            </span>
                            <span className="section-title">Advanced</span>
                        </summary>
                    </details>
                </aside>
            </div>

            <style jsx>{`
                .agent-settings {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    background-color: var(--color--background-base);
                }
                .top-bar {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    height: 48px;
                    padding: 0 var(--spacing--xs);
                    border-bottom: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    flex-shrink: 0;
                }
                .top-bar-left {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding-left: var(--spacing--2xs);
                }
                .agent-title {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                }
                .top-bar-center {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--4xs);
                    justify-content: center;
                }
                .top-bar-right {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    justify-content: flex-end;
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
                        var(--easing--ease-out);
                }
                .icon-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .icon-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                .link-btn {
                    height: 30px;
                    padding: 0 var(--spacing--xs);
                    border: 0;
                    background: transparent;
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    border-radius: var(--radius--3xs);
                }
                .link-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .primary-btn {
                    height: 30px;
                    padding: 0 var(--spacing--md);
                    border: 0;
                    background-color: var(--color--primary);
                    color: white;
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    border-radius: var(--radius--3xs);
                    transition: opacity var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .primary-btn:hover {
                    opacity: 0.9;
                }

                .body {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    overflow: hidden;
                }

                /* CHAT PANE */
                .chat-pane {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    overflow: hidden;
                    border-right: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                }
                .agent-header {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--xl);
                    text-align: center;
                }
                .agent-emoji {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: var(--radius--3xs);
                    font-size: 20px;
                    margin-bottom: var(--spacing--3xs);
                }
                .agent-name {
                    font-size: var(--font-size--lg);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .agent-desc {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                    line-height: var(--font-line-height--loose);
                }
                .composer-pin {
                    flex-shrink: 0;
                    display: flex;
                    justify-content: center;
                    padding: var(--spacing--md) var(--spacing--xl);
                }

                /* SETTINGS PANE */
                .settings-pane {
                    height: 100%;
                    overflow-y: auto;
                    padding: var(--spacing--md);
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                    background-color: var(--color--background-base);
                }
                .settings-title {
                    font-size: var(--font-size--md);
                    font-weight: var(--font-weight--semibold);
                    color: var(--color--neutral-800);
                }
                .field {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                }
                .field-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .field label {
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .field-action {
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
                }
                .field-action:hover {
                    background-color: var(--color--neutral-100);
                }
                .field-action :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .select-row {
                    display: grid;
                    grid-template-columns: auto auto 1fr auto;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) var(--spacing--2xs);
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background: white;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    text-align: left;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .select-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .model-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 18px;
                    height: 18px;
                    background-color: rgba(217, 102, 55, 0.15);
                    color: var(--color--primary);
                    border-radius: 4px;
                    font-size: 12px;
                }
                .model-name {
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .model-account {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                }
                .select-row :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-400);
                }
                .instructions {
                    width: 100%;
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    border-radius: var(--radius--3xs);
                    padding: var(--spacing--2xs) var(--spacing--3xs);
                    font-family: inherit;
                    font-size: var(--font-size--xs);
                    line-height: var(--font-line-height--loose);
                    color: var(--color--neutral-800);
                    resize: vertical;
                    min-height: 110px;
                    background: white;
                }
                .instructions:focus {
                    outline: none;
                    border-color: var(--color--primary);
                }

                .section {
                    border-top: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    padding: var(--spacing--3xs) 0;
                }
                .section summary {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    cursor: pointer;
                    list-style: none;
                    padding: var(--spacing--3xs) 0;
                }
                .section summary::-webkit-details-marker {
                    display: none;
                }
                .section-chevron {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                }
                .section-chevron :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .section-title {
                    flex: 1;
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
                .section-add {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 22px;
                    height: 22px;
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-500);
                    cursor: pointer;
                }
                .section-add:hover {
                    background-color: var(--color--neutral-100);
                }
                .section-add :global(svg) {
                    width: 14px;
                    height: 14px;
                }
                .section-body {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--3xs);
                    padding: var(--spacing--3xs) 0 var(--spacing--3xs)
                        var(--spacing--md);
                }
                .row {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                }
                .row-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .row-label {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                }
                .row-label strong {
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                }
            `}</style>
        </div>
    );
}
