"use client";

import { useState } from "react";
import { FilePlus2, Puzzle } from "lucide-react";
import { Composer } from "./composer";
import { AGENT_SUGGESTIONS } from "./agents-data";

const USER_FIRST_NAME = "Rob";

export function NewAgent() {
    const [value, setValue] = useState("");

    return (
        <div className="new-agent">
            <div className="top-bar">
                <span className="title">New agent</span>
                <button className="create-blank">
                    <FilePlus2 />
                    <span>Create blank</span>
                </button>
            </div>

            <div className="content">
                <div className="content-inner">
                    <h1 className="heading">Let&apos;s build something, {USER_FIRST_NAME}</h1>

                    <Composer
                        placeholder="Describe what you're working on..."
                        leftButton="none"
                        showAgentSelect={false}
                        minHeight={120}
                        value={value}
                        onChange={setValue}
                    />

                    <div className="suggestions">
                        <div className="suggestions-label">Suggestions</div>
                        {AGENT_SUGGESTIONS.map((s) => (
                            <button key={s.id} className="suggestion-row">
                                <span className="suggestion-emoji">{s.avatar}</span>
                                <span className="suggestion-name">{s.name}</span>
                                <span className="suggestion-desc">{s.description}</span>
                                <span className="suggestion-tools">
                                    <Puzzle />
                                    <span className="tool-dots">⋯</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .new-agent {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    width: 100%;
                    background-color: var(--color--background-base);
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
                .title {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-700);
                    padding-left: var(--spacing--2xs);
                }
                .create-blank {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing--3xs);
                    height: 30px;
                    padding: 0 var(--spacing--xs);
                    border: 1px solid
                        var(--border-color--light, var(--color--neutral-150));
                    background: white;
                    border-radius: var(--radius--3xs);
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    font-size: var(--font-size--xs);
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .create-blank:hover {
                    background-color: var(--color--neutral-50);
                }
                .create-blank :global(svg) {
                    width: 14px;
                    height: 14px;
                    color: var(--color--neutral-500);
                }

                .content {
                    flex: 1;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 14vh;
                    overflow-y: auto;
                }
                .content-inner {
                    width: 100%;
                    max-width: 680px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing--md);
                    padding: 0 var(--spacing--xl);
                }
                .heading {
                    font-size: 22px;
                    font-weight: var(--font-weight--bold);
                    color: var(--color--neutral-800);
                    margin-bottom: var(--spacing--2xs);
                }

                .suggestions {
                    width: 100%;
                    margin-top: var(--spacing--xs);
                }
                .suggestions-label {
                    font-size: var(--font-size--2xs);
                    color: var(--color--neutral-400);
                    padding: 0 var(--spacing--2xs);
                    margin-bottom: var(--spacing--3xs);
                }
                .suggestion-row {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 20px auto 1fr auto;
                    align-items: center;
                    gap: var(--spacing--2xs);
                    padding: var(--spacing--2xs);
                    border: 0;
                    background: transparent;
                    border-radius: var(--radius--3xs);
                    text-align: left;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .suggestion-row:hover {
                    background-color: var(--color--neutral-50);
                }
                .suggestion-emoji {
                    font-size: 14px;
                    line-height: 1;
                }
                .suggestion-name {
                    font-size: var(--font-size--xs);
                    font-weight: var(--font-weight--medium);
                    color: var(--color--neutral-800);
                    white-space: nowrap;
                }
                .suggestion-desc {
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-500);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .suggestion-tools {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 8px;
                    border-radius: var(--radius--full);
                    background-color: rgba(34, 197, 94, 0.12);
                    color: rgb(22, 163, 74);
                }
                .suggestion-tools :global(svg) {
                    width: 12px;
                    height: 12px;
                }
                .tool-dots {
                    font-size: 10px;
                    line-height: 1;
                    color: rgb(22, 163, 74);
                }
            `}</style>
        </div>
    );
}
