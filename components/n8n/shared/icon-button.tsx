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
            className={cn(
                "n8n-icon-button rounded-[var(--radius--3xs)] hover:bg-[var(--color--neutral-100)] transition-snappy flex items-center justify-center shrink-0",
                size === "sm" ? "p-1" : "p-1.5",
                className,
            )}
        >
            {icon}
        </button>
    );
}
