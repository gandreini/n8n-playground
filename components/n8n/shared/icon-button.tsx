"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IconButtonProps {
    icon: ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    className?: string;
    size?: "sm" | "md";
    label?: string;
}

export function IconButton({ icon, onClick, className, size = "md", label }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={label}
            data-size={size}
            className={cn("n8n-icon-button", className)}
        >
            {icon}

            <style jsx>{`
                .n8n-icon-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: transparent;
                    border: 0;
                    border-radius: var(--radius--3xs);
                    cursor: pointer;
                    transition: background-color var(--duration--snappy) var(--easing--ease-out);
                }
                .n8n-icon-button[data-size="sm"] {
                    padding: 4px;
                }
                .n8n-icon-button[data-size="md"] {
                    padding: 6px;
                }
                .n8n-icon-button:hover {
                    background-color: var(--color--neutral-100);
                }
            `}</style>
        </button>
    );
}
