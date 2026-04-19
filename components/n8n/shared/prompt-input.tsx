"use client";

import { useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    className?: string;
}

export function PromptInput({
    value: controlledValue,
    onChange,
    onSubmit,
    placeholder = "Type a message...",
    rows = 2,
    disabled = false,
    className,
}: PromptInputProps) {
    const [internalValue, setInternalValue] = useState("");
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const setValue = (next: string) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next);
    };

    const handleSubmit = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSubmit?.(trimmed);
        if (!isControlled) setInternalValue("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const canSubmit = value.trim().length > 0 && !disabled;

    return (
        <div className={cn("n8n-prompt-input", className)}>
            <div className="inner">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className="textarea"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    data-can-submit={canSubmit ? "true" : undefined}
                    className="submit"
                >
                    <ArrowUp style={{ width: 16, height: 16, color: "white" }} />
                </button>
            </div>

            <style jsx>{`
                .n8n-prompt-input {
                    background-color: var(--color--neutral-125);
                    border: 1px solid var(--color--black-alpha-100);
                    border-radius: 16px;
                    padding: var(--spacing--2xs);
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }
                .inner {
                    position: relative;
                    background-color: white;
                    border: 1px solid var(--color--black-alpha-100);
                    border-radius: var(--radius--xs);
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                    min-height: 80px;
                    padding: 10px 10px 40px;
                }
                .textarea {
                    width: 100%;
                    height: 100%;
                    resize: none;
                    font-size: var(--font-size--xs);
                    color: var(--color--neutral-800);
                    background: transparent;
                    outline: none;
                    border: 0;
                    font-family: inherit;
                }
                .textarea::placeholder {
                    color: var(--color--neutral-400);
                }
                .textarea:disabled {
                    cursor: not-allowed;
                }
                .submit {
                    position: absolute;
                    bottom: 6px;
                    right: 6px;
                    width: 28px;
                    height: 28px;
                    border: 0;
                    border-radius: var(--radius--3xs);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                    background-color: var(--color--neutral-200);
                    cursor: not-allowed;
                }
                .submit[data-can-submit="true"] {
                    background-color: var(--color--orange-400);
                    cursor: pointer;
                }
                .submit[data-can-submit="true"]:hover {
                    background-color: var(--color--orange-500);
                }
            `}</style>
        </div>
    );
}
