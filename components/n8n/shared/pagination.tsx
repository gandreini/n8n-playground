"use client";

import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./icon-button";

interface PaginationProps {
    total: number;
    currentPage?: number;
    pageSize?: number;
    className?: string;
}

export function Pagination({ total, currentPage = 1, pageSize = 100, className }: PaginationProps) {
    return (
        <div
            className={cn(
                "n8n-pagination flex items-center justify-end gap-4 px-4 py-3 text-[length:var(--font-size--sm)] text-[color:var(--color--neutral-500)]",
                className,
            )}
        >
            <span>Total {total}</span>
            <div className="flex items-center gap-1">
                <IconButton
                    icon={<ChevronLeft className="w-4 h-4" />}
                    size="sm"
                    label="Previous page"
                />
                {[1, 2, 3, 4].map((page) => (
                    <button
                        key={page}
                        className={cn(
                            "w-7 h-7 rounded-[var(--radius--3xs)] text-[length:var(--font-size--sm)]",
                            page === currentPage
                                ? "border border-[var(--color--orange-300)] text-[color:var(--color--orange-300)]"
                                : "hover:bg-[var(--color--neutral-100)]",
                        )}
                    >
                        {page}
                    </button>
                ))}
                <IconButton
                    icon={<ChevronRight className="w-4 h-4" />}
                    size="sm"
                    label="Next page"
                />
            </div>
            <div className="flex items-center gap-1">
                <span>{pageSize}/page</span>
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
}
