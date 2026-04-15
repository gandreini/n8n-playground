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
        <div
            className={cn(
                "n8n-prompt-input bg-[var(--color--neutral-125)] border border-[var(--color--black-alpha-100)] rounded-2xl p-2 shadow-sm",
                className,
            )}
        >
            <div className="relative bg-white border border-[var(--color--black-alpha-100)] rounded-[var(--radius--xs)] shadow-sm min-h-[80px] p-2.5 pb-10">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className="w-full h-full resize-none text-[length:var(--font-size--xs)] text-[color:var(--color--neutral-800)] bg-transparent outline-none placeholder:text-[color:var(--color--neutral-400)] disabled:cursor-not-allowed"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={cn(
                        "absolute bottom-1.5 right-1.5 w-7 h-7 rounded-[var(--radius--3xs)] flex items-center justify-center transition-snappy",
                        canSubmit
                            ? "bg-[var(--color--orange-400)] hover:bg-[var(--color--orange-500)]"
                            : "bg-[var(--color--neutral-200)] cursor-not-allowed",
                    )}
                >
                    <ArrowUp className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
}
