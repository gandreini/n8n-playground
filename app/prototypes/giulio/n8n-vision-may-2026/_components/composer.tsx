"use client";

import {
    Plus,
    Paperclip,
    Mic,
    ArrowUp,
    ChevronDown,
} from "lucide-react";

export type ComposerLeftButton = "plus" | "paperclip" | "none";

interface ComposerProps {
    placeholder?: string;
    leftButton?: ComposerLeftButton;
    showAgentSelect?: boolean;
    showMic?: boolean;
    minHeight?: number;
    value?: string;
    onChange?: (value: string) => void;
    onSend?: (value: string) => void;
}

export function Composer({
    placeholder = "Ask anything...",
    leftButton = "plus",
    showAgentSelect = false,
    showMic = true,
    minHeight = 40,
    value,
    onChange,
    onSend,
}: ComposerProps) {
    const handleSend = () => {
        if (onSend && value) onSend(value);
    };

    const isEmpty = !value || value.length === 0;

    return (
        <div className="composer">
            <textarea
                className="composer-input"
                placeholder={placeholder}
                rows={1}
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                style={{ minHeight: `${minHeight}px` }}
            />

            <div className="composer-bottom">
                <div className="composer-bottom-left">
                    {leftButton !== "none" && (
                        <button
                            className="composer-icon-btn"
                            aria-label={leftButton === "plus" ? "Add" : "Attach"}
                        >
                            {leftButton === "plus" ? <Plus /> : <Paperclip />}
                        </button>
                    )}
                </div>

                <div className="composer-bottom-right">
                    {showAgentSelect && (
                        <button className="agent-select">
                            <span>Agent</span>
                            <ChevronDown />
                        </button>
                    )}
                    {showMic && (
                        <button className="composer-icon-btn" aria-label="Voice">
                            <Mic />
                        </button>
                    )}
                    <button
                        className="composer-send"
                        aria-label="Send"
                        data-empty={isEmpty ? "true" : undefined}
                        onClick={handleSend}
                    >
                        <ArrowUp />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .composer {
                    width: 100%;
                    max-width: 680px;
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing--md);
                    padding: var(--spacing--xs);
                    background-color: var(--color--background--light-2);
                    border: 1px solid var(--color--black-alpha-200);
                    border-radius: var(--radius--xl);
                    box-shadow: 0 10px 24px 0
                        color-mix(
                            in srgb,
                            var(--color--foreground--shade-2) 6%,
                            transparent
                        );
                    outline: 1px solid transparent;
                    outline-offset: 2px;
                }
                .composer:focus-within {
                    outline: var(--focus--border-width, 1px) solid
                        var(--focus--border-color, var(--color--secondary));
                }
                .composer-input {
                    width: 100%;
                    border: 0;
                    outline: none;
                    background: transparent;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 20px;
                    color: var(--color--neutral-800);
                    padding: 0;
                }
                .composer-input:focus,
                .composer-input:focus-visible {
                    outline: none;
                    box-shadow: none;
                }
                .composer-input::placeholder {
                    color: #828282;
                }

                .composer-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing--3xs);
                }
                .composer-bottom-left,
                .composer-bottom-right {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .agent-select {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    height: 36px;
                    padding: 0 12px;
                    border: 0;
                    background: transparent;
                    border-radius: 4px;
                    color: var(--color--neutral-800);
                    font-size: 14px;
                    line-height: 20px;
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .agent-select:hover {
                    background-color: var(--color--neutral-100);
                }
                .agent-select :global(svg) {
                    width: 16px;
                    height: 16px;
                    color: var(--color--neutral-500);
                }

                .composer-icon-btn {
                    width: 36px;
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 0;
                    background: transparent;
                    border-radius: 6px;
                    color: var(--color--neutral-700);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy)
                        var(--easing--ease-out);
                }
                .composer-icon-btn:hover {
                    background-color: var(--color--neutral-100);
                }
                .composer-icon-btn :global(svg) {
                    width: 16px;
                    height: 16px;
                }

                .composer-send {
                    width: 36px;
                    height: 36px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 0;
                    border-radius: 6px;
                    background-color: var(--color--primary);
                    color: white;
                    cursor: pointer;
                    transition: opacity var(--duration--snappy)
                        var(--easing--ease-out),
                        background-color var(--duration--snappy)
                            var(--easing--ease-out);
                }
                .composer-send[data-empty="true"] {
                    opacity: 0.5;
                }
                .composer-send:hover {
                    opacity: 1;
                }
                .composer-send :global(svg) {
                    width: 20px;
                    height: 20px;
                }
            `}</style>
        </div>
    );
}
